"use client";

import React, { createContext, useContext } from 'react';

const LocaleContext = createContext<{ locale: string; messages: Record<string, string> } | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};

export default function LocaleTemplate({
  children,
  params = { locale: 'en' } // Fallback to 'en' if params is undefined
}: {
  children: React.ReactNode;
  params?: { locale?: string };
}) {
  const locale = params.locale || 'en'; // Default to 'en' if locale is undefined
  const messages = require(`../../messages/${locale}.json`);

  return (
    <LocaleContext.Provider value={{ locale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}
