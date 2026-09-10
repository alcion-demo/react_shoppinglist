<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;

class AdminUserController extends Controller
{
    /**
     * __construct
     */
    public function __construct(
        protected User $user,
        protected UserService $userService,
    ){}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $users = $this->user->userList($request->input('keyword'));
$users = $this->userService->userList();
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request, UserService $userService)
    {
        $data = $request->validated();
        $userService->createUser($data);

        return response()->json([
            'message' => 'ユーザーを追加しました',
        ], 201);
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
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $user->update($data);

        return response()->json([
            'message' => 'ユーザーを更新しました',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'ユーザーを削除しました',
        ]);
    }
}
