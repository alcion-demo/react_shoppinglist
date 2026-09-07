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
};

const ListSection = ({ shopTypes, items }: ListSectionProps) => {
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
                <form className="space-y-2 p-2 dark:bg-gray-800/50 rounded-2xl">

                    <div className="flex gap-2">
                        <input
                            type="text"
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
                            className="w-28 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                            placeholder="単価"
                        />

                        <input
                            type="text"
                            className="w-16 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                            placeholder="個"
                        />

                    </div>

                </form>
            </div>

            {/* 現在のリスト */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 px-2 uppercase tracking-wider mb-2">
                    現在のリスト
                </h3>

                {items.map((item) => (
                    <div key={item.id}>
                        {item.item.name}
                    </div>
                ))}

            </div>

        </section>
    );
};

export default ListSection;
