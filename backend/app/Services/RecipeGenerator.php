<?php
declare(strict_types=1);

namespace App\Services;

use App\Ai\Agents\NoblemanAgent;

class RecipeGenerator
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected NoblemanAgent $agent)
    {
        //
    }

    /**
     * AI呼び出し
     *
     * @param string $ingredients
     * @param integer $recipeCount
     * @return array
     */
    public function generate(string $ingredients, int $recipeCount): array
    {
        $items_input = explode("\n", str_replace("\r", "", $ingredients));

        $prompt = "冷蔵庫に" . implode('、', $items_input) . "があるのじゃ。" .
                    "これらを活用しつつ、必要であれば他の食材を買い足すことも考慮して、" .
                    "{$recipeCount}件の献立を雅に提案せよ。";

        $response = $this->agent->prompt($prompt);

        // ここでSDK固有の型を剥がして、アプリが扱いやすい配列のみを返す
        return $response->structured;
    }
}
