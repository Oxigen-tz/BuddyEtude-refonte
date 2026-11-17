import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// L'ancienne version interrogeait base44.auth.me() (backend Base44 abandonné au profit de
// Firebase) : une requête réseau inutile, vouée à l'échec, à chaque 404.
export default function PageNotFound() {
    const location = useLocation();
    const { t } = useTranslation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#131314]">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-7xl font-light text-slate-300 dark:text-gray-600">404</h1>
                    <div className="h-0.5 w-16 bg-slate-200 dark:bg-[#333537] mx-auto"></div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-2xl font-medium text-slate-800 dark:text-gray-100">
                        {t('notFound.title')}
                    </h2>
                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                        {t('notFound.desc', { page: pageName })}
                    </p>
                </div>

                <div className="pt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-200 bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-[#333537] rounded-lg hover:bg-slate-50 dark:hover:bg-[#282a2c] transition-colors duration-200"
                    >
                        {t('notFound.home')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
