import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import ListSection from './ListSection';
import QuickMenu from './QuickMenu';
import HistorySection from './HistorySection';
import BottomNav from '../../components/BottomNav';
import RecipeSection from './recipe/RecipeSection';

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
  recentPurchasedAt: string | null;
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
  const [actionMessage, setActionMessage] = useState('');

  const fetchShoppingData = async () => {
    try {
      const response = await api.get('/api/shopping-items');

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

  const handleReadd = async (item: { id: number; name: string }) => {
    try {
      await api.post('/api/shopping-items', {
        name: item.name,
        shop_type: data?.shopTypes[0]?.value ?? 1, // デフォルトのショップ種別
        price: null,
        quantity: null,
      });

      // データの最新化
      await fetchShoppingData();
      alert(`「${item.name}」をリストに追加しました！`);
    } catch (error) {
      console.error('readd error:', error);
      alert('追加に失敗しました。');
    }
  };

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
              onAdded={(msg) => {
                if (msg) setActionMessage(msg);
                fetchShoppingData();
              }}
            />

            <div>
              <ListSection
                shopTypes={data.shopTypes}
                items={data.items}
                initialMessage={actionMessage}
                onActionSuccess={() => {
                  setActionMessage('');
                  fetchShoppingData();
                }}
              />
            </div>
          </>
        )}

        {/* 履歴 */}
        {activeTab === 'history' && (
          <div>
            <HistorySection history={data.history} 
            onReadd={handleReadd} 
            />
          </div>
        )}

        {/* レシピ */}
        {activeTab === 'recipe' && (
          <div>
            <RecipeSection />
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