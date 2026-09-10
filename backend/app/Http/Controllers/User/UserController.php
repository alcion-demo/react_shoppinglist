<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use App\Http\Requests\UpdatePasswordRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();

        $user->name = $request->name;
        $user->email = $request->email;

        $user->save();

        return response()->json([
            'message' => 'プロフィールを更新しました。',
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'アカウントを削除しました。',
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => '現在のパスワードが正しくありません。',
            ], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'パスワードを更新しました。',
        ]);
    }
}
