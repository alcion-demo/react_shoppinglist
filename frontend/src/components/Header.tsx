import { useEffect, useState } from 'react';
import api from '../utils/axios';

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

  useEffect(() => {
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

    return (
        <header className="sticky top-0 z-50 bg-white border-b">
            <div className="flex items-center justify-between h-16 px-4">
                <h1 className="font-bold text-xl">
                    買い物メモ
                </h1>

                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="p-2"
                >
                    {open ? '✕' : '☰'}
                </button>
            </div>

            {open && (
              <div className="border-t bg-gray-50 p-4">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                        setCurrentPage('settings');
                        setOpen(false);
                    }}
                    className="block w-full text-left px-3 py-3"
                  >
                      設定
                  </button>
                </div>

                <div>
                  {user?.is_admin === 1 && (
                      <button
                          type="button"
                          onClick={() => {
                            setCurrentPage('adminUsers');
                            setOpen(false);
                          }}
                          className="block w-full text-left px-3 py-3"
                        >
                        ユーザー管理
                      </button>
                  )}
                </div>

                <div>
                  {/* ログアウト */}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-3 py-3"
                  >
                    ログアウト
                  </button>
                </div>
              </div>
            )}
        </header>
    );
};

export default Header;