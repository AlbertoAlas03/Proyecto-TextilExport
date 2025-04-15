<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categories;

class CategoryController extends Controller
{
    public function list_category()
    {
        try {
            $categories = Categories::orderBy('created_at', 'desc')->get();
            if ($categories->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => ['No hay categorias disponibles']
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
                'name' => 'required|string',
                'description' => 'required|string'
            ], [
                'name.required' => 'El nombre de la categoria es obligatoria',
                'description.required' => 'La descripción de la categoria es obligatoria'
            ]);
            $categories = Categories::create([
                'name' => $request->name,
                'description' => $request->description
            ]);
            return response()->json([
                'success' => true,
                'message' => 'categoria agregada con exito',
                'data' => $categories
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
            $categorie_deleted = Categories::where('id', '=', $request->id_category)->delete();
            return response()->json([
                'success' => true,
                'message' => 'categoria eliminada con exito',
                'data' => $categorie_deleted
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
            $category_updated = Categories::where('id', $request->id_category)->update([
                'name' => $request->name,
                'description' => $request->description
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Categoria actualizada con exito',
                'data' => $category_updated
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la categoria: ' . $e->getMessage()
            ], 500);
        }
    }
}
