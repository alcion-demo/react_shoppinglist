<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーション属性名の日本語マッピング
     */
    public  function attributes(): array
    {
        return [
            'name'     => '名前',
            'email'    => 'メールアドレス',
            'password' => 'パスワード',
            'is_admin' => '管理者権限',
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . ($userId ?? 'NULL')],
            'is_admin' => ['nullable', 'boolean'],
        ];
    }
}
