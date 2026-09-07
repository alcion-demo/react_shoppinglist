import { useEffect, useState } from 'react';
import { apiFetch } from './utils/apiFetch';
import UserForm from './components/User/UserForm'
import UserItem from './components/User/UserItem'

type User = {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
};

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<any>({});

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.email.toLowerCase().includes(searchKeyword.toLowerCase())
  );


  const fetchUsers = async () => {
    const response = await apiFetch('/api/admin/users');

    console.log('admin users:', response.status);

    const data = await response.json();

    console.log('users:', data);

    if (!response.ok) {
      return;
    }

    setUsers(data);
  };
    useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: number) => {
    const response = await apiFetch(`/api/admin/users/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    console.log('delete user:', response.status, data);

    if (!response.ok) {
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== id)
    );
  };

  const updateUser = async (
    id: number,
    name: string,
    email: string
  ) => {
    const response = await apiFetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });

    const data = await response.json();

    console.log('update user:', response.status, data);

    if (!response.ok) {
      if (response.status === 422) {
        return data.errors ?? {};
      }

      return {};
    }

    // 最新のユーザー一覧を取得
    fetchUsers();

    return {};
  };

  const createUser = async (
    name: string,
    email: string,
    password: string
    ) => {
    
    setErrors({});

    const response = await apiFetch('/api/admin/users', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    console.log('create user:', response.status, data);

    if (!response.ok) {
      if (response.status === 422) {
        setErrors(data.errors ?? {});
      }
      return;
    }

    setUsers((prevUsers) => [...prevUsers, data]);

  };

  return (
    <>
      <div>
        <h1>Admin画面</h1>

        <div className="my-4 flex gap-2">
          <input
            type="text"
            placeholder="ユーザーを検索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-3 py-2"
          />

          <button
            onClick={() => setSearchKeyword(keyword)}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            検索
          </button>

          <button
            onClick={() => {
              setKeyword("");
              setSearchKeyword("");
            }}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            クリア
          </button>
        </div>

        {filteredUsers.map((user) => (
          <UserItem
            key={user.id}
            user={user}
            deleteUser={deleteUser}
            updateUser={updateUser}
          />
        ))}

        <UserForm
          createUser={createUser}
          errors={errors}
          clearErrors={() => setErrors({})}
        />

        </div>
    </>
  );
};

export default Admin;