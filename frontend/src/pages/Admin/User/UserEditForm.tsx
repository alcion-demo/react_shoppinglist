import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
};

type UserEditFormProps = {
  user: User;
  updateUser: (
    id: number,
    name: string,
    email: string
  ) => Promise<Record<string, string[]>>;
  onCancel: () => void;
};

const UserEditForm = ({
  user,
  updateUser,
  onCancel,
}: UserEditFormProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isAdmin, setIsAdmin] = useState(Boolean(user.is_admin));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    const result = await updateUser(
      user.id,
      name,
      email
    );

    if (Object.keys(result).length > 0) {
      setErrors(result);
      return;
    }

    onCancel();
  };

  return (
    <div className="max-w-md mx-auto pb-32 min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">

      <header className="px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">
            ユーザー編集
          </h1>

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
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-white/5">

            <div className="space-y-5">

              {/* 名前 */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">
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
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">
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

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all"
            >
              保存する
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserEditForm;