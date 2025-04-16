<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use App\Models\Products;
use App\Models\SalesDetail;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function list_sale()
    {
        try {
            $sales = SalesDetail::orderBy('created_at', 'desc')->get();
            if ($sales->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => ['No hay ventas']
                ], 200);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => $sales
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las ventas: ' . $e->getMessage()
            ], 500);
        }
    }
    public function buy(Request $request)
    {
        try {
            $request->validate([
                'id_customer' => 'required|exists:clientes,id',
                'id_product' => 'required|exists:productos,id',
                'amount' => 'required'
            ], [
                'id_customer.required' => 'El cliente es requerido',
                'id_customer.exists' => 'Este cliente no existe',
                'id_product.required' => 'El producto es requerido',
                'id_product.exists' => 'Este producto no existe',
                'amount.required' => 'Se debe saber que cantidad de productos se va a comprar'
            ]);

            $customer = Customers::find($request->id_customer);
            $product = Products::find($request->id_product);

            //verificando si el usuario esta verificado
            if ($customer->verify === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'El cliente no esta verificado'
                ], 400);
            }
            // Verificando que la oferta esté disponible
            if (
                !$product ||
                $product->stock <= 0
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'El producto no esta disponible o no hay en existencias.'
                ], 400);
            }

            $amount = (float)$request->amount;
            $unit_price = (float)$product->price;

            $total = round($amount * $unit_price, 2);


            $sale = SalesDetail::create([
                'id_customer' => $request->id_customer,
                'id_product' => $request->id_product,
                'amount' => $amount,
                'unit price' => $unit_price,
                'total' => $total
            ]);
            // Actualizando el stock de la oferta
            $product->stock -= $amount;

            $product->save();

            return response()->json([
                'success' => true,
                'data' => $sale,
                'message' => 'Compra exitosa.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la compra: ' . $e->getMessage()
            ], 500);
        }
    }
}
