<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\SalesDetail;
use App\Models\Users;
use App\Models\Customers;

class CountController extends Controller
{
    public function Count()
    {
        try {
            $countProduct = Products::count();
            $countSale = SalesDetail::count();
            $countUser = Users::count();
            $countCustomer = Customers::count();
            return response()->json([
                'success' => true,
                'data' => [
                    [
                        'Cantidad_de_productos' => $countProduct,
                        'Cantidad_de_ventas' => $countSale,
                        'Cantidad_de_usuarios' => $countUser,
                        'Cantidad_de_clientes' => $countCustomer
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al contar data: ' . $e->getMessage()
            ], 500);
        }
    }
}
