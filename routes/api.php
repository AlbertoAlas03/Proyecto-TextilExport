<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CountController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerifyController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\FilterController;
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
Route::post('/password/send_code_customer', [CustomerController::class, 'SendCode']);
Route::post('/password/change_password_customer', [CustomerController::class, 'ChangePassword']);

//ventas
Route::get('/list_sale', [SalesController::class, 'list_sale']);
Route::post('/list_sales_customer', [CustomerController::class, 'sales_customer']);
Route::post('/buy', [SalesController::class, 'buy']);

//count
Route::get('/count', [CountController::class, 'Count']);

//cambiar contreña
Route::post('/password/email', [ChangePasswordController::class, 'sendCode']);
Route::post('/password/change', [ChangePasswordController::class, 'changePassword']);

//carrito de compras
Route::post('/list_cart_items', [ShoppingCartController::class, 'list_cart_items']);
Route::delete('/delete_cart_item', [ShoppingCartController::class, 'delete_cart_item']);
Route::post('/add_cart_item', [ShoppingCartController::class, 'add_cart_item']);

//search
Route::post('/search_products_category', [FilterController::class, 'SearchProductByCategory']);
Route::post('/search_products_code', [FilterController::class, 'searchProductByCode']);
Route::post('/search_category_name', [FilterController::class, 'categoryByName']);
Route::post('/search_user_last_name', [FilterController::class, 'userByLast_name']);
Route::post('/search_customer_last_name', [FilterController::class, 'customerByLast_name']);
Route::post('/search_sale', [FilterController::class, 'SearchSale']);
Route::post('/search_sale_customer',[FilterController::class, 'SearchSaleCustomer']);
