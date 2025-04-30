<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShoppingCart;

class ShoppingCartController extends Controller
{
    public function list_cart_items(Request $request)
    {
        $request->validate([
            'id_customer' => 'required'
        ], [
            'id_customer.required' => 'El id del cliente es requerido'
        ]);
        $cartItems = ShoppingCart::with('product')->where('id_customer', $request->id_customer)->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'data' => []
            ], 200);
        } else {
            return response()->json([
                'success' => true,
                'data' => $cartItems
            ], 200);
        }
    }

    public function delete_cart_item(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required'
            ], [
                'id.required' => 'El id es requerido'
            ]);

            $cartItem = ShoppingCart::find($request->id);
            if (!$cartItem) {
                return response()->json([
                    'message' => 'Item no encontrado'
                ], 404);
            } else {
                $cartDeleted = $cartItem->delete();
                if ($cartDeleted) {
                    return response()->json([
                        'message' => 'Item eliminado correctamente'
                    ], 200);
                }
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar el item: ' . $e->getMessage()], 500);
        }
    }

    public function add_cart_item(Request $request)
    {
        try {
            $request->validate([
                'id_customer' => 'required',
                'id_product' => 'required'
            ], [
                'id_customer.required' => 'El id del cliente es requerido',
                'id_product.required' => 'El id del producto es requerido'
            ]);

            $verifyShoppingCart = ShoppingCart::where('id_product', $request->id_product)->first();

            if ($verifyShoppingCart) {
                return response()->json([
                    'message' => 'Ya has añadido este producto'
                ], 400);
            }

            ShoppingCart::create([
                'id_customer' => $request->id_customer,
                'id_product' => $request->id_product,
            ]);
            return response()->json([
                'message' => 'Item agregado correctamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al agregar al carrito: ' . $e->getMessage()], 500);
        }
    }
}
