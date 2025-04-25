<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Users;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Crypt;

class ChangePasswordController extends Controller
{
    public function sendCode(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ], [
                'email.required' => 'El correo es obligatorio',
                'email.email' => 'El corre no es válido'
            ]);

            $user = Users::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no encontrado'
                ], 500);
            }

            $token  = random_int(100000, 999999);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                ['token' => $token, 'created_at' => now()]
            );

            Mail::raw("Estimado usuario {$user->name}, tu código para cambio de contraseña es: " . $token, function ($message) use ($user) {
                $message->to($user->email);
                $message->subject('Código de restablecimiento de contraseña');
            });

            return response()->json(['message' => 'Se ha enviado un código de restablecimiento de contraseña a tu correo electrónico'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al enviar el enlace de restablecimiento: ' . $e->getMessage()], 500);
        }
    }

    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:8|confirmed',
                'token' => 'required'
            ], [
                'email.required' => 'El campo correo electrónico es obligatorio.',
                'email.email' => 'El formato del correo electrónico no es válido.',
                'password.required' => 'El campo contraseña es obligatorio.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
                'password.confirmed' => 'Las contraseñas no coinciden.',
                'token.required' => 'El campo token es obligatorio.'
            ]);

            $reset = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->where('token', $request->token)
                ->first();

            // Buscar usuario y actualizar la contraseña
            $usuario = Users::where('email', $request->email)->first();
            if (!$usuario) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            if (!$reset) {
                return response()->json(['message' => 'Token inválido o expirado'], 400);
            }

            $usuario->password = Crypt::encryptString($request->password);
            $usuario->save();

            // Eliminar el token usado
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            return response()->json(['message' => 'Contraseña restablecida con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al restablecer la contraseña: ' . $e->getMessage()], 500);
        }
    }
}
