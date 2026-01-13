import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Brain,
  Settings, 
  Lock,
  Menu,
  X,
  Sun,
  Moon,
  BookOpen,
  Calendar,
  Bot,
  Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import LockScreen from '../security/LockScreen';
import AskDocsButton from '../help/AskDocsButton';
import { Target } from 'lucide-react';

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/app/questions', icon: MessageSquare, label: 'Questions' },
  { path: '/app/journal', icon: BookOpen, label: 'Journal' },
  { path: '/app/timeline', icon: Calendar, label: 'Timeline' },
  { path: '/app/life-planning', icon: Target, label: 'Life Planning' },
  { path: '/app/insights', icon: Bot, label: 'AI Insights' },
  { path: '/app/brain-dump', icon: Brain, label: 'Brain Dump' },
  { path: '/app/settings', icon: Settings, label: 'Settings' },
  { path: '/app/family', icon: Users, label: 'Family Circle' },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const lock = useAppStore((state) => state.lock);
  const isUnlocked = useAppStore((state) => state.isUnlocked);
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const [isDark, setIsDark] = useState(false);

  // Sync dark mode with settings and system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = settings?.theme === 'dark' || 
      (settings?.theme === 'system' && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, [settings?.theme]);

  // Auto-Lock on inactivity
  useEffect(() => {
    // 5 minutes default if not set
    const timeoutMinutes = settings?.autoLockTimeout ?? 5;
    const timeoutMs = timeoutMinutes * 60 * 1000;
    
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      if (isUnlocked) {
        timer = setTimeout(() => {
          lock();
        }, timeoutMs);
      }
    };

    // Events to track activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initial timer start
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isUnlocked, settings?.autoLockTimeout, lock]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  };

  // Show lock screen when not unlocked
  if (!isUnlocked) {
    return <LockScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Life Context</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={lock}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">LC</span>
              </div>
              <span className="font-semibold text-lg">Life Context</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={lock}
              className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Lock className="w-5 h-5" />
              <span className="font-medium">Lock</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Floating Help Button */}
      <AskDocsButton />
    </div>
  );
}
