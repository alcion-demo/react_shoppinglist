<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SuggestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ingredients' => [
                'required',
                'string',
                'max:2000',
                function ($attribute, $value, $fail) {
                    if (preg_match('/(\X)\1\1/u', $value)) {
                        $fail('食材でないものを入力とな？');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'ingredients.required' => '食材を入力せずに献立提案とな？',
            'ingredients.max'      => '一度に入力できるのは2000文字まででおじゃる。',
        ];
    }

    public function attributes(): array
    {
        return [
            'ingredients' => '食材',
        ];
    }
}
