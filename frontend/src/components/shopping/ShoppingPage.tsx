import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import ListSection from './ListSection';
import QuickMenu from './QuickMenu';
import HistorySection from './HistorySection';
import BottomNav from '../BottomNav';

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

type PurchaseHistory = {
    id: number;
    purchased_at: string;
    price: number | null;
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
    history: Record<string, PurchaseHistory[]>;
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
  const [activeTab, setActiveTab] = useState('list');

  const fetchShoppingData = async () => {
      try {
          const response = await api.get('/api/shopping-items');
        // console.log('shopping data:', response.data);

        console.log(
            'frequentItems:',
            response.data.frequentItems
        );

        console.log(
            'history:',
            response.data.history
        );

        console.log(
            'items:',
            response.data.items
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
            {activeTab === 'list' && (
                <>
                    <QuickMenu
                        frequentItems={frequentItems}
                        items={data.items}
                        onAdded={fetchShoppingData}
                    />

                    <div>
                        <ListSection
                            shopTypes={data.shopTypes}
                            items={data.items}
                            onAdded={fetchShoppingData}
                        />
                    </div>
                </>
            )}

            {/* 履歴 */}
            {activeTab === 'history' && (
                <div>
                    <HistorySection history={data.history} />
                </div>
            )}

            {/* レシピ */}
            {activeTab === 'recipe' && (
                <div>
                    <h2>レシピ</h2>
                </div>
            )}

            <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

        </div>
    </div>
  );
};

export default ShoppingPage;