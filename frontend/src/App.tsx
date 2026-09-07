import { useEffect, useState } from 'react'
import './App.css'
import AppLayout from './components/Layout/AppLayout';
import Login from './login';
import Register from './Register';
import api from './utils/axios';
import ShoppingPage from './components/shopping/ShoppingPage';

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
  console.log('★★ App側に届いた ★★', userData);

    setUser(userData);
    setIsLoggedIn(true);
  };

  // ログアウト
  const logout = async () => {
    try {
      await api.post('/logout');

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
    <AppLayout>
      <ShoppingPage />
    </AppLayout>
  );
};

export default App;