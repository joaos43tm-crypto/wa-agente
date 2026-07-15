import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['en', 'pt'];
export const defaultLocale = 'en';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();
  let locale = cookieStore.get('NEXT_LOCALE')?.value;

  if (!locale) {
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      locale = acceptLanguage.includes('pt') ? 'pt' : 'en';
    }
  }

  if (!locale) {
    locale = process.env.NEXT_PUBLIC_APP_LOCALE || defaultLocale;
  }

  if (!locales.includes(locale)) {
    locale = defaultLocale;
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback if the dictionary for the requested locale doesn't exist
    messages = (await import(`../../messages/${defaultLocale}.json`)).default;
  }

  return {
    locale,
    messages
  };
});

