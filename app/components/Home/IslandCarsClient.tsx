'use client';

import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import { Lang } from '@/app/i18n/types';

interface IslandCarsClientProps {
  currentLang: Lang;
}

export default function IslandCarsClient({ currentLang }: IslandCarsClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <Header lang={currentLang} isScrolled={isScrolled} />;
}
