"use server";

import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";

import db from "@/lib/db";
import { getUserByEmail, getUserById } from "@/actions/user";

import { currentUser } from "@/lib/auth-user";
import {
  CompleteRegisterFormSchema,
  LoginFormSchema,
  otpSchema,
  RegisterFormSchema,
} from "@/schemas";
import { get } from "http";
import { SendEmail } from "@/lib/brevo";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export async function login(credentials: z.infer<typeof LoginFormSchema>) {
  const result = LoginFormSchema.safeParse(credentials);

  if (result.error) {
    return { error: "Credenciales invalidas!" };
  }

  const { email, password } = result.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
  }
}

export async function register(
  credentials: z.infer<typeof RegisterFormSchema>,
  image: string
) {
  const result = RegisterFormSchema.safeParse(credentials);

  if (result.error) {
    return { error: "Datos invalidos!" };
  }

  const { email, name, password, typeUser, companyName, nit } = result.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "El correo ingresado ya esta en uso!" };
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        typeUser,
        role: typeUser === "client" ? "client" : "company",
        image,
      },
    });

    if (typeUser === "company") {
      await db.company.create({
        data: {
          companyName: companyName!,
          nit: Number(nit!),
          userId: user.id,
        },
      });
    }

    const otp = await generateAndSendOTP(email);
    await SendEmail(email, name, otp);

    return {
      success: true,
      message:
        "Registro exitoso. Verifique su correo electrónico para activar su cuenta.",
    };
  } catch (error) {
    return { error: "Algo salió mal en el proceso!" };
  }
}

export async function completeRegistration(
  credentials: z.infer<typeof CompleteRegisterFormSchema>
) {
  const loggedUser = await currentUser();
  const result = CompleteRegisterFormSchema.safeParse(credentials);

  if (result.error) {
    return { error: "Datos invalidos!" };
  }

  const { companyName, nit, typeUser } = result.data;

  try {
    const existingUser = await getUserById(loggedUser?.id!);

    if (!existingUser) {
      return { error: "El usuario no existe!" };
    }

    if (typeUser === "company") {
      if (!companyName || !nit) {
        return { error: "Los datos de la empresa son requeridos!" };
      }
    }

    await db.user.update({
      where: { id: loggedUser?.id },
      data: {
        typeUser,
        role: typeUser === "client" ? "client" : "company",
      },
    });

    if (typeUser === "company") {
      await db.company.create({
        data: {
          nit: Number(nit),
          companyName,
          userId: loggedUser?.id!,
        },
      });
    }

    return { success: true };
  } catch (error) {
    return { error: "Algo salio mal en el proceso." };
  }
}

// export async function logout() {
//   await signOut({ redirectTo: DEFAULT_AUTH_REDIRECT });
// }

export async function generateAndSendOTP(email: string) {
  const existingUser = await getUserByEmail(email);

  // Generar código OTP de 6 dígitos
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Establecer expiración en 15 minutos
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

  // Guardar OTP en el usuario
  await db.user.update({
    where: { id: existingUser?.id },
    data: {
      otpToken: otp,
      otpExpires,
    },
  });
  return otp;
}

export async function verifyOTP(values: z.infer<typeof otpSchema>) {
  const { otp } = values;

  const userOTP = await db.user.findFirst({
    where: {
      otpToken: otp,
    },
  });

  if (!userOTP) {
    return { error: "Código OTP inválido!" };
  }

  if (!userOTP.otpToken || !userOTP.otpExpires) {
    throw new Error("No hay código de verificación pendiente");
  }
  if (userOTP.otpExpires < new Date()) {
    if (userOTP.email) {
      // Generate a new OTP and update the database only if email is not null
      const newOTP = await generateAndSendOTP(userOTP.email);
      const newExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      await db.user.update({
        where: { id: userOTP.id },
        data: {
          otpToken: newOTP,
          otpExpires: newExpiration,
        },
      });
    }

    return {
      error:
        "El código OTP ha expirado. Se ha generado un nuevo código y se ha enviado a tu correo electrónico.",
    };
  }

  // El código OTP es válido y no ha expirado
  await db.user.update({
    where: { id: userOTP.id },
    data: {
      otpToken: null,
      otpExpires: null,
      emailVerified: new Date(),
    },
  });

  return { success: true };
}
