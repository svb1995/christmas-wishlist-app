"use client";

import React from 'react';
import { Button } from './ui/button';
import { useRouter, usePathname } from 'next/navigation';

const languages = [
  { code: 'en', name: '🇬🇧 EN' },
  { code: 'de', name: '🇩🇪 DE' }
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (locale: string) => {
    const currentPath = pathname.split('/').slice(2).join('/');
    router.push(`/${locale}${currentPath ? `/${currentPath}` : ''}`);
  };

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          className="text-gray-400 hover:text-white transition-colors px-2 py-1 text-sm"
          onClick={() => switchLanguage(lang.code)}
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
}