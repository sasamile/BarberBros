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
  if (!id) {
    return null;
  }

  try {
    const userFound = await db.user.findUnique({
      where: {
        id,
      },
      include: {
        Company: {
          select: {
            nit: true,
            companyName: true,
          },
        },
      },
    });

    // Transformar el resultado para que sea más fácil de usar
    return {
      ...userFound,
      // Si hay compañías, toma la primera (asumiendo que solo debería haber una)
      CompanyInfo: userFound?.Company && userFound.Company.length > 0 
        ? userFound.Company[0] 
        : null
    };
  } catch {
    return null;
  }
};