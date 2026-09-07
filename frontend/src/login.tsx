import { useState } from 'react';
import api from './utils/axios';

type User = {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
};

type LoginProps = {
  /** ログイン成功時に呼び出されるコールバック関数 */
  onLoginSuccess: (userData: User) => void;
  // 新規登録画面へ移動
  onRegister: () => void;
};

const Login = ({ onLoginSuccess, onRegister }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //ログイン実行のイベントハンドラー
  const handleLogin = async () => {
    setError('');
    try {
        await api.get('/sanctum/csrf-cookie');

        // ログイン
        const loginResponse = await api.post('/login', {
          email,
          password,
        });

        console.log('login status:', loginResponse.status);

        //認証済みユーザー情報の取得
        const userResponse = await api.get('/api/user');

        console.log('user status:', userResponse.status);

        const user = await userResponse.data;

        console.log('authenticated user:', user);

        onLoginSuccess(user);
    } catch (error) {
        console.error('login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Login
        </h1>
        <div className="space-y-2">

          <div>
            <div className="flex items-center gap-3">
              <label className="min-w-[100px] shrink-0 text-left text-sm text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <label className="min-w-[100px] shrink-0 text-left text-sm text-gray-700">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>
          </div>

        </div>

        {error && (
          <p className="mb-4 text-red-500">
            {error}
          </p>
        )}

        <div className="mt-4">
          <button
            onClick={handleLogin}
            className="w-full rounded bg-blue-500 p-2 text-white"
          >
            Login
          </button>
        </div>

        <button
          onClick={onRegister}
          className="mt-3 text-sm text-blue-500 hover:underline focus:outline-none"
        >
          新規登録
        </button>
      </div>
    </div>
  );
}

export default Login;