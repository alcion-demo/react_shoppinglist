import { useState } from 'react';
import api from '../../utils/axios';
import DisplayCard from './DisplayCard';
import EditForm from './EditForm';

type ShopType = {
    value: number;
    label: string;
};

type ShoppingItem = {
    id: number;
    price: number;
    quantity: string | null;
    shop_type: number;
    recentPurchasedAt: string | null;
    item: {
        id: number;
        name: string;
    };
};

//親が受け取る内容
type ListSectionProps = {
  shopTypes: ShopType[];
  items: ShoppingItem[];
  onActionSuccess: () => void;
};

const ListSection = ({ shopTypes, items, onActionSuccess  }: ListSectionProps) => {
  const [name, setName] = useState('');
  const [shopType, setShopType] = useState(shopTypes[0]?.value ?? '');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [editingCartId, setEditingCartId] = useState<number | null>(null);

  const [isFormActive, setIsFormActive] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdd = async (event: any) => {
    event.preventDefault();
    setIsFormActive(true);
    setError('');
    setMessage(''); 

      console.log({
        name: name,
        shop_type: shopType,
        price: price === '' ? null : Number(price),
        quantity: quantity === '' ? null : quantity,
      });
    
    try {
      await api.post('/api/shopping-items', {
          name: name,
          shop_type: shopType,
          price: price === ''
              ? null
              : Number(price),
          quantity: quantity === ''
              ? null
              : quantity,
      });

      setName('');
      setPrice('');
      setQuantity('');

      setMessage('✨ リストに追加しました。');
      onActionSuccess();

    } catch (error: any) {
      console.error('shopping item add error:', error);
      setError(
          error.response?.data?.message ??
          '商品の追加に失敗しました'
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('リストから削除しますか？')) {
        return;
    }

    try {
        await api.delete(`/api/shopping-items/${id}`);

        setMessage('🗑️ リストから削除しました。');
        onActionSuccess();
    } catch (error) {
        console.error('shopping item delete error:', error);
    }
  };

  const handlePurchase = async (id: number) => {
      try {
          await api.post(`/api/shopping-items/${id}/purchase`);

          setMessage('✓ 購入済みにしました。');
          onActionSuccess();
      } catch (error) {
          console.error('shopping item purchase error:', error);
      }
  };

  return (
    <section className="space-y-6">

      {/* メインの追加フォーム */}
      <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border dark:border-gray-700">
        <form
          onSubmit={handleAdd}
          className="space-y-2 p-2 dark:bg-gray-800/50 rounded-2xl">

            <div className="flex gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-black placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                    placeholder="何を買う？"
                />

                <button
                    type="submit"
                    className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-xl"
                >
                    ＋
                </button>
            </div>

            <div className="flex gap-2 items-center">
              <select
                  value={shopType}
                  onChange={(event) => setShopType(Number(event.target.value))}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
              >
                  {shopTypes.map((shopType) => (
                      <option
                          key={shopType.value}
                          value={shopType.value}
                      >
                          {shopType.label}
                      </option>
                  ))}
              </select>

              <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="w-28 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                  placeholder="単価"
              />

              <input
                  type="text"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="w-16 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                  placeholder="個"
              />

          </div>

          {isFormActive && (
              <button
                  type="button"
                  onClick={() => {
                      setName('');
                      setShopType(shopTypes[0]?.value ?? '');
                      setPrice('');
                      setQuantity('');
                      setError('');
                      setIsFormActive(false);
                  }}
                  className="w-full py-2 text-sm text-gray-500"
              >
                  キャンセル
              </button>
          )}
          {message && (
              <div className="rounded-lg bg-green-500/10 px-3 py-2 text-sm font-bold text-green-400">
                  {message}
              </div>
          )}
          {error && (
              <p className="text-sm text-red-500">
                  {error}
              </p>
          )}
        </form>
      </div>

      {/* 現在のリスト */}
      <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 px-2 uppercase tracking-wider mb-2">
              現在のリスト
          </h3>

          {items.map((item) => (
              <div
                  key={item.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700/50"
              >
                  {editingCartId === item.id ? (
                      <EditForm
                          item={item}
                          shopTypes={shopTypes}
                          onCancel={() => setEditingCartId(null)}
                          onUpdated={() => {
                              setMessage('✏️ 買い物リストを更新しました。');
                              onActionSuccess();
                          }}
                      />
                  ) : (
                      <DisplayCard
                          item={item}
                          shopTypes={shopTypes}
                          onEdit={() => setEditingCartId(item.id)}
                          onDelete={() => handleDelete(item.id)}
                          onPurchase={() => handlePurchase(item.id)}
                      />
                  )}
              </div>
          ))}
      </div>
    </section>
  );
};

export default ListSection;
