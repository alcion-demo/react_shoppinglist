import { useState } from 'react';

type UserFormProps = {
  createUser: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    isAdmin: boolean
  ) => Promise<void>;

errors: Record<string, string[]>;
  clearErrors: () => void;
    onCancel: () => void;
};

const UserForm = ({
  createUser,
  errors,
  clearErrors,
  onCancel,
}: UserFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    clearErrors();

    await createUser(name, email, password, passwordConfirmation, isAdmin);

  };

  return (
    <div className="max-w-md mx-auto pb-32 min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">

      {/* ヘッダー */}
      <header className="px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">
              ユーザー登録
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

      <div className="px-4">

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 入力カード */}
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

              {/* パスワード */}
              <div className="space-y-5 pt-2 border-t border-slate-100 dark:border-white/5">

                <div>
                  <label className="block text-[10px] font-black text-slate-400 text-left uppercase tracking-widest ml-1 mb-1">
                    Password
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

                  {errors.password && (
                    <p className="text-red-500 text-[10px] mt-1 ml-1">
                      {errors.password[0]}
                    </p>
                  )}
                </div>

              </div>

              {/* 管理者権限 */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5">

                <label className="flex items-center px-1 cursor-pointer group select-none">

                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                  />

                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">
                    管理者権限を付与する
                  </span>

                </label>

              </div>

            </div>
          </div>

          {/* 登録ボタン */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all"
            >
              登録する
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserForm;
