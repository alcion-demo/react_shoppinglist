import api from '../../utils/axios';

type FrequentItem = {
  shopping_item_id: number;
  item: {
    id: number;
    name: string;
  };
};

type CartItem = {
  shopping_item_id: number;
};

type QuickMenuProps = {
  frequentItems: FrequentItem[];
  items: CartItem[];
  onAdded: () => void;
};

const QuickMenu = ({
  frequentItems,
  items,
  onAdded,
}: QuickMenuProps) => {

  if (!Array.isArray(frequentItems) || frequentItems.length === 0) {
    return null;
  }

  const handleQuickAdd = async (name: string) => {
    try {
      await api.post('/api/shopping-items', {
        name,
        shop_type: 1,
      });

      onAdded();
    } catch (error: any) {
      console.log('quick add error:', error.response?.status);
      console.log('quick add error data:', error.response?.data);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-gray-500 px-2 uppercase tracking-wider mb-2">
        よく買うもの
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {frequentItems.map((log) => {
          const isAlreadyInCart = items.some(
            (item) =>
              item.shopping_item_id === log.shopping_item_id
          );

          return (
            <button
              key={log.shopping_item_id}
              type="button"
              disabled={isAlreadyInCart}
              onClick={() => handleQuickAdd(log.item.name)}
              className={`w-full py-2 px-3 text-[11px] font-bold text-center truncate
                                ${isAlreadyInCart
                  ? 'opacity-30 cursor-not-allowed'
                  : 'opacity-100 hover:bg-blue-500/20'
                }
                                bg-gray-800/40 text-gray-200
                                border border-blue-200/30 rounded-full
                                transition-all duration-300 transform active:scale-95`}
            >
              ＋ {log.item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickMenu;