import { useEffect, useState } from 'react'
import './App.css'
import AppLayout from './components/Layout/AppLayout';
import Login from './login';
import Register from './Register';
import api from './utils/axios';
import ShoppingPage from './pages/shopping/ShoppingPage';
import AdminUserPage from './pages/Admin/AdminUserPage';
import SettingsPage from './pages/Settings/SettingsPage';
import RecipeSharePage from './pages/shopping/recipe/RecipeSharePage';

type User = {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState<
  'shopping' | 'adminUsers' | 'settings'
  >('shopping');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await api.get('/api/user');

        console.log('login check:', response.status);

        setUser(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.log('not logged in');
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  // ログイン成功
  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // 登録成功
  const handleRegisterSuccess = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // ログアウト
  const logout = async () => {
    try {
      const response = await api.post('/api/logout');

      console.log('logout response:', response.status);

      // ログアウト時に献立関連の保存データを削除
      sessionStorage.removeItem('latest_recipes');
      sessionStorage.removeItem('recipe_job_id');

      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('logout error:', error);
    }
  };

  // 読み込み中
  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  const path = window.location.pathname;

  if (path.startsWith('/recipes/share/')) {
      return <RecipeSharePage />;
  }

  // 未ログイン
  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  // ログイン済み
  return (
    <AppLayout setCurrentPage={setCurrentPage}
      logout={logout}
    >
      {currentPage === 'shopping' && <ShoppingPage />}
      {currentPage === 'adminUsers' && (
        <AdminUserPage
          onClose={() => setCurrentPage('shopping')}
        />
      )}
      {currentPage === 'settings' && (
        <SettingsPage
          user={user}
          onCancel={() => setCurrentPage('shopping')}
          onDeleted={() => {
            setUser(null);
            setIsLoggedIn(false);
          }}
        />
      )}
    </AppLayout>
  );
};

export default App;