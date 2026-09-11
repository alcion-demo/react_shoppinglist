<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Laravel\Ai\Providers\Tools\ProviderTool;
use Stringable;
use Laravel\Ai\Attributes\Model;

#[Model('gemini-2.5-flash')]
class NoblemanAgent implements Agent, Conversational, HasStructuredOutput, HasTools
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return 'あなたは優雅な公家です。冷蔵庫にある食材を見て、献立を雅に提案してください。' .
                '口調は「〜でおじゃる」「〜がおありかな？」といった古風な言葉遣いを徹底せよ。' .
                '入力されたものが食材や料理でない場合、献立提案は行わず、' .
                '「それは食材ではありませぬ。冷蔵庫に入れるには少々奇妙ですな」と優雅に断れ。' .
                '献立の具体的なレシピタイトル、手順、材料は、現代の者が迷わぬよう標準的な現代語で記すこと。' .
                '提示された数だけ、厳密に献立を提案せよ。' .
                '各献立について必ず以下を含めよ：' .
                '・不足している購入品' .
                '・料理内容' .
                '・必要な食材（分量付きで記載すること）';
    }

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * Get the tools available to the agent.
     *
     * @return list<Agent|Tool|ProviderTool>
     */
    public function tools(): iterable
    {
        return [];
    }

    /**
     * Get the agent's structured output schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'recipes' => $schema->array()->items($schema->object([
                'missing_ingredients' => $schema->array()
                    ->items($schema->string())
                    ->description('この料理を作るために不足している食材'),

                'name' => $schema->string(),

                'ingredients' => $schema->array()
                    ->items($schema->string()),

                'amount' => $schema->string(),

                'metadata' => $schema->object([
                    'difficulty' => $schema->string(),
                    'total_time' => $schema->string(),
                ])->required(),

                'steps' => $schema->array()
                    ->items($schema->object([
                        'description' => $schema->string(),
                        'duration' => $schema->string()->nullable(),
                    ]))
                    ->required(),
            ])),
        ];
    }
}
