"use client";

import { NextIntlClientProvider } from 'next-intl';

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = require(`../../messages/${locale}.json`); // Dynamically load the locale messages

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Vienna">
      {children}
    </NextIntlClientProvider>
  );
}
