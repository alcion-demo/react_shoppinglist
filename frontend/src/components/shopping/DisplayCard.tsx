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

type DisplayCardProps = {
    item: ShoppingItem;
    shopTypes: ShopType[];
    onEdit: () => void;
    onDelete: () => void;
    onPurchase: () => void;
};

const DisplayCard = ({ item, shopTypes, onEdit, onDelete, onPurchase } : DisplayCardProps) => {
    const shopTypeLabel = shopTypes.find(
        (type) => type.value === item.shop_type
    )?.label;
  return (
    <div>
      <div className="flex items-center justify-between">

          {/* テキスト情報エリア */}
          <div className="flex-1 min-w-0 mr-4">

              <div className="text-left text-gray-900 dark:text-gray-100 font-bold text-sm truncate mb-1">
                  {item.item.name}

                  {item.recentPurchasedAt && (
                      <span className="inline-flex items-center ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                          {new Date(item.recentPurchasedAt).toLocaleDateString('ja-JP', {
                              month: '2-digit',
                              day: '2-digit',
                          })}済
                      </span>
                  )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">

                  <span className="truncate max-w-[100px]">
                      {shopTypeLabel}
                  </span>

                  <span className="text-gray-300 dark:text-gray-600">
                      |
                  </span>

                  {item.price > 0 && (
                      <span className="font-medium text-gray-600 dark:text-gray-300 mr-1">
                          ¥{item.price.toLocaleString()}
                      </span>
                  )}

                  {item.quantity && (
                      <span className="flex items-center gap-1">
                          <span className="text-[9px] text-gray-400 dark:text-gray-600">
                              ×
                          </span>

                          <span>{item.quantity}</span>
                      </span>
                  )}

              </div>
          </div>

          {/* 右側のボタンエリア */}
          <div className="flex items-center gap-2">

              {/* 済ボタン */}
              <button
                  type="button"
                  title="購入完了"
                  onClick={onPurchase}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                            bg-emerald-500/10 text-emerald-400"
              >
                  <span className="text-xs font-bold">
                      済
                  </span>
              </button>

              {/* 編集ボタン */}
              <button
                  type="button"
                  title="編集"
                  onClick={onEdit}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                            bg-blue-500/10 text-blue-400"
              >
                  <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                  </svg>
              </button>

              {/* 削除ボタン */}
              <button
                  type="button"
                  title="削除"
                  onClick={onDelete}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                            bg-red-500/10 text-red-400"
              >
                  <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                  </svg>
              </button>
            </div>
        </div>
    </div>
  );
};

export default DisplayCard;