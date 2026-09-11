import { useState } from 'react';
import api from '../../utils/axios';

type User = {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
};

type SettingsPageProps = {
  user: User | null;
  onCancel: () => void;
  onDeleted: () => void;
};

const SettingsPage = ({ user, onCancel, onDeleted }: SettingsPageProps) => {
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isDeleted, setIsDeleted] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setMessage('');
  setErrors({});

  let newErrors: Record<string, string[]> = {};

  // プロフィール更新
  try {
    const response = await api.put('/api/profile', {
      name,
      email,
    });

    setMessage(response.data.message);
  } catch (error: any) {
    if (error.response?.status === 422) {
      newErrors = {
        ...newErrors,
        ...(error.response.data.errors ?? {}),
      };
    } else {
      setMessage('プロフィールの更新に失敗しました。');
    }
  }

  // パスワード変更
  if (currentPassword || password || passwordConfirmation) {
    try {
      const passwordResponse = await api.put('/api/profile/password', {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage(passwordResponse.data.message);
    } catch (error: any) {
      if (error.response?.status === 422) {
        newErrors = {
          //今まで入ってるエラーを残したまま、新しいエラーを追加する
          ...newErrors,
          ...(error.response.data.errors ?? {}),
        };
      } else {
        setMessage('パスワードの変更に失敗しました。');
      }
    }
  }

  setErrors(newErrors);
};

  const handleDelete = async () => {
  try {
    await api.delete('/api/profile');
    setIsDeleted(true);

    setTimeout(() => {
      onDeleted();
    }, 2000);

  } catch (error: any) {
    console.error('delete error:', error.response?.data);
    console.error('status:', error.response?.status);
  }
  };

  return (
    <>
      {isDeleted ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
          <div className="text-center">
            <p className="text-xl font-black text-slate-900 dark:text-white">
              アカウントを削除しました。
            </p>

            <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
              ご利用ありがとうございました。
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto pb-32 min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">

          {/* ヘッダー */}
          <header className="px-4 py-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  設定
                </h1>
              </div>

              <button
                type="button"
                onClick={onCancel}
                className="text-slate-400 hover:text-slate-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 6l12 12M6 18L18 6"
                  />
                </svg>
              </button>
            </div>
          </header>
          
          {message && (
            <div className="mx-4 mb-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400">
              {message}
            </div>
          )}

          <div className="px-4">

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* 設定フォーム */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-white/5">

                <div className="space-y-5">

                  {/* 名前 */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 text-left uppercase tracking-widest ml-1 mb-1">
                      Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    {errors.name && (
                      <p className="text-red-500 text-[10px] mt-1 ml-1">
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  {/* メール */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 text-left uppercase tracking-widest ml-1 mb-1">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    {errors.email && (
                      <p className="text-red-500 text-[10px] mt-1 ml-1">
                        {errors.email[0]}
                      </p>
                    )}
                  </div>

                  {/* パスワード変更 */}
                  <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-white/5">

                    <h2 className="text-base font-black text-slate-900 dark:text-white">
                      パスワード変更
                      <span className="ml-2 text-xs text-purple-500 font-bold">
                        任意
                      </span>
                    </h2>

                    {/* 現在のパスワード */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 text-left uppercase tracking-widest ml-1 mb-1">
                        Current Password
                      </label>

                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all"
                      />

                      {errors.current_password && (
                        <p className="text-red-500 text-[10px] mt-1 ml-1">
                          {errors.current_password[0]}
                        </p>
                      )}
                    </div>

                    {/* 新しいパスワード */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 text-left uppercase tracking-widest ml-1 mb-1">
                        New Password
                      </label>

                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all"
                      />

                      {errors.password && (
                        <p className="text-red-500 text-[10px] mt-1 ml-1">
                          {errors.password[0]}
                        </p>
                      )}
                    </div>

                    {/* パスワード確認 */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 text-left uppercase tracking-widest ml-1 mb-1">
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all"
                      />

                      {errors.password_confirmation && (
                        <p className="text-red-500 text-[10px] mt-1 ml-1">
                          {errors.password_confirmation[0]}
                        </p>
                      )}
                    </div>

                  </div>

                </div>
              </div>

              {/* 保存ボタン */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all"
                >
                  保存する
                </button>
              </div>

            </form>

            {/* アカウント削除 */}
            <div className="mt-12 pt-6 border-t border-slate-200 dark:border-white/10">

              <h2 className="text-sm font-black text-slate-700 dark:text-slate-300 mb-2">
                アカウント削除
              </h2>

              <p className="text-xs text-slate-400 mb-4">
                アカウントを削除すると、元に戻すことはできません。
              </p>

              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all"
              >
                アカウントを削除する
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPage;