import { object, z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor ingresa un correo válido" })
    .trim(),
  password: z
    .string()
    .min(1, {
      message: "La contraseña debe contener al menos un carácter",
    })
    .trim(),
});

export const RegisterFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor ingresa un correo válido" })
    .trim(),
  password: z
    .string()
    .min(1, {
      message: "La contraseña debe contener al menos un carácter",
    })
    .trim(),
  name: z.string().min(1, { message: "El nombre es requerido" }).trim(),
  companyName: z.string().optional(),
  nit: z.string().optional(),
  typeUser: z.string()
  

});

export const CompleteRegisterFormSchema = z.object({
  typeUser: z.string(),
  companyName: z.string(),
  nit: z.string(),
  

})

export const otpSchema = z.object({
  otp: z.string().length(6, 'El código OTP debe tener 6 dígitos'),
})