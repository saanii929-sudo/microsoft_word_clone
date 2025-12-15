import { getRequestConfig } from 'next-intl/server';
import { locales } from '@/lib/constants/languages';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    // We use 'as any' because the strict type check might fail during build if not perfectly aligned
    if (!locale || !locales.includes(locale as any)) {
        locale = 'en';
    }

    let messages;
    try {
        messages = (await import(`../messages/${locale}.json`)).default;
    } catch (error) {
        // Fallback to English if translation file hasn't been created yet
        messages = (await import(`../messages/en.json`)).default;
    }

    return {
        locale,
        messages
    };
});
