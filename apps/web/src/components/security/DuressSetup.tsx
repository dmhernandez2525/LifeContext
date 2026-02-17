/**
 * DuressSetup - Configure a duress/panic password that shows decoy data.
 */
import { useState, useCallback } from 'react';
import { ShieldAlert, Eye, EyeOff, AlertTriangle, Check } from 'lucide-react';
import { useSecurityStore } from '@/store/security-store';
import { hashPasscode } from '@lcc/encryption';
import { cn } from '@/lib/utils';

const SECURITY_STORAGE_KEY = 'lcc-security';

export function DuressSetup() {
  const { duressEnabled, setDuressEnabled, setDuressHash } = useSecurityStore();

  const [showSetup, setShowSetup] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setError(null);

    if (password.length < 6) {
      setError('Duress password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    // Ensure it differs from the real passcode
    const securityData = localStorage.getItem(SECURITY_STORAGE_KEY);
    if (securityData) {
      const { salt, hash: realHash } = JSON.parse(securityData);
      const duressHashCheck = await hashPasscode(password, salt);
      if (duressHashCheck === realHash) {
        setError('Duress password cannot be the same as your real passcode');
        return;
      }
    }

    setSaving(true);
    try {
      const salt = localStorage.getItem(SECURITY_STORAGE_KEY)
        ? JSON.parse(localStorage.getItem(SECURITY_STORAGE_KEY)!).salt
        : '';

      const hash = await hashPasscode(password, salt);
      setDuressHash(hash);
      setDuressEnabled(true);
      setPassword('');
      setConfirm('');
      setShowSetup(false);
      setSuccess('Duress password configured successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to save duress password');
    } finally {
      setSaving(false);
    }
  }, [password, confirm, setDuressHash, setDuressEnabled]);

  const handleDisable = useCallback(() => {
    setDuressEnabled(false);
    setDuressHash(null);
    setSuccess('Duress password removed');
    setTimeout(() => setSuccess(null), 3000);
  }, [setDuressEnabled, setDuressHash]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-gray-900 dark:text-white">Duress Password</h3>
        </div>
        {duressEnabled && (
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <Check className="w-3.5 h-3.5" /> Active
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        If you're forced to unlock the app, enter this password instead.
        It will show harmless decoy data while your real entries stay hidden.
      </p>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-300">
          {success}
        </div>
      )}

      {!showSetup && !duressEnabled && (
        <button
          onClick={() => setShowSetup(true)}
          className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Set Up Duress Password
        </button>
      )}

      {duressEnabled && !showSetup && (
        <div className="flex gap-2">
          <button
            onClick={() => setShowSetup(true)}
            className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            Change Password
          </button>
          <button
            onClick={handleDisable}
            className="px-4 py-2.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-sm font-medium transition-colors"
          >
            Disable
          </button>
        </div>
      )}

      {showSetup && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl space-y-3">
          <div className="flex gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>This must be different from your real passcode. Anyone entering it will see fake data.</span>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Duress password..."
              className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm duress password..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                saving ? "bg-gray-300 text-gray-500" : "bg-red-600 hover:bg-red-700 text-white"
              )}
            >
              {saving ? 'Saving...' : 'Save Duress Password'}
            </button>
            <button
              onClick={() => { setShowSetup(false); setError(null); }}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
