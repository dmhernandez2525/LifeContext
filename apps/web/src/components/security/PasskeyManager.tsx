/**
 * PasskeyManager - Register, list, and remove WebAuthn passkeys.
 */
import { useState, useCallback } from 'react';
import { Fingerprint, Plus, Trash2, Shield, AlertCircle } from 'lucide-react';
import { useSecurityStore } from '@/store/security-store';
import {
  isWebAuthnAvailable,
  isPlatformAuthenticatorAvailable,
  registerCredential,
  authenticateCredential,
  type StoredCredential,
} from '@/lib/webauthn';
import { cn } from '@/lib/utils';

export function PasskeyManager() {
  const {
    webauthnCredentials,
    passkeyAsDefault,
    addCredential,
    removeCredential,
    setPasskeyAsDefault,
  } = useSecurityStore();

  const [registering, setRegistering] = useState(false);
  const [testing, setTesting] = useState(false);
  const [label, setLabel] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const available = isWebAuthnAvailable();

  const handleRegister = useCallback(async () => {
    if (!label.trim()) {
      setError('Please enter a label for this passkey');
      return;
    }

    setRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      const hasPlatform = await isPlatformAuthenticatorAvailable();
      if (!hasPlatform) {
        setError('No platform authenticator found. Your device may not support passkeys.');
        return;
      }

      const userId = crypto.randomUUID();
      const existingIds = webauthnCredentials.map(c => c.rawId);

      const credential = await registerCredential(
        userId,
        'LifeContext User',
        label.trim(),
        existingIds
      );

      addCredential(credential);
      setLabel('');
      setShowRegister(false);
      setSuccess('Passkey registered successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setRegistering(false);
    }
  }, [label, webauthnCredentials, addCredential]);

  const handleTest = useCallback(async () => {
    setTesting(true);
    setError(null);
    setSuccess(null);

    try {
      const usedId = await authenticateCredential(webauthnCredentials);
      const cred = webauthnCredentials.find(c => c.id === usedId);
      setSuccess(`Authenticated with "${cred?.label || 'Unknown'}"!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setTesting(false);
    }
  }, [webauthnCredentials]);

  if (!available) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 text-sm">WebAuthn Not Available</h3>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              Your browser does not support WebAuthn/Passkeys. Try using Chrome, Safari, or Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-gray-900 dark:text-white">Passkeys</h3>
        </div>
        {webauthnCredentials.length > 0 && (
          <button
            onClick={() => setShowRegister(!showRegister)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Add Passkey
          </button>
        )}
      </div>

      {/* Messages */}
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

      {/* Empty state / register prompt */}
      {webauthnCredentials.length === 0 && !showRegister && (
        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <Shield className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Add a passkey to unlock LifeContext with your fingerprint, face, or device PIN.
          </p>
          <button
            onClick={() => setShowRegister(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Register First Passkey
          </button>
        </div>
      )}

      {/* Registration form */}
      {showRegister && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-xl space-y-3">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder='Label (e.g. "MacBook Pro", "iPhone")'
            maxLength={50}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRegister}
              disabled={registering}
              className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {registering ? 'Registering...' : 'Register Passkey'}
            </button>
            <button
              onClick={() => { setShowRegister(false); setError(null); }}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Credential list */}
      {webauthnCredentials.length > 0 && (
        <div className="space-y-2">
          {webauthnCredentials.map((cred) => (
            <CredentialRow key={cred.id} credential={cred} onRemove={removeCredential} />
          ))}

          {/* Options */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Use passkey as default</span>
              <p className="text-xs text-gray-500">Skip passcode when passkey is available</p>
            </div>
            <button
              onClick={() => setPasskeyAsDefault(!passkeyAsDefault)}
              className={cn(
                "relative w-10 h-5 rounded-full transition-colors",
                passkeyAsDefault ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
              )}
            >
              <span className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform",
                passkeyAsDefault && "translate-x-5"
              )} />
            </button>
          </div>

          {/* Test button */}
          <button
            onClick={handleTest}
            disabled={testing}
            className="w-full px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {testing ? 'Verifying...' : 'Test Authentication'}
          </button>
        </div>
      )}
    </div>
  );
}

function CredentialRow({ credential, onRemove }: { credential: StoredCredential; onRemove: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
      <div className="flex items-center gap-3">
        <Fingerprint className="w-5 h-5 text-purple-500" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{credential.label}</p>
          <p className="text-xs text-gray-500">
            Added {new Date(credential.createdAt).toLocaleDateString()}
            {credential.lastUsed > credential.createdAt && (
              <> &middot; Last used {new Date(credential.lastUsed).toLocaleDateString()}</>
            )}
          </p>
        </div>
      </div>
      <button
        onClick={() => onRemove(credential.id)}
        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
        title="Remove passkey"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
