import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import ListSection from './ListSection';
import QuickMenu from './QuickMenu';

type ShopType = {
    value: number;
    label: string;
};

type ShoppingItem = {
    id: number;
    shopping_item_id: number;
    price: number;
    quantity: string | null;
    shop_type: number;
    item: {
        id: number;
        name: string;
    };
};

type ShoppingData = {
    items: ShoppingItem[];
    shopTypes: ShopType[];
    frequentItems: FrequentItem[] | Record<string, FrequentItem>;
};

type FrequentItem = {
    shopping_item_id: number;
    item: {
        id: number;
        name: string;
    };
};

const ShoppingPage = () => {
  const [data, setData] = useState<ShoppingData | null>(null);

  const fetchShoppingData = async () => {
      try {
          const response = await api.get('/api/shopping-items');
        // console.log('shopping data:', response.data);

console.log(
    'frequentItems:',
    response.data.frequentItems
);

        setData(response.data);
      } catch (error) {
          console.error('shopping data error:', error);
      }
  };

  useEffect(() => {
      fetchShoppingData();
  }, []);

  if (data === null) {
      return <div>Loading...</div>;
  }

  const frequentItems = Array.isArray(data.frequentItems)
  ? data.frequentItems
  : Object.values(data.frequentItems);

  return (
    <div className="max-w-md mx-auto">
        <div className="pb-32 p-4">
          
            {/* クイックメニュー */}
            <QuickMenu
                frequentItems={frequentItems}
                items={data.items}
                onAdded={fetchShoppingData}
            />

            {/* 買い物リスト */}
            <div>
              <ListSection
                  shopTypes={data.shopTypes}
                  items={data.items}
                  onAdded={fetchShoppingData}
              />
            </div>

            {/* 履歴 */}
            <div>
                <h2>履歴</h2>
            </div>

            {/* レシピ */}
            <div>
                <h2>レシピ</h2>
            </div>

        </div>
    </div>
  );
};

export default ShoppingPage;