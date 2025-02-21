import InitialAuthLayout from "@/components/auth/Initial-auth-layout";
import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <InitialAuthLayout>{children}</InitialAuthLayout>
    </div>
  );
}

export default AuthLayout;
