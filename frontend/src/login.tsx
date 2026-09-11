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
  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    try {
      await api.get('/sanctum/csrf-cookie');

      const loginResponse = await api.post('/login', {
        email,
        password,
      });

      console.log('login status:', loginResponse.status);

      const userResponse = await api.get('/api/user');

      console.log('user status:', userResponse.status);

      onLoginSuccess(userResponse.data);
    } catch (error) {
      console.error('login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 flex items-center px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold text-center text-slate-200">
          Login
        </h1>

        <form onSubmit={handleLogin}>
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-3">
                <label className="min-w-[100px] shrink-0 text-left text-sm text-slate-200">
                  メールアドレス
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-slate-600 bg-slate-700 p-2 text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <label className="min-w-[100px] shrink-0 text-left text-sm text-slate-200">
                  パスワード
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-slate-600 bg-slate-700 p-2 text-white"
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
              type="submit"
              className="w-full rounded bg-blue-500 p-2 text-white"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-slate-200">
          <button
            type="button"
            onClick={onRegister}
          >
            新規登録
        </button>
        </div>
      </div>
    </div>
  );
}

export default Login;