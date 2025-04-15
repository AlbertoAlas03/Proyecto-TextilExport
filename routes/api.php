<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working'
    ]);
});

//rutas para productos
Route::get('/list_product', [ProductController::class, 'list_product']);
Route::post('/create_product', [ProductController::class, 'create_product']);
Route::delete('/delete_product', [ProductController::class, 'delete_product']);
Route::put('/update_product', [ProductController::class, 'update_product']);

//rutas para categorias
Route::get('/list_category', [CategoryController::class, 'list_category']);
Route::post('/create_category', [CategoryController::class, 'create_category']);
Route::delete('/delete_category', [CategoryController::class, 'delete_category']);
Route::put('/update_category', [CategoryController::class, 'update_category']);

//rutas para usuarios
Route::get('/list_user', [UserController::class, 'list_user']);
Route::post('/create_user', [UserController::class, 'create_user']);
