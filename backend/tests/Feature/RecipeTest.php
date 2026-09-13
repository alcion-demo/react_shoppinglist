<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Cache;
use App\Services\RecipeShareService;

class RecipeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_user_can_request_recipe_suggestion(): void
    {
        Queue::fake();

        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/recipes', [
                'ingredients' => "卵\n玉ねぎ",
            ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'job_id',
            ]);

        Queue::assertPushed(\App\Jobs\GenerateRecipeJob::class);
    }

    public function test_recipe_status_is_processing_when_job_is_not_completed(): void
    {
        $user = User::factory()->create();

        $jobId = 'recipe_test_123';

        $response = $this->actingAs($user)
            ->getJson("/api/recipes/{$jobId}");

        $response
            ->assertOk()
            ->assertJson([
                'status' => 'processing',
            ]);
    }

    public function test_completed_recipe_result_can_be_retrieved(): void
    {
        $user = User::factory()->create();

        $jobId = 'recipe_test_completed';

        Cache::put("recipe_{$jobId}", [
            'status' => 'completed',
            'recipes' => [
                [
                    'name' => '卵焼き',
                    'ingredients' => ['卵'],
                    'amount' => '2個',
                    'missing_ingredients' => [],
                    'metadata' => [
                        'difficulty' => '簡単',
                        'total_time' => '10分',
                    ],
                    'steps' => [
                        [
                            'description' => '卵を溶く',
                            'duration' => null,
                        ],
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/recipes/{$jobId}");

        $response
            ->assertOk()
            ->assertJson([
                'status' => 'completed',
                'recipes' => [
                    [
                        'name' => '卵焼き',
                    ],
                ],
            ]);
    }

    public function test_recipe_status_returns_error_when_job_failed(): void
    {
        $user = User::factory()->create();

        $jobId = 'recipe_test_error';

        Cache::put("recipe_{$jobId}", [
            'status' => 'error',
            'message' => '無料枠制限でおじゃる',
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/recipes/{$jobId}");

        $response
            ->assertOk()
            ->assertJson([
                'status' => 'error',
                'message' => '無料枠制限でおじゃる',
            ]);
    }

    public function test_recipe_can_be_displayed_from_shared_url(): void
    {
        $recipe = [
            'name' => '卵焼き',
            'ingredients' => ['卵', '砂糖'],
            'amount' => '2個',
            'missing_ingredients' => [],
            'metadata' => [
                'difficulty' => '簡単',
                'total_time' => '10分',
            ],
            'steps' => [
                [
                    'description' => '卵を溶く',
                    'duration' => null,
                ],
            ],
        ];

        $shareService = app(RecipeShareService::class);

        $shareUrl = $shareService->encode($recipe);

        $response = $this->get(
            parse_url($shareUrl, PHP_URL_PATH)
        );

        $response
            ->assertOk()
            ->assertJson([
                'recipe' => $recipe,
            ]);
    }

    public function test_invalid_shared_recipe_returns_404(): void
    {
        $response = $this->get('/api/recipes/share/invalid-data');

        $response->assertNotFound();
    }
}
