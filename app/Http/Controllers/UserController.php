<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\Users;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function list_user()
    {
        try {
            $users = Users::orderBy('created_at', 'desc')->get();
            if ($users->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => []
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
                'last_name.required' => 'El apellido es obligatorio',
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

    public function Update_user(Request $request)
    {
        try {
            $request->validate([
                'id_user' => 'required|exists:usuarios,id',
                'name' => 'required|string|max:255',
                'last_name' => 'required|string',
                'password' => 'nullable|string|min:8|confirmed',
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('usuarios')->ignore($request->id_user)
                ],
                'type' => 'required|string|in:administrador,empleado'
            ], [
                'id_user.exists' => 'Este usuario no existe',
                'id_user.required' => 'El id es requerido',
                'name.required' => 'El nuevo nombre es obligatorio',
                'last_name.required' => 'El nuevo apellido es obligatorio',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres',
                'password.confirmed' => 'Las contraseñas no coinciden',
                'email.required' => 'El nuevo correo electrónico es obligatorio',
                'email.email' => 'El formato del correo electrónico es inválido',
                'email.unique' => 'Este correo electrónico ya está en uso',
                'type.required' => 'El tipo de usuario es obligatorio',
                'type.in' => 'El tipo de usuario no es válido'
            ]);

            $user = Users::findOrFail($request->id_user);

            $updateData = [
                'name' => $request->name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'type' => $request->type
            ];

            if ($request->filled('password')) {
                $updateData['password'] = bcrypt($request->password);
            }

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado con éxito',
                'data' => $user->fresh()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    public function delete_user(Request $request)
    {
        try {
            $request->validate([
                'id_user' => 'required|integer|exists:usuarios,id'
            ], [
                'id_user.required' => 'El id del usuario a eliminar es obligatoria',
                'id_user.integer' => 'El id debe ser un entero',
                'id_user.exists' => 'Este usuario no existe'
            ]);
            $user_deleted = Users::where('id', '=', $request->id_user)->delete();
            return response()->json([
                'success' => true,
                'message' => 'usuario eliminado con exito',
                'data' => $user_deleted
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login_user(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ], [
                'email.required' => 'El campo email es obligatorio',
                'email.email' => 'El campo email debe ser una dirección de correo electrónico válida',
                'password.required' => 'La contraseña es obligatoria'
            ]);

            $user = Users::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Credenciales inválidas'], 401);
            }

            return response()->json([
                'message' => 'Inicio de sesión exitoso',
                'usuario' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al iniciar sesión: ' . $e->getMessage()], 500);
        }
    }
}
