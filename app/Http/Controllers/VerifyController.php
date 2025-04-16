<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use Illuminate\Http\Request;

class VerifyController extends Controller
{
    public function verify($token)
    {
        try {
            $customer = Customers::where('token_verification', $token)->first();

            if (!$customer) {
                return response()->json(['message' => 'Token de verificación inválido o ya utilizado'], 400);
            }

            if (!$customer->isVerificationTokenValid()) {
                return response()->json(['message' => 'El enlace de verificación ha expirado'], 400);
            }

            $customer->update([
                'verify' => true,
                'token_verification' => null,
                'status' => true
            ]);

            return response()->json(['message' => 'Cuenta verificada con éxito, ya puedes iniciar sesión'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al verificar la cuenta: ' . $e->getMessage()], 500);
        }
    }
}
