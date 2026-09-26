<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
     * admin権限でUser情報編集
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')?->id ?? $this->route('user') ?? $this->route('id');
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => [
                            'required',
                            'string',
                            'email',
                            'max:255',
                            Rule::unique('users', 'email')->ignore($userId), // 編集対象ユーザーのIDを除外
                        ],
            'is_admin' => ['nullable', 'boolean'],
        ];
    }
}
