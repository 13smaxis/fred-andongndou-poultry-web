import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { smoothScrollToTop } from '@/lib/scrollToTop';

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    smoothScrollToTop(1600);
  }, [location.key]);

  return null;
}
