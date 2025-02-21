"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import Image from "next/image";

export function GoogleLogin() {
  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    })
  }
  return (
    <Button className="w-full bg-inherit flex items-center justify-center px-4 py-5 glass-effect rounded-lg hover:bg-glass-dark transition-all duration-300" onClick={() => onClick("google")}>
      <Image src="/img/google.svg" alt="google" width={30} height={50} />
      <span className="text-white font-semibold">Iniciar con Google</span>
    </Button>
  );
}
