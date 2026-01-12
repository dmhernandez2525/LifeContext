import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles, 
  ChevronDown,
  Heart,
  Brain,
  Zap,
  Users,
  Lock,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import AskDocsButton from '../help/AskDocsButton';

// ============================================================
// NAVIGATION DATA
// ============================================================

const NAV_STRUCTURE = [
  {
    label: 'Product',
    path: '/product', // Placeholder, creates dropdown
    children: [
      { 
        label: 'Features Overview', 
        path: '/features',
        description: 'Explore all capabilities',
        icon: Zap 
      },
      { 
        label: 'Secure Journaling', 
        path: '/features/journaling',
        description: 'Voice & video with mood tracking',
        icon: Lock 
      },
      { 
        label: 'Legacy Building', 
        path: '/features/legacy',
        description: 'Preserve your story for generations',
        icon: Users 
      },
      { 
        label: 'Relationship Tech', 
        path: '/features/relationships',
        description: 'Understand connection patterns',
        icon: Heart 
      },
      { 
        label: 'Data Reclamation', 
        path: '/features/data-reclamation',
        description: 'Reclaim your scattered data',
        icon: Lock 
      },
    ]
  },
  {
    label: 'Solutions',
    path: '/solutions',
    children: [
      { 
        label: 'For Parents', 
        path: '/solutions/parents',
        description: 'Capture memories for kids',
        icon: Users 
      },
      { 
        label: 'For Partners', 
        path: '/solutions/partners',
        description: 'Deepen your connection',
        icon: Heart 
      },
      { 
        label: 'Personal Growth', 
        path: '/solutions/growth',
        description: 'Self-discovery & coaching',
        icon: Brain 
      },
    ]
  },
  { 
    label: 'Data Sovereignty', 
    path: '/data-ownership',
    highlight: true 
  },
  { 
    label: 'Pricing', 
    path: '/pricing' 
  },
  { 
    label: 'Philosophy', 
    path: '/philosophy' 
  },
  { 
    label: 'Roadmap', 
    path: '/roadmap',
    highlight: true
  },
];

// ============================================================
// COMPONENTS
// ============================================================

function ThemeToggle({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
      aria-label="Toggle theme"
    >
      {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}

function NavItem({ item }: { item: typeof NAV_STRUCTURE[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          cn(
            'text-sm font-medium transition-colors px-3 py-2 rounded-lg',
            isActive 
              ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          )
        }
      >
        {item.label}
      </NavLink>
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={cn(
          'flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors',
          isOpen 
            ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10' 
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        {item.label}
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Desktop Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-2 overflow-hidden z-50"
          >
            <div className="flex flex-col gap-1">
              {item.children?.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) => cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-colors group/item",
                    isActive 
                      ? "bg-purple-50 dark:bg-purple-900/20" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 p-1.5 rounded-lg transition-colors",
                    "bg-gray-100 dark:bg-gray-800 group-hover/item:bg-white dark:group-hover/item:bg-gray-700"
                  )}>
                    {child.icon && <child.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {child.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {child.description}
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MAIN LAYOUT
// ============================================================

export default function PublicLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInitialized } = useAppStore();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true); // Default to dark for public site initially

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle theme toggle
  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('lcc-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemDark);
      document.documentElement.classList.toggle('dark', systemDark);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('lcc-theme', newIsDark ? 'dark' : 'light');
  };

  const handleGetStarted = () => {
    if (isInitialized) {
      navigate('/app');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300 font-sans selection:bg-purple-500/30">
      {/* Navbar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
          isScrolled
            ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-gray-200 dark:border-white/10 py-3 shadow-sm'
            : 'bg-transparent border-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              LifeContext
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {NAV_STRUCTURE.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
            
            <NavLink 
              to="/app" 
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </NavLink>
            
            <button
              onClick={handleGetStarted}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-purple-500/10"
            >
              <span>{isInitialized ? 'Dashboard' : 'Get Started'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
            <button
              className="text-gray-900 dark:text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 z-40 bg-white dark:bg-gray-950 pt-24 px-6 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 pb-20">
              {NAV_STRUCTURE.map((item) => (
                <div key={item.label} className="space-y-3">
                  {item.children ? (
                    <>
                      <div className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                        {item.label}
                      </div>
                      <div className="pl-2 space-y-3">
                        {item.children.map(child => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-gray-600 dark:text-gray-400 py-1"
                          >
                            {child.icon && <child.icon className="w-4 h-4" />}
                            <span className="font-medium">{child.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-bold text-gray-900 dark:text-white block border-b border-gray-100 dark:border-gray-800 pb-2"
                    >
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}
              
              <div className="mt-8">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleGetStarted();
                  }}
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-xl mb-4 shadow-lg shadow-purple-500/30"
                >
                  {isInitialized ? 'Go to Dashboard' : 'Get Started Free'}
                </button>
                <NavLink
                  to="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center text-gray-500 dark:text-gray-400 font-medium py-2"
                >
                  Sign In
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Outlet />

      {/* Improved Footer */}
      <footer className="py-24 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">LifeContext</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed mb-6">
                The world's first private legacy compiler. We believe your life data belongs to you, 
                on your device, encrypted with your key.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Product</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                <li><NavLink to="/features" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">All Features</NavLink></li>
                <li><NavLink to="/features/journaling" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Secure Journal</NavLink></li>
                <li><NavLink to="/features/legacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Legacy Building</NavLink></li>
                <li><NavLink to="/roadmap" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Roadmap</NavLink></li>
                <li><NavLink to="/pricing" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Pricing</NavLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                <li><NavLink to="/about" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About Us</NavLink></li>
                <li><NavLink to="/philosophy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Our Philosophy</NavLink></li>
                <li><NavLink to="/data-ownership" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Data Sovereignty</NavLink></li>
                <li><NavLink to="/contact" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</NavLink></li>
                <li><NavLink to="/media" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Media Kit</NavLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
            <p>© 2026 Life Context Compiler. Local-First Software.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Help Button */}
      <AskDocsButton />
    </div>
  );
}
