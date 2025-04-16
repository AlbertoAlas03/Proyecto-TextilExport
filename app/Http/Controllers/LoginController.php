<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;
use App\Models\Customers;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
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

            $customer = Customers::where('email', $request->email)->first();
            $user = Users::where('email', $request->email)->first();

            if ($customer) {
                if (!$customer || !Hash::check($request->password, $customer->password)) {
                    return response()->json(['message' => 'Credenciales inválidas'], 401);
                }

                if (!$customer->verify) {
                    return response()->json([
                        'message' => 'Por favor verifica tu cuenta antes de iniciar sesión'
                    ], 403);
                }

                $token = $customer->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'message' => 'Inicio de sesión exitoso',
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'usuario' => $customer
                ], 200);
            } else {
                if (!$user || !Hash::check($request->password, $user->password)) {
                    return response()->json(['message' => 'Credenciales inválidas'], 401);
                }

                return response()->json([
                    'message' => 'Inicio de sesión exitoso',
                    'usuario' => $user
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al iniciar sesión: ' . $e->getMessage()], 500);
        }
    }
}
