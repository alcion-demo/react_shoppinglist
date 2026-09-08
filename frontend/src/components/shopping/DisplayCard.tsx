import type { FC } from 'react';

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

type DisplayCardProps = {
    item: ShoppingItem;
    shopTypes: ShopType[];
};

const DisplayCard: FC<DisplayCardProps> = ({ item, shopTypes }) => {
    const shopTypeLabel = shopTypes.find(
        (type) => type.value === item.shop_type
    )?.label;

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700/50">
            <div className="flex items-center justify-between">

                {/* テキスト情報エリア */}
                <div className="flex-1 min-w-0 mr-4">

                    <div className="text-gray-900 dark:text-gray-100 font-bold text-sm truncate mb-1">
                        {item.item.name}
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
                                {item.price > 0 && (
                                    <span className="text-[9px] text-gray-400 dark:text-gray-600">
                                        ×
                                    </span>
                                )}

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
                        className="w-10 h-10 rounded-xl bg-emerald-500 text-white"
                    >
                        済
                    </button>

                    {/* 編集ボタン */}
                    <button
                        type="button"
                        title="編集"
                        className="w-10 h-10 rounded-xl bg-blue-500 text-white"
                    >
                        編集
                    </button>

                    {/* 削除ボタン */}
                    <button
                        type="button"
                        title="削除"
                        className="w-10 h-10 rounded-xl bg-red-500 text-white"
                    >
                        削除
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DisplayCard;