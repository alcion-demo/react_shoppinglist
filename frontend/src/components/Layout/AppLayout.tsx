import type { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#111622]">
            <header className="sticky top-0 z-50 bg-white dark:bg-[#111622] border-b border-gray-100 dark:border-white/5 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-16">
                        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                            買い物メモ
                        </h2>
                    </div>
                </div>
            </header>

            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;