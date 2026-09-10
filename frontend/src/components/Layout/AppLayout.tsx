import type { ReactNode } from 'react';
import Header from '../Header';

type LayoutProps = {
    children: ReactNode;
    setCurrentPage: (
        page: 'shopping' | 'adminUsers' | 'settings'
    ) => void;
    logout: () => Promise<void>;
};

const Layout = ({ children, setCurrentPage, logout }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#111622]">
            <Header
                setCurrentPage={setCurrentPage}
                logout={logout}
            />

            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;