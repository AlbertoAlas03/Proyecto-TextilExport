<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categories;
use App\Models\Products;

class CategoryController extends Controller
{
    public function list_category()
    {
        try {
            $categories = Categories::orderBy('created_at', 'desc')->get();
            if ($categories->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ], 200);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => $categories
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las categorias: ' . $e->getMessage()
            ], 500);
        }
    }
    public function create_category(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:categorias,name',
                'description' => 'required|string'
            ], [
                'name.required' => 'El nombre de la categoria es obligatoria',
                'name.unique' => 'Esta categoría ya existe',
                'description.required' => 'La descripción de la categoria es obligatoria'
            ]);
            $categories = Categories::create([
                'name' => $request->name,
                'description' => $request->description
            ]);
            return response()->json([
                'message' => 'categoria agregada con exito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la categoria: ' . $e->getMessage()
            ], 500);
        }
    }

    public function delete_category(Request $request)
    {
        try {
            $request->validate([
                'id_category' => 'required|integer|exists:categorias,id'
            ], [
                'id_category.required' => 'El id de la categoria a eliminar es obligatoria',
                'id_category.integer' => 'El id debe ser un entero',
                'id_category.exists' => 'Esta categoria no existe'
            ]);
            $products = Products::where('id_category', '=', $request->id_category)->get();
            if ($products) {
                return response()->json([
                    'message' => 'No puedes eliminar esta categoría porque existen productos asignados'
                ], 500);
            }
            $categorie_deleted = Categories::where('id', '=', $request->id_category)->delete();
            return response()->json([
                'message' => 'categoria eliminada con exito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la categoria: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update_category(Request $request)
    {
        try {
            $request->validate([
                'id_category' => 'required|exists:categorias,id',
                'name' => 'required|string',
                'description' => 'required|string'
            ], [
                'id_category.exists' => 'Esta categoria no existe',
                'id_category.required' => 'El id es requerido',
                'name.required' => 'El nuevo nombre es obligatorio',
                'description.required' => 'La nueva descripción es obligatoria'
            ]);

            $category = Categories::findOrFail($request->id_category);

            $updateData = [
                'name' => $request->name,
                'description' => $request->description
            ];

            $category->update($updateData);

            return response()->json([
                'message' => 'Categoria actualizada con exito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la categoria: ' . $e->getMessage()
            ], 500);
        }
    }
}
