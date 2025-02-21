"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";

function page() {
  return (
    <div>
      <Button onClick={() => signOut()}>Salir</Button>
    </div>
  );
}

export default page;
