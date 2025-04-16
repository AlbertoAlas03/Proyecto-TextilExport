<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;

class CustomerController extends Controller
{
    public function list_customer()
    {
        try {
            $customers = Customers::orderBy('created_at', 'desc')->get();
            if ($customers->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => ['No hay clientes registrados']
                ], 200);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => $customers
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
                $updateData['password'] = bcrypt($request->password);
            }

            $customer->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Cliente actualizado con exito',
                'data' => $customer->fresh()
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
                'status' => false
            ];

            $customer->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Cliente inhabilitado con exito',
                'data' => $customer->fresh()
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
                'status' => true
            ];

            $customer->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Cliente habilitado con exito',
                'data' => $customer->fresh()
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

            $token = Str::random(40);

            $customer = Customers::create([
                'name' => $request->name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
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
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al iniciar sesión: ' . $e->getMessage()], 500);
        }
    }
}
