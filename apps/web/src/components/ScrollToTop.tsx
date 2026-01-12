import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls the window to the top (0,0) whenever the route pathname changes.
 * This ensures that when navigating between pages, the user starts at the top of the content
 * rather than maintaining the previous page's scroll position.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
