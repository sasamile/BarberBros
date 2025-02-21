"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  User,
  Store,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { completeRegistration } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Autocomplete() {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"client" | "company" | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    nit: "",
  });
  const [errors, setErrors] = useState({
    companyName: "",
    nit: "",
  });

  useEffect(() => {
    if (formData.nit) {
      setIsValid(validateNit(formData.nit));
    }
  }, [formData.nit]);

  const validateNit = (nitValue: string) => {
    const nitRegex = /^\d{10}$/;
    return nitRegex.test(nitValue);
  };

  const validateField = (field: string, value: string) => {
    let error = "";
    switch (field) {
      case "companyName":
        if (value.length < 3) {
          error = "El nombre de la empresa debe tener al menos 3 caracteres";
        }
        break;
      case "nit":
        if (!/^\d{10}$/.test(value)) {
          error = "El NIT debe tener exactamente 10 dígitos numéricos";
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleUserTypeChange = (value: "client" | "company") => {
    setUserType(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const nextStep = () => {
    if (step < 2 && userType === "company") setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userType) {
      toast.error("Por favor selecciona un tipo de usuario.");
      return;
    }

    let isValid = true;
    if (userType === "company") {
      Object.keys(formData).forEach((key) => {
        if (!validateField(key, formData[key as keyof typeof formData])) {
          isValid = false;
        }
      });
    }

    if (!isValid) {
      toast.error("Por favor corrige los errores en el formulario.");
      return;
    }

    const value = {
      ...formData,
      typeUser: userType,
    };

    try {
      await completeRegistration(value);
      router.refresh();
      toast.success("Registro completado con éxito.");
    } catch (error) {
      toast.error("Ocurrió un problema con tu solicitud.");
    }
  };

  const renderStep1 = () => (
    <RadioGroup
      value={userType || ""}
      onValueChange={(value) =>
        handleUserTypeChange(value as "client" | "company")
      }
      className="space-y-4 mb-6"
    >
      <div className="flex items-center p-4 rounded-lg glass-effect cursor-pointer hover:bg-dark/20 transition-all duration-300">
        <RadioGroupItem
          value="client"
          id="client-option"
          className="w-6 h-6 text-yellow-500 border-2 border-yellow-500"
        />
        <label
          htmlFor="client-option"
          className="ml-3 text-sm text-gray-300 cursor-pointer flex-1"
        >
          <span className="font-medium text-white flex items-center gap-2">
            <User className="w-5 h-5 text-yellow-500" />
            Cliente
          </span>
        </label>
      </div>

      <div className="flex items-center p-4 rounded-lg glass-effect cursor-pointer hover:bg-dark/20 transition-all duration-300">
        <RadioGroupItem
          value="company"
          id="company-option"
          className="w-6 h-6 text-yellow-500 border-2 border-yellow-500"
        />
        <label
          htmlFor="company-option"
          className="ml-3 text-sm text-gray-300 cursor-pointer flex-1"
        >
          <span className="font-medium text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-yellow-500" />
            Empresa / Barbería
          </span>
        </label>
      </div>
    </RadioGroup>
  );

  const renderStep2 = () => (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Store
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${
            errors.companyName && "top-6"
          }`}
        />
        <input
          type="text"
          name="companyName"
          placeholder="Nombre de la Barbería/Empresa"
          value={formData.companyName}
          autoComplete="off"
          onChange={handleInputChange}
          className={`w-full glass-input pl-12 pr-4 py-3 rounded-lg ${
            errors.companyName ? "border-red-500" : ""
          }`}
        />
        {errors.companyName && (
          <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
        )}
      </div>
      <div className="relative">
        <Store
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${
            errors.companyName && "top-5"
          }`}
        />
        <input
          type="text"
          name="nit"
          placeholder="NIT de la Empresa"
          value={formData.nit}
          onChange={handleInputChange}
          className={`w-full glass-input pl-12 pr-4 py-3 rounded-lg ${
            errors.nit ? "border-red-500" : ""
          }`}
        />
        {formData.nit && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 top-6 transform -translate-y-1/2"
          >
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </motion.div>
        )}
        {errors.nit && (
          <p className="text-xs text-red-500 mt-1">{errors.nit}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {step === 1 && renderStep1()}
            {step === 2 && userType === "company" && renderStep2()}
          </motion.div>
        </AnimatePresence>

        {((step === 1 && userType === "client") ||
          (step === 2 && userType === "company")) && (
          <Button
            type="submit"
            className="w-full font-bold neon-button rounded-lg py-5 flex items-center justify-center gap-2"
          >
            Completar Registro
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </form>

      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <Button
            type="button"
            onClick={prevStep}
            className="font-bold flex-1 py-5 rounded-lg glass-effect hover:bg-glass-dark transition-all duration-300"
          >
            Anterior
          </Button>
        )}
        {step === 1 && userType === "company" && (
          <Button
            type="button"
            onClick={nextStep}
            className="font-bold flex-1 neon-button rounded-lg py-5 flex items-center justify-center gap-2"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default Autocomplete;
