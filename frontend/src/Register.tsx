import { useState } from 'react';
import api from './utils/axios';

type RegisterProps = {
  onRegisterSuccess: (user: any) => void;
  onBackToLogin: () => void;
};

const Register = ({ onRegisterSuccess, onBackToLogin }: RegisterProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<any>({});

  const handleRegister = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log('REGISTER SUBMIT');
    setErrors({});

    try {
      await api.get('/sanctum/csrf-cookie');

      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      console.log('register:', response.status, response.data);

      const userResponse = await api.get('/api/user');

      console.log('register user status:', userResponse.status);
      console.log('registered user:', userResponse.data);

      onRegisterSuccess(userResponse.data);

    } catch (error: any) {
      console.error('register error:', error);

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors ?? {});
        return;
      }

      setErrors({
        general: '登録に失敗しました',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold text-center text-slate-200">REGISTER</h1>

        <form onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <label className="min-w-[100px] shrink-0 text-left text-sm text-slate-200">
                  名前
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border border-slate-600 bg-slate-700 p-2 text-white"
                />
              </div>
              {errors.name?.[0] && <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>}
            </div>

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
              {errors.email?.[0] && <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>}
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
              {errors.password?.[0] && <p className="mt-1 text-sm text-red-500">{errors.password[0]}</p>}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <label className="min-w-[100px] shrink-0 text-left text-sm text-slate-200">
                  パスワード確認
                </label>
                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full rounded border border-slate-600 bg-slate-700 p-2 text-white"
                />
              </div>
              {errors.password?.[0] && <p className="mt-1 text-sm text-red-500">{errors.password[0]}</p>}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
            >
              新規登録
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-slate-200">
          <button
            type="button"
            onClick={onBackToLogin}
          >
            ログイン画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;