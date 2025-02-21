"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  CheckCircleIcon,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  Store,
  User,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { register } from "@/actions/auth";
import { AuthError } from "next-auth";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/actions/uploadthing";

function FormRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<"password" | "text">(
    "password"
  );
  const [userType, setUserType] = useState<"client" | "company" | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    companyName: "",
    nit: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateField = (field: string, value: string) => {
    let error = "";
    switch (field) {
      case "email":
        if (!validateEmail(value)) {
          error = "Ingrese un correo electrónico válido";
        }
        break;
      case "password":
        if (!validatePassword(value)) {
          error = "La contraseña debe tener al menos 8 caracteres";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Las contraseñas no coinciden";
        }
        break;
      case "name":
        if (value.length < 3) {
          error = "El nombre debe tener al menos 3 caracteres";
        }
        break;
      case "companyName":
        if (value.length < 3) {
          error = "El nombre de la empresa debe tener al menos 3 caracteres";
        }
        break;
      case "nit":
        if (!validateNit(value)) {
          error = "El NIT debe tener exactamente 10 dígitos numéricos";
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const nextStep = () => {
    if (step < (userType === "company" ? 4 : 3)) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleInputChangenit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      const limitedValue = inputValue.slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        nit: limitedValue,
      }));
      validateField("nit", limitedValue);
      if (!isDirty) setIsDirty(true);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // Tamaño máximo de la imagen 4MB
      if (file.size > maxSizeInBytes) {
        setProfileImage("");
        toast.error(
          "La imagen seleccionada excede el tamaño máximo permitido de 4MB."
        );
        return;
      }

      setImageFile(file);

      const src = URL.createObjectURL(file);
      setProfileImage(src);
    }
  };

  const handleUserTypeChange = (value: "client" | "company") => {
    setUserType(value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulario enviado"); // Agregamos este log para verificar que la función se está ejecutando

    let isValid = true;
    const fieldsToValidate =
      userType === "client"
        ? ["name", "email", "password", "confirmPassword"]
        : [
            "companyName",
            "nit",
            "name",
            "email",
            "password",
            "confirmPassword",
          ];

    fieldsToValidate.forEach((field) => {
      if (!validateField(field, formData[field as keyof typeof formData])) {
        isValid = false;
      }
    });

    if (isValid) {
      try {
        const values = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          companyName: formData.companyName,
          nit: formData.nit,
          typeUser: userType!, // proporciona un valor predeterminado si userType es null
        };

        if (imageFile) {
          const formData = new FormData();
          formData.append("file", imageFile);
          const response = await uploadFile(formData);
          if (response?.success && response.fileUrl) {
            await register(values, response.fileUrl);
          } else {
            throw new Error("Failed to upload image");
          }
        }

        formData.email = "";
        formData.password = "";
        formData.confirmPassword = "";
        formData.name = "";
        formData.companyName = "";
        formData.nit = "";

        setIsDirty(false);

        toast.success(
          "Código de verificación enviado a su correo electrónico.",
          {
            description: "Compruebe su bandeja de entrada o de spam.",

            duration: 5000, // 5 segundos

            icon: <CheckCircleIcon />, // Agrega un icono de verificación
          }
        );
        router.push("/auth/email-verified");
      } catch (error) {
        toast.error("Error en el proceso de registro");

        if (error instanceof AuthError) {
          switch (error.type) {
            case "CredentialsSignin":
              return { error: "Credenciales inválidas!" };
            default:
              return { error: "Algo salió mal en el proceso!" };
          }
        }

        return { error: `Error inesperado: ${error}` }; // Agrega detalles del error
      }

      // Aquí puedes realizar la lógica para enviar los datos del formulario
    } else {
      toast.error("El formulario contiene errores");
    }
  };

  const maxSteps = userType === "company" ? 4 : 3;

  const renderFormFields = () => {
    switch (step) {
      case 1:
        return (
          <RadioGroup
            value={userType || ""}
            onValueChange={(value) =>
              handleUserTypeChange(value as "client" | "company")
            }
            className="space-y-4"
          >
            <div className="flex items-start p-4 rounded-lg glass-effect cursor-pointer hover:bg-dark/20 transition-all duration-300">
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
                <p className="text-xs text-gray-400 mt-1">
                  Regístrate como cliente para reservar servicios de barbería en
                  nuestras sucursales.
                </p>
              </label>
            </div>

            <div className="flex items-start p-4 rounded-lg glass-effect cursor-pointer hover:bg-dark/20 transition-all duration-300">
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
                <p className="text-xs text-gray-400 mt-1">
                  Registra tu barbería para gestionar citas, servicios y
                  personal.
                </p>
              </label>
            </div>
          </RadioGroup>
        );
      case 2:
        if (userType === "company") {
          return (
            <>
              <div className="relative">
                <Store className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Nombre de la Barbería/Empresa"
                  value={formData.companyName}
                  autoComplete="off"
                  onChange={handleInputChange}
                  className={`w-full glass-input pl-12 pr-12 py-3 rounded-lg ${
                    errors.companyName ? "border-red-500" : ""
                  }`}
                />
                {errors.companyName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.companyName}
                  </p>
                )}
              </div>
              <div className="relative">
                <FileText className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="nit"
                  placeholder="NIT de la Empresa (10 dígitos)"
                  value={formData.nit}
                  onChange={handleInputChangenit}
                  autoComplete="off"
                  maxLength={10}
                  inputMode="numeric"
                  className={`w-full glass-input pl-12 pr-12 py-3 rounded-lg ${
                    isDirty && formData.nit
                      ? isValid
                        ? "border-green-500/50 shadow-green-500/20"
                        : "border-red-500/50 shadow-red-500/20"
                      : ""
                  }`}
                />
                {isDirty && formData.nit && (
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
            </>
          );
        } else {
          return renderPersonalInfo();
        }
      case 3:
        if (userType === "company") {
          return renderPersonalInfo();
        } else {
          return renderAccountInfo();
        }
      case 4:
        return renderAccountInfo();
      default:
        return null;
    }
  };

  const renderPersonalInfo = () => (
    <div className="relative">
      <User className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        name="name"
        placeholder="Nombre completo"
        value={formData.name}
        autoComplete="off"
        onChange={handleInputChange}
        className={`w-full glass-input pl-12 pr-12 py-3 rounded-lg ${
          errors.name ? "border-red-500" : ""
        }`}
      />
      {errors.name && (
        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
      )}
    </div>
  );

  const renderAccountInfo = () => (
    <>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          autoComplete="off"
          onChange={handleInputChange}
          className={`w-full glass-input pl-12 pr-12 py-3 rounded-lg ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="relative">
        <Lock
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${
            errors.confirmPassword && "top-6"
          }`}
        />
        <input
          type={passwordVisible}
          name="password"
          placeholder="Contraseña"
          autoComplete="off"
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full glass-input pl-12 pr-12 py-3 rounded-lg ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        <Button
          type="button"
          className={`absolute transform -translate-y-1/2 opacity-80 right-3 top-1/2 ${
            errors.confirmPassword && "top-6"
          }`}
          onClick={() =>
            setPasswordVisible(
              passwordVisible === "password" ? "text" : "password"
            )
          }
        >
          {passwordVisible === "text" ? (
            <EyeOff className="w-5 h-5 text-gray-800" />
          ) : (
            <Eye className="w-5 h-5 text-gray-800" />
          )}
        </Button>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <div className="relative">
        <Lock
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${
            errors.confirmPassword && "top-6"
          }`}
        />
        <input
          type={passwordVisible}
          name="confirmPassword"
          placeholder="Repetir Contraseña"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className={`w-full glass-input pl-12 pr-12 py-3 rounded-lg ${
            errors.confirmPassword ? "border-red-500" : ""
          }`}
        />
        <Button
          type="button"
          className={`absolute transform -translate-y-1/2 opacity-80 right-3 top-1/2 ${
            errors.confirmPassword && "top-6"
          }`}
          onClick={() =>
            setPasswordVisible(
              passwordVisible === "password" ? "text" : "password"
            )
          }
        >
          {passwordVisible === "text" ? (
            <EyeOff className="w-5 h-5 text-gray-800" />
          ) : (
            <Eye className="w-5 h-5 text-gray-800" />
          )}
        </Button>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
        )}
      </div>
    </>
  );

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">{`Paso ${step} de ${maxSteps}`}</h1>
        <p className="text-gray-400">
          {step === 1
            ? "Selecciona el tipo de cuenta"
            : step === 2 && userType === "company"
            ? "Información de la empresa"
            : step === 2
            ? "Comienza con tus datos básicos"
            : step === 3 && userType === "company"
            ? "Comienza con tus datos básicos"
            : step === 4
            ? "Configura tu seguridad"
            : "Configura tu seguridad"}
        </p>
      </div>
      {((step === 2 && userType === "client") ||
        (step === 3 && userType === "company")) && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 flex flex-col items-center"
        >
          <div className="relative w-32 h-32 mb-4">
            <div
              className={`w-32 h-32 rounded-full overflow-hidden border-2 border-primary/50 flex items-center justify-center ${
                profileImage ? "" : "bg-dark/30"
              }`}
            >
              {profileImage ? (
                <Image
                  width={100}
                  height={100}
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-light hover:shadow-neon transition-all duration-300"
            >
              <Camera className="w-5 h-5 text-dark" />
            </label>
            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </motion.div>
      )}
      <form className="space-y-4 flex-1" onSubmit={handleFormSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {renderFormFields()}
          </motion.div>
        </AnimatePresence>

        {((step === 3 && userType === "client") ||
          (step === 4 && userType === "company")) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Button
              type="submit"
              className="w-full font-bold neon-button rounded-lg py-5 flex items-center justify-center gap-2"
            >
              Crear Cuenta
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
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
        {((step < 3 && userType === "client") ||
          (step < 4 && userType === "company")) && (
          <Button
            type="button"
            onClick={nextStep}
            disabled={
              (step === 1 && !userType) ||
              (step === 2 &&
                userType === "company" &&
                (!formData.companyName || !formData.nit || !isValid)) ||
              (step === 2 && userType === "client" && !formData.name) ||
              (step === 3 && userType === "company" && !formData.name)
            }
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

export default FormRegister;
