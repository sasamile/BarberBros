import { getUserById, getUserByIdWithCompany } from "@/actions/user";
import Autocomplete from "@/components/auth/complete-form";
import InitialAuthLayout from "@/components/auth/Initial-auth-layout";
import { currentUser } from "@/lib/auth-user";
import type React from "react";

async function Layout({ children }: { children: React.ReactNode }) {
  const loggedUser = await currentUser();
  const existingUser = await getUserByIdWithCompany(loggedUser?.id);

  // Lógica corregida: Mostrar el formulario solo si:
  // 1. El usuario existe
  // 2. El tipo de usuario es "company"
  // 3. No tiene compañía asociada o faltan datos de la compañía
  const needsToCompleteProfile =
    existingUser &&
    (!existingUser.typeUser || // Usuario nuevo de Google
      (existingUser.typeUser === "company" &&
        (!existingUser.CompanyInfo ||
          !existingUser.CompanyInfo.nit ||
          !existingUser.CompanyInfo.companyName)));
  return (
    <div>
      {needsToCompleteProfile && (
        <InitialAuthLayout>
          <Autocomplete />
        </InitialAuthLayout>
      )}

      {children}
    </div>
  );
}

export default Layout;
