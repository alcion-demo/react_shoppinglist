import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import ListSection from './ListSection';

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

type ShoppingData = {
    items: ShoppingItem[];
    shopTypes: ShopType[];
};


const ShoppingPage = () => {
  const [data, setData] = useState<ShoppingData | null>(null);

  useEffect(() => {
      const fetchShoppingData = async () => {
          try {
              const response = await api.get('/api/shopping-items');

              setData(response.data);
          } catch (error) {
              console.error('shopping data error:', error);
          }
      };

      fetchShoppingData();
  }, []);

  if (data === null) {
      return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
        <div className="pb-32 p-4">

            {/* 買い物リスト */}
            <div>
              <ListSection
                  shopTypes={data.shopTypes}
                  items={data.items}
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