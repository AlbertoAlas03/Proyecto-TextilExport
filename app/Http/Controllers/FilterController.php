<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\Categories;
use App\Models\Users;
use App\Models\Customers;
use App\Models\SalesDetail;
use Illuminate\Support\Facades\Crypt;

use function Pest\Laravel\get;

class FilterController extends Controller
{
    public function SearchProductByCategory(Request $request)
    {
        try {
            $request->validate([
                'category' => 'required|string'
            ], [
                'category.required' => 'Debes ingresar el nombre de la categoría que buscas',
                'category.string' => 'Lo ingresado no es válido'
            ]);

            $category = Categories::where('name', $request->category)->first();
            if (!$category) {
                return response()->json([
                    'message' => 'Esta categoría no existe'
                ], 400);
            }

            $products = Products::with('categories')->where('id_category', $category->id)->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function searchProductByCode(Request $request)
    {
        try {
            $request->validate([
                'code' => 'required|string'
            ], [
                'code.required' => 'Debes ingresar el código del producto que andas buscando',
                'code.string' => 'Lo ingresado no es válido'
            ]);

            $products = Products::with(['categories'])->orderBy('created_at', 'desc')->where('code', $request->code)->first();
            if (!$products) {
                return response()->json([
                    'message' => 'Este producto no existe'
                ], 400);
            }
            return response()->json([
                'success' => true,
                'data' => [$products]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function categoryByName(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string'
            ], [
                'name.required' => 'Debes ingresar el nombre de la categoría que estas buscando',
                'name.string' => 'Lo ingresado no es válido'
            ]);

            $categorieByName = Categories::where('name', $request->name)->first();

            if (!$categorieByName) {
                return response()->json([
                    'message' => 'Esta categoría no existe'
                ], 400);
            }

            return response()->json([
                'success' => true,
                'data' => [$categorieByName]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function userByLast_name(Request $request)
    {
        try {
            $request->validate([
                'last_name' => 'required'
            ], [
                'last_name.required' => 'Debes ingresar el apellido del usuario que deseas buscar'
            ]);
            $user = Users::where('last_name', $request->last_name)->get();
            if (!$user) {
                return response()->json(['message' => 'Este usuario no existe'], 400);
            }
            $userData = $user->map(function ($user) {

                $decrypted = Crypt::decryptString($user->password);

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'last_name' => $user->last_name,
                    'password' => $decrypted,
                    'email' => $user->email,
                    'type' => $user->type,
                    'active' => $user->active,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ];
            });
            return response()->json([
                'success' => true,
                'data' => $userData
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function customerByLast_name(Request $request)
    {
        try {
            $request->validate([
                'last_name' => 'required|string'
            ], [
                'last_name.required' => 'Debes ingresar el apellido del usuario que deseas buscar'
            ]);
            $customers = Customers::where('last_name', $request->last_name)->get();
            if (!$customers) {
                return response()->json([
                    'message' => 'El cliente no existe'
                ], 400);
            }
            $customerData = $customers->map(function ($customer) {

                $decrypted = Crypt::decryptString($customer->password);

                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'last_name' => $customer->last_name,
                    'email' => $customer->email,
                    'password' => $decrypted,
                    'address' => $customer->address,
                    'phone_number' => $customer->phone_number,
                    'type' => $customer->type,
                    'verify' => $customer->verify,
                    'token_verification' => $customer->token_verification,
                    'status' => $customer->status,
                    'created_at' => $customer->created_at,
                    'updated_at' => $customer->updated_at
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $customerData
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function SearchSale(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required'
            ], [
                'name.required' => 'Debes ingresar el nombre del producto de la venta realizada'
            ]);
            $products = Products::where('name', $request->name)->first();
            if (!$products) {
                return response()->json([
                    'message' => 'Este producto no existe'
                ], 400);
            }
            $sales = SalesDetail::where('id_product', $products->id)->with(['customer', 'product'])->orderBy('created_at', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $sales
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function SearchSaleCustomer(Request $request)
    {
        try {
            $request->validate([
                'id_customer' => 'required',
                'code' => 'required'
            ], [
                'id_customer.required' => 'El id del cliente es requerido',
                'code.required' => 'Debes ingresar el código del producto que andas buscando'
            ]);
            $product = Products::where('code', $request->code)->first();
            if (!$product) {
                return response()->json([
                    'message' => 'Este producto no existe'
                ], 400);
            }

            $sale = SalesDetail::where([
                ['id_customer', $request->id_customer],
                ['id_product', $product->id]
            ])->with(['product'])->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $sale
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
