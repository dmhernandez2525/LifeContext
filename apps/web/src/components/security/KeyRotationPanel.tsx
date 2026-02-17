/**
 * KeyRotationPanel - Manage encryption key rotation schedule and trigger rotations.
 */
import { useState, useCallback, useMemo } from 'react';
import { RefreshCw, Clock, Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useSecurityStore } from '@/store/security-store';
import { rotatePasscodeCredentials, isRotationDue, getRotationAge } from '@/lib/keyRotation';
import { hashPasscode } from '@lcc/encryption';
import { cn } from '@/lib/utils';

const SECURITY_STORAGE_KEY = 'lcc-security';

const REMINDER_OPTIONS = [
  { value: 30, label: '30 days' },
  { value: 60, label: '60 days' },
  { value: 90, label: '90 days' },
  { value: 180, label: '6 months' },
  { value: 365, label: '1 year' },
];

export function KeyRotationPanel() {
  const {
    lastKeyRotation,
    keyRotationReminder,
    setLastKeyRotation,
    setKeyRotationReminder,
  } = useSecurityStore();

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [showRotate, setShowRotate] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const rotationDue = useMemo(
    () => isRotationDue(lastKeyRotation, keyRotationReminder),
    [lastKeyRotation, keyRotationReminder]
  );

  const rotationAge = useMemo(
    () => getRotationAge(lastKeyRotation),
    [lastKeyRotation]
  );

  const handleRotate = useCallback(async () => {
    setError(null);

    if (passcode.length < 6) {
      setError('Enter your current passcode to rotate keys');
      return;
    }

    // Verify the passcode is correct first
    const securityData = localStorage.getItem(SECURITY_STORAGE_KEY);
    if (!securityData) {
      setError('No security credentials found');
      return;
    }

    const { salt, hash } = JSON.parse(securityData);
    const enteredHash = await hashPasscode(passcode, salt);
    if (enteredHash !== hash) {
      setError('Incorrect passcode');
      return;
    }

    setRotating(true);
    try {
      const result = await rotatePasscodeCredentials(passcode);
      if (result.success) {
        setLastKeyRotation(result.rotatedAt);
        setPasscode('');
        setShowRotate(false);
        setSuccess('Keys rotated successfully! New salt generated.');
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch {
      setError('Key rotation failed. Please try again.');
    } finally {
      setRotating(false);
    }
  }, [passcode, setLastKeyRotation]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-gray-900 dark:text-white">Key Rotation</h3>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Periodically rotate your encryption salt to limit the window of exposure if credentials are compromised.
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

      {/* Status card */}
      <div className={cn(
        "p-4 rounded-xl border",
        rotationDue
          ? "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800"
          : "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
      )}>
        <div className="flex items-center gap-3">
          {rotationDue ? (
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          ) : (
            <Shield className="w-5 h-5 text-green-600" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {rotationDue ? 'Rotation recommended' : 'Keys are current'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {rotationAge}
            </p>
          </div>
        </div>
      </div>

      {/* Reminder interval */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <span className="text-sm text-gray-700 dark:text-gray-300">Remind every</span>
        <select
          value={keyRotationReminder}
          onChange={(e) => setKeyRotationReminder(Number(e.target.value))}
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
        >
          {REMINDER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Rotate button / form */}
      {!showRotate ? (
        <button
          onClick={() => setShowRotate(true)}
          className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Rotate Keys Now
        </button>
      ) : (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl space-y-3">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Enter your current passcode to generate a new encryption salt.
          </p>
          <div className="relative">
            <input
              type={showPasscode ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Current passcode..."
              className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRotate}
              disabled={rotating}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {rotating ? 'Rotating...' : 'Confirm Rotation'}
            </button>
            <button
              onClick={() => { setShowRotate(false); setError(null); }}
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
