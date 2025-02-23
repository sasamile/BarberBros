import { getUserById, getUserByIdWithCompany } from "@/actions/user";
import Autocomplete from "@/components/auth/complete-form";
import InitialAuthLayout from "@/components/auth/Initial-auth-layout";
import AccountReviewModal from "@/components/common/account-review-modal ";
import DashLayout from "@/components/common/layout-dash";
import { currentUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";
import type React from "react";

async function Layout({ children }: { children: React.ReactNode }) {
  const loggedUser = await currentUser();
  const user = await getUserById(loggedUser?.id);
  const existingUser = await getUserByIdWithCompany(loggedUser?.id);

  const needsToCompleteProfile =
    existingUser &&
    (!existingUser.typeUser || // Usuario nuevo de Google
      (existingUser.typeUser === "company" &&
        (!existingUser.CompanyInfo ||
          !existingUser.CompanyInfo.nit ||
          !existingUser.CompanyInfo.companyName)));
  return (
    <div className="relative">
      {needsToCompleteProfile && (
        <InitialAuthLayout>
          <Autocomplete />
        </InitialAuthLayout>
      )}

      

      {!needsToCompleteProfile &&
        user?.role === "company" &&
        user?.isActive === false && <AccountReviewModal />}
      {!needsToCompleteProfile && (
        <div className="flex text-[#E0E0E0]">
          <div className="  w-full ">
            <DashLayout>{children}</DashLayout>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
