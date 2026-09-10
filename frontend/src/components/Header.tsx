import { useEffect, useState } from 'react';
import api from '../utils/axios';
import ApplicationLogo from './ApplicationLogo';

type User = {
  id: number;
  name: string;
  email: string;
  is_admin: number;
};

type HeaderProps = {
  setCurrentPage: (
    page: 'shopping' | 'adminUsers' | 'settings'
  ) => void;
  logout: () => Promise<void>;
};

const Header = ({ setCurrentPage, logout }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    const fetchUser = async () => {
      try {
        const response = await api.get('/api/user');
        setUser(response.data);
      } catch (error) {
        console.error('user data error:', error);
      }
    };

    fetchUser();
  }, []);

  const toggleDarkMode = () => {
    const nextIsDark = !isDark;

    if (nextIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    setIsDark(nextIsDark);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#111622] border-b border-gray-100 dark:border-white/5 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16">

          {/* 左 */}
          <div className="flex items-center justify-start space-x-3">

            {/* ダークモード */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-transparent dark:border-white/10 text-sm transition-all duration-150 select-none cursor-pointer flex items-center justify-center w-9 h-9"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* ロゴ */}
            <button
              type="button"
              onClick={() => {
                setCurrentPage('shopping');
                setOpen(false);
              }}
              className="block h-8 w-auto"
            >
              <ApplicationLogo className="h-8 w-auto text-blue-600 dark:text-blue-500" />
            </button>
          </div>

          {/* 中央 */}
          <div className="flex items-center justify-center">
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200 leading-tight tracking-wider whitespace-nowrap">
              買い物メモ
            </h2>
          </div>

          {/* 右 */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 focus:outline-none transition duration-150 ease-in-out"
            >
              {open ? '✕' : '☰'}
            </button>
          </div>

        </div>
      </div>

      {/* メニュー */}
      {open && (
        <div className="bg-gray-50 dark:bg-[#151c2c] border-t border-gray-200 dark:border-white/5">

          <div className="pt-2 pb-3 space-y-1">

            {/* 設定 */}
            <button
              type="button"
              onClick={() => {
                setCurrentPage('settings');
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
            >
              設定
            </button>

            {/* ユーザー管理 */}
            {user?.is_admin === 1 && (
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('adminUsers');
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
              >
                ユーザー管理
              </button>
            )}
          </div>


          {/* ログアウト */}
          <button
            type="button"
            onClick={async () => {
              await logout();
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
          >
            ログアウト
          </button>

        </div>

      )}
    </header>
  );
};

export default Header;