<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use App\Models\SalesDetail;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function list_customer()
    {
        try {
            $customers = Customers::orderBy('created_at', 'desc')->get();
            if ($customers->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ], 200);
            } else {
                $userData = $customers->map(function ($customer) {

                    $decrypted = Crypt::decryptString($customer->password);

                    return [
                        'id' => $customer->id,
                        'name' => $customer->name,
                        'last_name' => $customer->last_name,
                        'email' => $customer->email,
                        'password' => $decrypted,
                        'address' => $customer->address,
                        'phone_number' => $customer->phone_number,
                        'type' => $customer->type,
                        'verify' => $customer->verify,
                        'token_verification' => $customer->token_verification,
                        'status' => $customer->status,
                        'created_at' => $customer->created_at,
                        'updated_at' => $customer->updated_at
                    ];
                });

                return response()->json([
                    'success' => true,
                    'data' => $userData
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los clientes: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update_customer(Request $request)
    {
        try {
            $request->validate([
                'id_customer' => 'required|exists:clientes,id',
                'name' => 'required|string',
                'last_name' => 'required|string',
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('clientes')->ignore($request->id_customer)
                ],
                'password' => 'nullable|string|min:8|confirmed',
                'address' => 'required|string',
                'phone_number' => 'required|regex:/^\d{4}-\d{4}$/'
            ], [
                'id_customer.exists' => 'Este cliente no existe',
                'id_customer.required' => 'El id es requerido',
                'name.required' => 'El nuevo nombre es obligatorio',
                'last_name.required' => 'El nuevo apellido es obligatorio',
                'email.required' => 'El correo electrónico es obligatorio',
                'email.email' => 'El formato del correo electrónico es inválido',
                'email.unique' => 'Este correo electrónico ya está en uso',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres',
                'password.confirmed' => 'Las contraseñas no coinciden',
                'address.required' => 'La dirección es obligatoria',
                'phone_number.required' => 'El número de telefónico es obligatorio',
                'phone_number.regex' => 'El número telefónico debe tener el formato: ####-####'
            ]);

            $customer = Customers::findOrFail($request->id_customer);

            $updateData = [
                'name' => $request->name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'address' => $request->address,
                'phone_number' => $request->phone_number
            ];

            if ($request->filled('password')) {
                $encrypted = Crypt::encryptString($request->password);
                $updateData['password'] = $encrypted;
            }

            $customer->update($updateData);

            return response()->json([
                'message' => 'Cliente actualizado con exito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function disable_customer(Request $request)
    {
        try {
            $request->validate([
                'id_customer' => 'required|exists:clientes,id'
            ], [
                'id_customer.exists' => 'Este cliente no existe',
                'id_customer.required' => 'El id es requerido'
            ]);

            $customer = Customers::findOrFail($request->id_customer);

            $updateData = [
                'status' => 'inhabilitado'
            ];

            $customer->update($updateData);

            return response()->json([
                'message' => 'Cliente inhabilitado con exito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al inhabilitar al cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function enable_customer(Request $request)
    {
        try {
            $request->validate([
                'id_customer' => 'required|exists:clientes,id'
            ], [
                'id_customer.exists' => 'Este cliente no existe',
                'id_customer.required' => 'El id es requerido'
            ]);

            $customer = Customers::findOrFail($request->id_customer);

            $updateData = [
                'status' => 'habilitado'
            ];

            $customer->update($updateData);

            return response()->json([
                'message' => 'Cliente habilitado con exito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al habilitar al cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function register_customer(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:clientes',
                'password' => 'required|string|min:8|confirmed',
                'address' => 'required|string',
                'phone_number' => 'required|regex:/^\d{4}-\d{4}$/'
            ], [
                'name.required' => 'El nombre es obligatorio',
                'last_name.required' => 'El apellido es obligatorio',
                'email.required' => 'El correo electrónico es obligatorio',
                'email.email' => 'El formato del correo electrónico es inválido',
                'email.unique' => 'Este correo electrónico ya está en uso',
                'password.required' => 'La contraseña es obligatoria',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres',
                'password.confirmed' => 'Las contraseñas no coinciden',
                'address.required' => 'La dirección es obligatoria',
                'phone_number.required' => 'El número de telefónico es obligatorio',
                'phone_number.regex' => 'El número telefónico debe tener el formato: ####-####'
            ]);

            $encrypted = Crypt::encryptString($request->password);

            $token = Str::random(40);

            $customer = Customers::create([
                'name' => $request->name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => $encrypted,
                'address' => $request->address,
                'phone_number' => $request->phone_number,
                'token_verification' => $token,
            ]);
            Mail::raw("Estimado cliente {$customer->name}, verifica tu cuenta haciendo click en el siguiente enlace: " . url('/api/verify/' . $token), function ($message) use ($customer) {
                $message->to($customer->email);
                $message->subject('TextilExport | Verifica tu cuenta');
            });

            return response()->json(['message' => 'Registro exitoso, verifica tu correo electrónico para activar tu cuenta'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al registrar el usuario: ' . $e->getMessage()], 500);
        }
    }

    public function login_customer(Request $request)
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

            if (!$customer) {
                return response()->json([
                    'message' => 'Este correo no esta registrado'
                ], 401);
            }

            $descrypted = Crypt::decryptString($customer->password);

            if (!$customer || $descrypted !== $request->password) {
                return response()->json(['message' => 'Credenciales inválidas'], 401);
            }

            if ($customer->verify === 'no verificado') {
                return response()->json([
                    'message' => 'Por favor verifica tu cuenta antes de iniciar sesión'
                ], 403);
            } else if ($customer->status !== 'habilitado') {
                return response()->json([
                    'message' => 'Tu cuenta ha sido inhabilitada, por favor contacta al administrado de la empresa'
                ], 403);
            }

            $token = $customer->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Inicio de sesión exitoso',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'usuario' => $customer
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al iniciar sesión: ' . $e->getMessage()], 500);
        }
    }

    public function sales_customer(Request $request)
    {
        try {
            $request->validate([
                'id_customer' => 'required'
            ], [
                'id_customer.required' => 'El id del cliente es requerido'
            ]);

            $customerSale = SalesDetail::where('id_customer', $request->id_customer)->with(['product'])->get();
            if ($customerSale->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'data' => []
                ], 404);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => $customerSale
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener las ventas: ' . $e->getMessage()], 500);
        }
    }

    public function SendCode(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ], [
                'email.required' => 'El correo es obligatorio',
                'email.email' => 'El corre no es válido'
            ]);

            $customer = Customers::where('email', $request->email)->first();

            if (!$customer) {
                return response()->json([
                    'message' => 'Cliente no encontrado'
                ], 500);
            }

            $token  = random_int(100000, 999999);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                ['token' => $token, 'created_at' => now()]
            );

            Mail::raw("Estimado cliente {$customer->name}, tu código para cambio de contraseña es: " . $token, function ($message) use ($customer) {
                $message->to($customer->email);
                $message->subject('Código de restablecimiento de contraseña');
            });

            return response()->json(['message' => 'Se ha enviado un código de restablecimiento de contraseña a tu correo electrónico'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al enviar el enlace de restablecimiento: ' . $e->getMessage()], 500);
        }
    }

    public function ChangePassword(Request $request)
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
            $customer = Customers::where('email', $request->email)->first();
            if (!$customer) {
                return response()->json(['message' => 'Cliente no encontrado'], 404);
            }

            if (!$reset) {
                return response()->json(['message' => 'Token inválido o expirado'], 400);
            }

            $customer->password = Crypt::encryptString($request->password);
            $customer->save();

            // Eliminar el token usado
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            return response()->json(['message' => 'Contraseña restablecida con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al restablecer la contraseña: ' . $e->getMessage()], 500);
        }
    }
}
