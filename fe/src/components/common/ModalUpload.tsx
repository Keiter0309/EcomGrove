import { useState, useRef } from "react";
import { CloudUpload, X } from "lucide-react";
import { userService } from "../../services/userService";
import toast from "react-hot-toast";
import Loading from "./Loading";

interface ModalUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalUpload: React.FC<ModalUploadProps> = ({
  isOpen,
  onClose,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    const headers = { "Content-Type": "multipart/form-data" };
    if (!selectedFile) {
      toast.error("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("imagePath", selectedFile);

    setIsLoading(true);
    try {
      const response = await userService.uploadAvatar(formData, headers);
      if (response.status === 201) {
        toast.success(response.data.message);
        onClose();
        setIsLoading(false);
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed!");
    }
  };

  const handleCancel = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleCancel}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
        <div className="rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 w-full max-w-md transform transition-all duration-300 bg-white dark:bg-gray-900 p-6 relative min-h-[28rem]">
          {/* Image Preview */}
          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-[20rem] object-cover rounded-lg shadow-md"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                onClick={() => {
                  setPreviewImage(null);
                  setSelectedFile(null);
                }}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            // Upload Area
            <div
              className="border-2 border-dashed border-gray-400 dark:border-gray-500 p-8 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition flex flex-col items-center justify-center min-h-[20rem]"
              tabIndex={0}
              onClick={handleClick}
            >
              <CloudUpload className="h-14 w-14 text-gray-500 dark:text-gray-300" />
              <span className="text-center text-gray-600 dark:text-gray-400 mt-2">
                Drag & drop your image or click to select
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple={false}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-10">
            <button
              className="py-2 px-4 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className={`py-2 px-4 rounded-md text-white ${
                selectedFile
                  ? "bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              } transition-all duration-200`}
              disabled={!selectedFile}
              onClick={handleSubmit}
            >
              Save Change
            </button>
          </div>
        </div>
      </div>
      {/* {isLoading && <Loading />} */}
      <Loading isVisible={isLoading} />
    </>
  );
};
