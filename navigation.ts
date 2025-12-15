import { createNavigation } from 'next-intl/navigation';
import { locales } from '@/lib/constants/languages';

export const { Link, redirect, usePathname, useRouter } =
    createNavigation({ locales });
