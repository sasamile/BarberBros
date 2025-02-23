"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/common/logo";
import Image from "next/image";

function InitialAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-radial from-dark to-black/20 font-montserrat flex items-center justify-center p-4 relative overflow-hidden">
      {/**Ilustracion 1 */}
      <motion.div
  className="absolute -left-5 bottom-20 max-md:hidden z-10"
  initial={{ opacity: 0, x: -100 }}
  animate={{ 
    opacity: 1,
    x: 0,
    y: [0, -8, 0],
    rotate: [0, 3, 0],
    scale: [0.95, 1.02, 0.95]
  }}
  transition={{
    duration: 2,
    y: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 2.5,
      ease: "easeInOut"
    },
    rotate: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 3,
      ease: "easeInOut"
    },
    scale: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 4,
      ease: "easeInOut"
    }
  }}
>
  <Image
    src={"/img/barber2.png"}
    alt="Logo"
    width={250}
    height={100}
    className="drop-shadow-md"
  />
</motion.div>

      <motion.div
        className="absolute right-10 lg:right-0 top-56 max-md:hidden z-10"
        initial={{ opacity: 0, x: 80, scale: 0.7 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -15, 0],
          scale: [0.7, 1],
          rotate: [-50, -45, -48],
        }}
        transition={{
          duration: 1.5,
          y: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
            ease: "easeInOut",
          },
        }}
    
      >
        <Image
          src={"/img/barber3.png"}
          alt="Logo"
          width={200}
          height={100}
          className="filter drop-shadow-xl"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl h-[570px] flex rounded-2xl overflow-hidden shadow-2xl relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-auth-pattern bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-dark/90 to-dark-blue/50 backdrop-blur-sm" />
        </div>

        {/* Content Container */}
        <div className="relative w-full flex">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Logo />
              <h2 className="text-4xl font-bold mb-4"></h2>
              <p className="text-gray-300 text-lg">
                Donde el estilo encuentra la excelencia
              </p>
            </motion.div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 p-8">
            <div className="w-full h-full glass-effect rounded-xl p-8 shadow-glass">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`form`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default InitialAuthLayout;
