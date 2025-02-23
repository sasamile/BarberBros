"use client";
import React, { useEffect } from "react";

const AccountReviewModal = () => {
  useEffect(() => {
    // Bloquear el scroll del body cuando el modal está abierto
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restaurar el scroll al cerrar el modal
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm z-50 h-screen">
      <div className="w-11/12 max-w-[30%] rounded-xl shadow-xl overflow-hidden shadow-glass glass-effect">
        {/* Header */}
        <div className="p-5 text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-8 h-8 text-gray-900"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">
            Cuenta en revisión
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Alert box */}
          <div className="flex items-start gap-3 bg-yellow-400 bg-opacity-10 border-l-4 border-yellow-400 p-4 rounded mb-6">
            <span className="text-yellow-400 text-xl">i</span>
            <p className="text-gray-300 text-sm">
              Su cuenta como Barbería está pendiente de revisión hasta que un
              administrador valide los datos enviados anteriormente.
            </p>
          </div>

          {/* Info grid */}
          <div className="space-y-5">
            <div className="border-b border-gray-700 pb-4">
              <div className="text-gray-400 text-sm mb-2">Estado</div>
              <div className="text-yellow-400 font-medium">
                Pendiente de validación
              </div>
            </div>

            <div className="pb-4">
              <div className="text-gray-400 text-sm mb-2">Tiempo estimado</div>
              <div className="text-yellow-400 font-medium">
                12-24 horas hábiles
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountReviewModal;
