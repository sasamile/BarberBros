"use client";
import React, { Suspense, useState } from "react";
import { motion } from "framer-motion";
import FormLogin from "@/components/auth/form-login";
import FormRegister from "@/components/auth/form-resgister";

function page() {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {isLoggingIn ? <FormLogin /> : <FormRegister />}</Suspense>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-center text-gray-400"
      >
        {isLoggingIn ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
        <button
          onClick={() => {
            setIsLoggingIn(!isLoggingIn);
          }}
          className="ml-1 text-primary hover:text-primary-light transition-colors"
        >
          {isLoggingIn ? "Regístrate" : "Inicia sesión"}
        </button>
      </motion.p>
    </div>
  );
}

export default page;
