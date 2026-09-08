import { useState } from 'react';
import api from '../../utils/axios';
import DisplayCard from './DisplayCard';

type ShopType = {
    value: number;
    label: string;
};

type ShoppingItem = {
    id: number;
    price: number;
    quantity: string | null;
    shop_type: number;
    item: {
        id: number;
        name: string;
    };
};

type ListSectionProps = {
  shopTypes: ShopType[];
  items: ShoppingItem[];
  onAdded: () => void;
};

const ListSection = ({ shopTypes, items, onAdded }: ListSectionProps) => {
  const [name, setName] = useState('');
  const [shopType, setShopType] = useState(shopTypes[0]?.value ?? '');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

    const handleSubmit = async (event: any) => {
      event.preventDefault();
      setError('');

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

        onAdded();

      } catch (error: any) {
    console.log('★ ERROR STATUS:', error.response?.status);
    console.log('★ ERROR DATA:', error.response?.data);
        // console.error(
        //     'shopping item add error:',
        //     error
        // );
        setError(
            error.response?.data?.message ??
            '商品の追加に失敗しました'
        );
      }
    };

  return (
  <section className="space-y-6">

    {/* クイック追加エリア */}
    <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 px-2 uppercase tracking-wider mb-2">
            よく買うもの
        </h3>

        <div className="grid grid-cols-3 gap-2">
            {/* ここは後でLaravelから受け取る frequentItems を map する */}
        </div>
    </div>

    {/* メインの追加フォーム */}
    <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border dark:border-gray-700">
        <form
          onSubmit={handleSubmit}
          className="space-y-2 p-2 dark:bg-gray-800/50 rounded-2xl">

            <div className="flex gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white"
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
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
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
                    className="w-28 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                    placeholder="単価"
                />

                <input
                    type="text"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="w-16 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                    placeholder="個"
                />

            </div>
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
          <DisplayCard
              key={item.id}
              item={item}
              shopTypes={shopTypes}
          />
        ))}

    </div>

  </section>
  );
};

export default ListSection;
