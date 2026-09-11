import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import UserForm from './User/UserForm';
import UserItem from './User/UserItem';
import UserEditForm from './User/UserEditForm';

type User = {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
};

type AdminUserPageProps = {
  onClose: () => void;
};

const AdminUserPage = ({ onClose }: AdminUserPageProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [showForm, setShowForm] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.email.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');

      console.log('admin users:', response.status);
      console.log('users:', response.data);

      setUsers(response.data);
    } catch (error) {
      console.error('admin users error:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: number) => {
    try {
      const response = await api.delete(`/api/admin/users/${id}`);

      console.log('delete user:', response.status, response.data);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== id)
      );
    } catch (error) {
      console.error('delete user error:', error);
    }
  };

  const updateUser = async (
    id: number,
    name: string,
    email: string,
    isAdmin: boolean
  ) => {
    try {
      await api.put(`/api/admin/users/${id}`, {
        name,
        email,
        is_admin: isAdmin
      });

      await fetchUsers();
      setEditingUser(null);

      return {};
    } catch (error: any) {
      console.error('update user error:', error);

      if (error.response?.status === 422) {
        return error.response.data.errors ?? {};
      }

      return {};
    }
  };

  const createUser = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    isAdmin: boolean
  ) => {
    setErrors({});

    try {
      const response = await api.post('/api/admin/users', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        is_admin: isAdmin,
      });

      console.log('create user:', response.status, response.data);

      // 登録成功したら一覧を再取得
      await fetchUsers();

      // フォームを閉じる
      setShowForm(false);

    } catch (error: any) {
      console.error('create user error:', error);

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors ?? {});
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-32">
      <header className="px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            ユーザー管理
          </h1>

          <button
            type="button"
            onClick={onClose}
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

      {editingUser ? (
        <UserEditForm
          user={editingUser}
          updateUser={updateUser}
          onCancel={() => {
            setEditingUser(null);
            setErrors({});
          }}
        />
      ) : showForm ? (
        <UserForm
          createUser={createUser}
          errors={errors}
          clearErrors={() => setErrors({})}
          onCancel={() => {
            setShowForm(false);
            setErrors({});
          }}
        />
      ) : (
        <>
          {/* 検索 */}
          <div className="my-4 flex gap-2">
            <input
              type="text"
              placeholder="ユーザーを検索"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={() => setSearchKeyword(keyword)}
              className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              検索
            </button>

            <button
              type="button"
              onClick={() => {
                setKeyword("");
                setSearchKeyword("");
              }}
              className="shrink-0 rounded-xl border border-slate-600 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800"
            >
              クリア
            </button>
          </div>

          {/* ＋ 新規ユーザー登録 */}
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setShowForm(true);
            }}
            className="mb-4 flex w-full items-center justify-between rounded-2xl border border-blue-500/30 bg-white p-3 shadow-sm transition-all active:scale-[0.98] dark:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>

              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-wider">
                  New User
                </div>

                <div className="text-[10px] text-slate-500">
                  新規ユーザー登録
                </div>
              </div>
            </div>

            <div className="mr-1 text-blue-500">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>

          {/* ユーザー一覧 */}
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                deleteUser={deleteUser}
                updateUser={updateUser}
                onEdit={(user) => setEditingUser(user)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserPage;