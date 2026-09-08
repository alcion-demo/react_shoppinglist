import { useState } from 'react';
import api from '../../utils/axios';

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

type EditFormProps = {
    item: ShoppingItem;
    shopTypes: ShopType[];
    onCancel: () => void;
    onUpdated: () => void;
};

const EditForm = ({
    item,
    shopTypes,
    onCancel,
    onUpdated,
}: EditFormProps) => {
    const [name, setName] = useState(item.item.name);
    const [shopType, setShopType] = useState(item.shop_type);
    const [price, setPrice] = useState(
        item.price > 0 ? String(item.price) : ''
    );
    const [quantity, setQuantity] = useState(item.quantity ?? '');

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = async (
        event: React.SubmitEvent
    ) => {
        event.preventDefault();

        setErrors({});

        try {
            await api.put(`/api/shopping-items/${item.id}`, {
                name: name,
                shop_type: shopType,
                price: price === '' ? null : Number(price),
                quantity: quantity === '' ? null : quantity,
            });

            onUpdated();
            onCancel();

        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
                return;
            }

            console.error('shopping item update error:', error);
        }
    };

  return (
    <>
        <form onSubmit={handleSubmit} className="space-y-3">

            <div className="flex gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white text-sm font-bold"
                    placeholder="商品名"
                />
            </div>

            {errors.name && (
                <span className="text-xs text-red-500">
                    {errors.name[0]}
                </span>
            )}

            <div className="flex gap-2 items-center">

                <select
                    value={shopType}
                    onChange={(event) =>
                        setShopType(Number(event.target.value))
                    }
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-xs"
                >
                    {shopTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className="w-24 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-xs"
                    placeholder="単価"
                />

                <input
                    type="text"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="w-16 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white text-xs"
                    placeholder="個"
                />

            </div>

            {errors.price && (
                <span className="text-xs text-red-500 block">
                    {errors.price[0]}
                </span>
            )}

            {errors.quantity && (
                <span className="text-xs text-red-500 block">
                    {errors.quantity[0]}
                </span>
            )}

            <div className="flex justify-end gap-2 text-xs pt-1">

                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-1.5 text-gray-500 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-bold transition-colors"
                >
                    キャンセル
                </button>

                <button
                    type="submit"
                    className="px-4 py-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors shadow-sm"
                >
                    保存
                </button>

            </div>

        </form></>
    );
};

export default EditForm;