<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Users;

class UserController extends Controller
{

    public function list_user()
    {
        try {
            $users = Users::orderBy('created_at', 'desc')->get();
            if ($users->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => ['No hay usuarios registrados']
                ], 200);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => $users
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los usuarios: ' . $e->getMessage()
            ], 500);
        }
    }

    public function create_user(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'last_name' => 'required|string',
                'password' => 'required|string|min:8|confirmed',
                'email' => 'required|string|email|max:255|unique:usuarios',
                'type' => 'required|string'
            ], [
                'name.required' => 'El nombre es obligatorio',
                'last_name.required' => 'El apellido debe ser obligatorio',
                'password.required' => 'La contraseña es obligatoria',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres',
                'password.confirmed' => 'Las contraseñas no coinciden',
                'email.required' => 'El correo electrónico es obligatorio',
                'email.email' => 'El formato del correo electrónico es inválido',
                'email.unique' => 'Este correo electrónico ya está en uso',
                'type.required' => 'El tipo de usuario es obligatorio'
            ]);
            $users = Users::create([
                'name' => $request->name,
                'last_name' => $request->last_name,
                'password' => bcrypt($request->password),
                'email' => $request->email,
                'type' => $request->type,
                'active' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'usuario registrado con exito',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar al usuario: ' . $e->getMessage()
            ], 500);
        }
    }
}
