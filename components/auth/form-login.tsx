"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { LoginFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { GoogleLogin } from "../common/google-login";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/actions/auth";
import { toast } from "sonner";

function FormLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passwordVisible, setPasswordVisible] = useState<"password" | "text">(
    "password"
  );

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "El correo ya está en uso con otra cuenta!"
      : "";

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    try {
      const response = await login(data);

      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Bienvenido de nuevo!", {
          duration: 4000,
        });
        router.push("/dashboard");
        router.refresh();
      }

      if (!response?.error) {
        form.reset();
      }
    } catch {
      console.log("Ocurrió un problema con tu solicitud.");
    }
  };

  return (
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold text-white mb-2">
        Bienvenido de nuevo
      </h1>
      <p className="text-gray-400">Inicia sesión con tus credenciales</p>

      <Form {...form}>
        <form
          className="flex justify-center flex-col gap-6 py-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative"
                  >
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      autoComplete="off"
                      placeholder="Correo electrónico"
                      {...field}
                      className="w-full glass-input pl-12 pr-12 py-3 rounded-lg "
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative"
                  >
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={passwordVisible}
                      placeholder="Contraseña"
                      {...field}
                      className="w-full glass-input pl-12 pr-12 py-3 rounded-lg"
                    />
                    <Button
                      type="button"
                      className="absolute transform -translate-y-1/2 opacity-80 right-3 top-1/2 "
                      onClick={() => {
                        setPasswordVisible(
                          passwordVisible === "password" ? "text" : "password"
                        );
                      }}
                    >
                      {passwordVisible === "text" ? (
                        <EyeOff className="w-5 h-5 text-gray-800" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-800" />
                      )}
                    </Button>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full neon-button rounded-lg py-5 font-semibold"
          >
            Iniciar Sesión
          </Button>
        </form>
      </Form>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center w-full">
          <div className="">
            <div className="w-[130px] border-t border border-gray-600" />
          </div>
          <div className=" flex justify-center text-sm">
            <span className="px-2 text-gray-400">O continúa con</span>
          </div>
          <div className="">
            <div className="w-[130px] border-b border border-gray-600" />
          </div>
        </div>

        <div className="mt-6 w-full">
          <GoogleLogin />
        </div>
      </motion.div>
    </div>
  );
}

export default FormLogin;
