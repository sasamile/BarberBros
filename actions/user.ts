"use server";

import db from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
}

export const getUserById = async (id?: string) => {
  if (!id) {
    return null;
  }

  try {
    const userFound = await db.user.findUnique({
      where: {
        id,
      },
    });

    return userFound;
  } catch {
    return null;
  }
};

export const getUserByIdWithCompany = async (id?: string) => {
  if (!id) return null;

  try {
    const userFound = await db.user.findUnique({
      where: { id },
      include: { Company: true },
    });

    return {
      ...userFound,
      CompanyInfo: userFound?.Company ?? null, // Asegurar que siempre se asigne correctamente
    };
  } catch (error) {
    console.error("Error fetching user with company:", error);
    return null;
  }
};
