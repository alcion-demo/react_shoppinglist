<?php

namespace App\Http\Controllers\Shopping;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CurrentCart;
use App\Models\PurchaseLog;
use App\Services\ShoppingService;
use Illuminate\Support\Facades\Auth;
use App\Enums\ShopType;
use App\Http\Requests\StoreShoppingRequest;
use App\Http\Requests\UpdateShoppingRequest;

class ShoppingController extends Controller
{
    /**
     * __construct
     */
    public function __construct(
        protected ShoppingService $shoppingService,
    ){}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();

        $items = CurrentCart::forUser($userId)
        ->with('item')
        ->get()
        ->map(function ($cart) use ($userId) {
            return [
                ...$cart->toArray(),
                'recentPurchasedAt' => $this->shoppingService->getRecentPurchasedAt(
                    $userId,
                    $cart->shopping_item_id
                ),
            ];
        });

        return response()->json([
            'items' => $items,

            'frequentItems' => collect(
                PurchaseLog::getFrequentItems($userId)
            )->values(),

            'history' => PurchaseLog::forUser($userId)
                ->with('item')
                ->latest('purchased_at')
                ->get()
                ->groupBy('purchased_date_string'),

            //カート1件ずつ処理して、recentPurchasedAt を追加した新しいCollectionにする
            //function ($type)
            'shopTypes' => collect(ShopType::cases())->map(fn ($type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ])->values(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShoppingRequest $request, ShoppingService $shoppingService)
    {
        $userId = Auth::id();

        $validated = $request->validated();
        $this->shoppingService->savePurchase($userId, [
            'name'      => $validated['name'],
            'shop_type' => $validated['shop_type'],
            'price'     => $validated['price'] ?? null,
            'quantity'  => ($validated['quantity'] ?? '') !== ''
                ? $validated['quantity']
                : null,
        ]);

        return response()->json([
            'message' => 'リストに追加しました',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

 
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShoppingRequest $request, string $id)
    {
        // バリデーションを実行
        $validated = $request->validated();

        $this->shoppingService->updateCart(
            Auth::id(),
            $id,
            [
                'name'      => $validated['name'],
                'shop_type' => $validated['shop_type'],
                'price'     => $validated['price'] ?? 0,
                'quantity'  => $validated['quantity'] ?? null,
            ]
        );

        return response()->json([
            'message' => '変更を保存しました',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->shoppingService->deleteCart(
            Auth::id(),
            (int) $id
        );

        return response()->json([
            'message' => 'リストから削除しました',
        ]);
    }

    public function purchase(ShoppingService $shoppingService, int $id)
    {
        $log = $shoppingService->recordPurchase($id, []);

        return response()->json([
            'message' => '購入を記録しました！',
            'purchaseLog' => $log,
        ]);
    }
}
