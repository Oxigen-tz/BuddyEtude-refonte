import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

export default function PageNotFound() {
    const location = useLocation();
    const { t } = useTranslation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-background overflow-hidden">
            <div className="absolute inset-0 bg-grid mask-radial" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-brand-400/20 blur-3xl" />
            <div className="relative max-w-md w-full text-center">
                <Link to="/" className="inline-block mb-10"><Logo /></Link>
                <h1 className="font-display text-[8rem] leading-none font-extrabold text-gradient">404</h1>
                <h2 className="mt-4 font-display text-2xl font-bold text-gray-900 dark:text-white">{t('notFound.title')}</h2>
                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">{t('notFound.desc', { page: pageName })}</p>
                <Link
                    to="/"
                    className="mt-8 inline-flex items-center gap-2 h-12 px-6 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 shadow-glow hover:opacity-95 transition"
                >
                    <ArrowLeft className="w-4 h-4" /> {t('notFound.home')}
                </Link>
            </div>
        </div>
    );
}
