<?php

namespace App\Http\Controllers\Shopping;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Jobs\GenerateRecipeJob;
use Illuminate\Support\Facades\Cache;
use App\Http\Requests\SuggestionRequest;
use App\Services\RecipeShareService;
use Illuminate\Http\JsonResponse;
use App\Services\ShoppingService;

class RecipeController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(SuggestionRequest $request, ShoppingService $shoppingService)
    {
        $ingredients = $request->input('ingredients');

        $items = array_filter(
            array_map(
                'trim',
                explode("\n", str_replace("\r", "", $ingredients))
            )
        );

        foreach ($items as $item) {
            if ($shoppingService->isInvalid($item)) {
                return response()->json([
                    'errors' => [
                        'ingredients' => [
                            '食材でないものを入力とな？'
                        ]
                    ]
                ], 422);
            }
        }

        $count = count($items);

        if ($count <= 2) {
            $recipeCount = 1;
        } elseif ($count <= 5) {
            $recipeCount = 3;
        } else {
            $recipeCount = 5;
        }

        $jobId = uniqid('recipe_');

        GenerateRecipeJob::dispatch(
            $jobId,
            $ingredients,
            auth()->id(),
            $recipeCount
        );

        return response()->json([
            'job_id' => $jobId,
        ]);
    }

    public function show(string $jobId)
    {
        $data = Cache::get("recipe_{$jobId}");

        if (!$data) {
            return response()->json([
                'status' => 'processing',
            ]);
        }

        return response()->json($data);
    }

    public function shared(
        string $data,
        RecipeShareService $shareService
    ): JsonResponse {
        try {
            $recipe = $shareService->decode($data);

            return response()->json([
                'recipe' => $recipe,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '献立の復元に失敗いたしました',
            ], 404);
        }
    }

}
