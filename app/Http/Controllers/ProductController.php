<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Products;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function list_product()
    {
        try {
            $products = Products::with(['categories'])->orderBy('created_at', 'desc')->get();
            if ($products->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ], 200);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => $products
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los productos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function create_product(Request $request)
    {
        try {
            $request->validate([
                'id_category' => 'required|integer|exists:categorias,id',
                'code' => 'required|string|regex:/^PROD\d{5}$/|unique:productos,code',
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'imagen' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'price' => 'required|decimal:2|min:0.1',
                'stock' => 'required|integer|min:1'
            ], [
                'id_category.required' => 'La categoria del producto es obligatoria',
                'id_category.exists' => 'Esta categoria no existe',
                'code.required' => 'El codigo del producto es obligatorio',
                'code.regex' => 'Formato de codigo del producto incorrecto, debe ser PROD#####',
                'code.unique' => 'Este codigo ya existe',
                'name.required' => 'El nombre del producto es obligatorio',
                'description.required' => 'La descripción del producto es obligatoria',
                'imagen.image' => 'El archivo debe ser una imagen',
                'imagen.mimes' => 'La imagen tiene que ser formato jpeg,png,jpg',
                'imagen.max' => 'El maximo tamaño de imagen es 2048px',
                'price.required' => 'El precio es obligatorio',
                'price.decimal' => 'Formato del precio no válido',
                'price.min' => 'El precio debe ser mayor a 0',
                'stock.required' => 'Stock obligatorio',
                'stock.integer' => 'Formato de stock no válido',
                'stock.min' => 'El stock debe ser un entero positivo'
            ]);

            $data = $request->all();

            if ($request->hasFile('imagen')) {
                $filename = time() . '_' . $request->file('imagen')->getClientOriginalName();
                $data['imagen'] = $request->file('imagen')->storeAs('products', $filename, 'public');
            }

            $product = Products::create($data);

            return response()->json([
                'message' => 'Producto agregado con exito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear un nuevo producto: ' . $e->getMessage()], 500);
        }
    }

    public function delete_product(Request $request)
    {
        try {
            $request->validate([
                'id_product' => 'required|exists:productos,id'
            ], [
                'id_product.required' => 'El id es obligatorio',
                'id_product.exists' => 'Este producto no existe'
            ]);
            $product_deleted = Products::where('id', '=', $request->id_product)->delete();
            return response()->json([
                'message' => 'Producto eliminado con exito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar el producto: ' . $e->getMessage()], 500);
        }
    }

    public function update_product(Request $request)
    {
        try {
            $request->validate([
                'id_product' => 'required|exists:productos,id',
                'id_category' => 'required|exists:categorias,id',
                'code' => [
                    'required',
                    'string',
                    'min:9',
                    'regex:/^PROD\d{5}$/',
                    Rule::unique('productos')->ignore($request->id_product)
                ],
                'name' => 'required|string',
                'description' => 'required|string',
                'imagen' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'price' => 'required|min:0.1',
                'stock' => 'required|min:1'
            ], [
                'id_category.required' => 'La nueva categoria del producto es obligatoria',
                'id_category.exists' => 'Esta categoria no existe',
                'code.required' => 'El codigo del producto nuevo es obligatorio',
                'code.regex' => 'Formato de codigo del producto nuevo es incorrecto, debe ser PROD#####',
                'code.unique' => 'Este codigo ya existe',
                'name.required' => 'El nuevo nombre del producto es obligatorio',
                'description.required' => 'La nueva descripción del producto es obligatoria',
                'imagen.image' => 'El archivo debe ser una imagen',
                'imagen.mimes' => 'La nueva imagen tiene que ser formato jpeg,png,jpg',
                'imagen.max' => 'El maximo tamaño de la nueva imagen es 2048px',
                'price.required' => 'El precio nuevo es obligatorio',
                'stock.required' => 'Stock nuevo obligatorio',
                'stock.min' => 'El stock debe ser entero positivo'
            ]);
            $product = Products::findOrFail($request->id_product);
            $data = $request->except('imagen');

            if ($request->hasFile('imagen')) {
                // Eliminar la imagen anterior si existe
                if ($product->imagen) {
                    Storage::disk('public')->delete($product->imagen);
                }

                // Guardar la nueva imagen
                $data['imagen'] = $request->file('imagen')->store('products', 'public');
            }

            $product->update($data);

            return response()->json([
                'message' => 'Producto actualizado con exito',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la categoria: ' . $e->getMessage()
            ], 500);
        }
    }
}
