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

        return response()->json([
            'items' => CurrentCart::forUser($userId)
                ->with('item.recentPurchaseLogs')
                ->get(),

            'frequentItems' => PurchaseLog::getFrequentItems($userId),

            'history' => PurchaseLog::forUser($userId)
                ->with('item')
                ->latest('purchased_at')
                ->get()
                ->groupBy('purchased_date_string'),

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
            'price'     => $validated['price'],
            'quantity'  => $validated['quantity'] !== ''
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
