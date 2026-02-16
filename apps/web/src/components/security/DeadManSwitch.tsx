/**
 * DeadManSwitch - Configure and monitor the dead man's switch.
 */
import { useState, useMemo, useCallback } from 'react';
import { Timer, Shield, AlertTriangle, Plus, X, UserCheck } from 'lucide-react';
import { useSecurityStore } from '@/store/security-store';
import {
  getSwitchStatus,
  getActionLabel,
  getActionDescription,
  THRESHOLD_OPTIONS,
  type SwitchAction,
} from '@/lib/deadManSwitch';
import { cn } from '@/lib/utils';

const ACTION_OPTIONS: SwitchAction[] = ['notify', 'export', 'wipe'];

export function DeadManSwitch() {
  const {
    deadManEnabled,
    deadManDays,
    deadManAction,
    deadManContacts,
    lastActivity,
    setDeadManEnabled,
    setDeadManDays,
    setDeadManAction,
    setDeadManContacts,
    recordActivity,
  } = useSecurityStore();

  const [newContact, setNewContact] = useState('');

  const status = useMemo(
    () => getSwitchStatus(deadManEnabled, lastActivity, deadManDays, deadManAction),
    [deadManEnabled, lastActivity, deadManDays, deadManAction]
  );

  const handleAddContact = useCallback(() => {
    const email = newContact.trim();
    if (!email || !email.includes('@')) return;
    if (deadManContacts.includes(email)) return;
    setDeadManContacts([...deadManContacts, email]);
    setNewContact('');
  }, [newContact, deadManContacts, setDeadManContacts]);

  const handleRemoveContact = useCallback((email: string) => {
    setDeadManContacts(deadManContacts.filter(c => c !== email));
  }, [deadManContacts, setDeadManContacts]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-gray-900 dark:text-white">Dead Man's Switch</h3>
        </div>
        <button
          onClick={() => setDeadManEnabled(!deadManEnabled)}
          className={cn(
            "relative w-10 h-5 rounded-full transition-colors",
            deadManEnabled ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
          )}
        >
          <span className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform",
            deadManEnabled && "translate-x-5"
          )} />
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Automatically take action if you don't interact with LifeContext for a set period.
        Useful for ensuring your data is handled according to your wishes.
      </p>

      {/* Status indicator */}
      {deadManEnabled && (
        <div className={cn(
          "p-4 rounded-xl border",
          status.urgencyLevel === 'safe' && "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800",
          status.urgencyLevel === 'warning' && "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800",
          status.urgencyLevel === 'critical' && "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
        )}>
          <div className="flex items-center gap-3 mb-2">
            {status.urgencyLevel === 'safe' ? (
              <Shield className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className={cn("w-5 h-5", status.urgencyLevel === 'warning' ? "text-yellow-600" : "text-red-600")} />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {status.daysUntilTrigger > 0
                  ? `${status.daysUntilTrigger} days until trigger`
                  : 'Switch triggered!'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last activity: {status.daysInactive === 0 ? 'Today' : `${status.daysInactive} days ago`}
              </p>
            </div>
          </div>
          <button
            onClick={recordActivity}
            className="w-full mt-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" /> I'm still here (reset timer)
          </button>
        </div>
      )}

      {deadManEnabled && (
        <>
          {/* Threshold */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Inactivity threshold</span>
            <select
              value={deadManDays}
              onChange={(e) => setDeadManDays(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
            >
              {THRESHOLD_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Action */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Action on trigger</span>
            {ACTION_OPTIONS.map(action => (
              <button
                key={action}
                onClick={() => setDeadManAction(action)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-colors",
                  deadManAction === action
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/10"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                )}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">{getActionLabel(action)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getActionDescription(action)}</p>
              </button>
            ))}
          </div>

          {/* Emergency contacts */}
          {(deadManAction === 'notify' || deadManAction === 'export') && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Emergency contacts</span>
              {deadManContacts.map(email => (
                <div key={email} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
                  <button onClick={() => handleRemoveContact(email)} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddContact()}
                  placeholder="email@example.com"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleAddContact}
                  className="px-3 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
