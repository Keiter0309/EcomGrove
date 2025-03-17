import React, { useState } from "react";
import { CircleCheck, CircleX, CircleAlert, X } from "lucide-react";
import { modal } from "../../interfaces";

const Modal: React.FC<modal> = ({
  name,
  input = false,
  confirmButton = true,
  cancelButton = true,
  status = "none",
  placeHolder = "Enter value...",
  onConfirm,
  onCancel,
  isOpen,
  confirmText = "Confirm",
  cancelText = "Cancel",
  description,
}) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const getStatusIcon = () => {
    if (status === "success")
      return <CircleCheck className="text-green-500 h-8 w-8" />;
    if (status === "error") return <CircleX className="text-red-500 h-8 w-8" />;
    if (status === "warning")
      return <CircleAlert className="text-amber-400 h-8 w-8" />;
    if (status === "info")
      return <CircleAlert className="text-blue-500 h-8 w-8" />;
    return null;
  };

  const getStatusBackground = () => {
    if (status === "success") return "bg-green-50";
    if (status === "error") return "bg-red-50";
    if (status === "warning") return "bg-amber-50";
    if (status === "info") return "bg-blue-50";
    return "bg-white";
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(inputValue);
    }
    setInputValue("");
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setInputValue("");
  };

  return (
    <>
      {/* Background overlay with animation */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200"></div>

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`${getStatusBackground()} rounded-lg shadow-xl border border-gray-200 w-full max-w-md transform transition-all duration-300 scale-100`}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <h1 className="text-xl font-semibold text-gray-900">{name}</h1>
            </div>
            {cancelButton && (
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {description && <p className="text-gray-600 mb-4">{description}</p>}
            {input && (
              <input
                type="text"
                name="otp"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder={placeHolder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}
          </div>

          {/* Modal Footer (Buttons) */}
          {(confirmButton || cancelButton) && (
            <div className="flex justify-end p-4 gap-3 border-t">
              {cancelButton && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
                >
                  {cancelText}
                </button>
              )}
              {confirmButton && (
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 ${
                    status === "error"
                      ? "bg-red-500 hover:bg-red-600"
                      : status === "warning"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                    status === "error"
                      ? "focus:ring-red-500"
                      : status === "warning"
                      ? "focus:ring-amber-500"
                      : "focus:ring-blue-500"
                  }`}
                >
                  {confirmText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
