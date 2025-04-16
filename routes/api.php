<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerifyController;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working'
    ]);
});

//productos
Route::get('/list_product', [ProductController::class, 'list_product']);
Route::post('/create_product', [ProductController::class, 'create_product']);
Route::delete('/delete_product', [ProductController::class, 'delete_product']);
Route::put('/update_product', [ProductController::class, 'update_product']);

//categorias
Route::get('/list_category', [CategoryController::class, 'list_category']);
Route::post('/create_category', [CategoryController::class, 'create_category']);
Route::delete('/delete_category', [CategoryController::class, 'delete_category']);
Route::put('/update_category', [CategoryController::class, 'update_category']);

//usuarios
Route::get('/list_user', [UserController::class, 'list_user']);
Route::post('/create_user', [UserController::class, 'create_user']);
Route::delete('/delete_user', [UserController::class, 'delete_user']);
Route::put('/update_user', [UserController::class, 'Update_user']);
Route::middleware([EnsureFrontendRequestsAreStateful::class])->post('/login_user', [UserController::class, 'login_user']);

//clientes
Route::get('/list_customer', [CustomerController::class, 'list_customer']);
Route::put('/update_customer', [CustomerController::class, 'update_customer']);
Route::put('/disable_customer', [CustomerController::class, 'disable_customer']);
Route::put('/enable_customer', [CustomerController::class, 'enable_customer']);
Route::get('/verify/{token}', [VerifyController::class, 'verify']);
Route::post('/register', [CustomerController::class, 'register_customer']);
Route::middleware([EnsureFrontendRequestsAreStateful::class])->post('/login_customer', [CustomerController::class, 'login_customer']);

//ventas
Route::get('/list_sale', [SalesController::class, 'list_sale']);
Route::post('/buy', [SalesController::class, 'buy']);
