type User = {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
};

type UserItemProps = {
  user: User;
  deleteUser: (id: number) => Promise<void>;
  updateUser: (
    id: number,
    name: string,
    email: string,
    isAdmin: boolean
  ) => Promise<Record<string, string[]>>;
  onEdit: (user: User) => void;
};

const UserItem = ({
  user,
  deleteUser,
  onEdit,
}: UserItemProps) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-white/5 transition-all">

      {/* ユーザー情報 */}
      <div className="flex items-start justify-between mb-4">

        <div className="flex items-center gap-3">

          {/* アイコン */}
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-slate-400 text-xs">
            {user.name.substring(0, 1)}
          </div>

          <div>

            {/* 名前 + 権限 */}
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 dark:text-slate-100">
                {user.name}
              </h2>

              <span
                className={
                  user.is_admin
                    ? "px-2 py-0.5 text-[9px] font-black rounded-full bg-purple-500 text-white"
                    : "px-2 py-0.5 text-[9px] font-black rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                }
              >
                {user.is_admin ? "ADMIN" : "USER"}
              </span>
            </div>

            {/* メール */}
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {user.email}
            </p>

          </div>
        </div>

        {/* ID */}
        <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600">
          #{user.id}
        </span>

      </div>

      {/* ボタン */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50 dark:border-white/5">

        {/* 編集 */}
        <button
          type="button"
          onClick={() => onEdit(user)}
          className="flex items-center justify-center gap-2 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-2xl active:scale-95 transition-all"
        >
          編集
        </button>

        {/* 削除 */}
        <button
          type="button"
          onClick={() => deleteUser(user.id)}
          className="flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl active:scale-95 transition-all"
        >
          削除
        </button>

      </div>
    </div>
  );
};

export default UserItem;