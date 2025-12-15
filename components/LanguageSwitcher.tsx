"use client";

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/constants/languages';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';
import { useTransition } from 'react';

export function LanguageSwitcher() {
    const t = useTranslations('LanguageSwitcher');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleLanguageChange = (newLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Languages className="bg-transparent h-4 w-4" />
            <Select
                value={locale}
                onValueChange={handleLanguageChange}
                disabled={isPending}
            >
                <SelectTrigger className="w-[180px] bg-transparent border-none">
                    <SelectValue placeholder={t('selectLanguage')} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
