<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Services\RecipeGenerator;
use Illuminate\Support\Facades\Cache;
use App\Services\RecipeShareService;

class GenerateRecipeJob implements ShouldQueue
{
    use Queueable;

    protected $jobId;
    protected $ingredients;
    protected $userId;
    protected $recipeCount;

    /**
     * Create a new job instance.
     */
    public function __construct($jobId, $ingredients, $userId, $recipeCount)
    {
        $this->jobId = $jobId;
        $this->ingredients = $ingredients;
        $this->userId = $userId;
        $this->recipeCount = $recipeCount;
    }

    /**
     * Execute the job.
     */
    public function handle(RecipeGenerator $generator, RecipeShareService $shareService): void
    {
        try {
            $data = $generator->generate(
                $this->ingredients,
                $this->recipeCount
            );

            if (empty($data['recipes'])) {
                Cache::put("recipe_{$this->jobId}", [
                    'status' => 'error',
                    'message' => '食材として認識できなかったのじゃ'
                ], now()->addMinutes(10));

                return;
            }

            $recipes = array_map(function (array $recipe) use ($shareService) {
                $recipe['share_url'] = $shareService->encode($recipe);

                return $recipe;
            }, $data['recipes']);

            Cache::put("recipe_{$this->jobId}", [
                'status' => 'completed',
                'recipes' => $recipes
            ], now()->addMinutes(10));

        } catch (\Exception $e) {
            $msg = $e->getMessage();

            \Log::error('Recipe Job Error', [
                'message' => $e->getMessage(),
                'class' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);

            if (
                str_contains($msg, 'RateLimitedException') ||
                str_contains($msg, 'rate limited') ||
                str_contains($msg, '429')
            ) {
                $errorMessage = '無料枠制限でおじゃる';
            } elseif (
                str_contains($msg, 'ProviderOverloadedException') ||
                str_contains($msg, 'provider is overloaded') ||
                str_contains($msg, '503')
            ) {
                $errorMessage = 'AIが混み合っておるようじゃ…少し待ってから試してたもれ';
            } elseif (str_contains($msg, 'timeout')) {
                $errorMessage = '思考に時間がかかりすぎたのじゃ…もう一度試してたもれ';
            } elseif (str_contains($msg, 'schema')) {
                $errorMessage = '献立の形が崩れてしまったようじゃ';
            } else {
                $errorMessage = 'これまた珍妙なエラーが起きたのじゃ';
            }

            Cache::put("recipe_{$this->jobId}", [
                'status' => 'error',
                'message' => $errorMessage
            ], now()->addMinutes(10));
        }
    }
}
