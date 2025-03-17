import BackToHome from "../components/common/BackToHome";
import {
  IChangePassword,
  IUserUpdate,
  profile,
  profileInput,
} from "../interfaces";
import { userService } from "../services/userService";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../components/common/Modal";
import { useState } from "react";
import { ModalUpload } from "../components/common/ModalUpload";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileData } from "../hooks";

export default function Profile() {
  const { formData, updateFormData, handleChange, isGoogleLogin } =
    useProfileData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const { logout } = useAuthStore();
  const [password, setPassword] = useState<IChangePassword>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleModalUpload = () => {
    setIsModalUploadOpen(!isModalUploadOpen);
  };

  const handleUpdateUser = async (otpValue: string) => {
    const payload: IUserUpdate = {
      firstName: updateFormData.personal.firstName,
      lastName: updateFormData.personal.lastName,
      email: updateFormData.personal.email,
      username: updateFormData.personal.username,
      phoneNumber: updateFormData.personal.phoneNumber,
    };

    const headers = {
      "Content-Type": "application/json",
      otp: otpValue,
    };

    const response = await userService.updateUser(payload, headers);

    return response;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (otpValue: string) => {
    const payload: IChangePassword = {
      currentPassword: password.currentPassword,
      newPassword: password.newPassword,
      confirmNewPassword: password.confirmNewPassword,
    };

    const headers = {
      "Content-Type": "application/json",
      otp: otpValue,
    };

    const response = await authService.changePassword(payload, headers);

    return response;
  };

  const handleModalConfirm = async (otpValue: string) => {
    try {
      let response;

      if (actionType === "updateUser") {
        response = await handleUpdateUser(otpValue);
      } else if (actionType === "changePassword") {
        response = await handleChangePassword(otpValue);
        setPassword({
          currentPassword: "",
          confirmNewPassword: "",
          newPassword: "",
        });

        await logout();
      }

      if (response?.status === 200) {
        toast.success(response.data.message || "Success!");
        if (actionType === "updateUser") window.location.reload();
      } else {
        toast.error(response?.data?.message || "Something went wrong.");
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
      console.error("Error:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  // Handle modal cancellation
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const profileInput: profileInput[] = [
    {
      section: "personal",
      label: "Personal Information",
      fields: [
        {
          label: "First name",
          value: formData?.personal.firstName || "",
          name: "firstName",
        },
        {
          label: "Last name",
          value: formData?.personal.lastName || "",
          name: "lastName",
        },
        {
          label: "Email",
          type: "email",
          value: formData?.personal.email || "",
          name: "email",
          isDisable: isGoogleLogin ? true : false,
        },
        {
          label: "Username",
          value: formData?.personal.username || "",
          name: "username",
        },
        {
          label: "Phone number",
          value: formData?.personal.phoneNumber || "",
          name: "phoneNumber",
        },
      ],
    },
    {
      section: "address",
      label: "Primary Address",
      fields: [
        {
          label: "House number",
          value: formData?.address.houseNumber,
          name: "houseNumber",
        },
        { label: "Street", value: formData?.address.street, name: "street" },
        { label: "Ward", value: formData?.address.ward, name: "ward" },
        {
          label: "District",
          value: formData?.address.district,
          name: "district",
        },
        { label: "City", value: formData?.address.city, name: "city" },
        { label: "Country", value: formData?.address.country, name: "country" },
      ],
    },
  ];

  const handleUpdateInformation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    try {
      const response = await userService.sendOtpCode();
      if (response.status === 200) {
        toast.success(response.data.message);
        console.log(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error(`Error while sending otp: ${error.response.data.message}`);
    }
  };

  return (
    <>
      {/* Back to Home button */}
      <BackToHome textColor="text-black" />

      {/* Modal upload */}
      <ModalUpload
        isOpen={isModalUploadOpen}
        onClose={() => setIsModalUploadOpen(false)}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        name="Confirm Your Identity"
        status="warning"
        input={true}
        confirmButton={true}
        cancelButton={true}
        placeHolder="Your OTP code"
        description="Please enter the verification code to confirm your profile changes."
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      {/* Profile section */}
      <section className="bg-gray-100">
        <div className="p-5 container mx-auto">
          <div className="bg-white border border-gray-50 rounded-md shadow-md p-5 min-h-[15rem] w-full">
            <div className="flex flex-col items-center justify-center">
              <div
                className="group relative cursor-pointer"
                onClick={handleModalUpload}
              >
                <img
                  src={`${formData?.personal.profilePicture}`}
                  className="border rounded-full h-28 w-28 relative group-hover:opacity-100"
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
                <div className="border rounded-full h-28 w-28 absolute top-0 left-0 opacity-0 bg-black flex items-center justify-center transition-opacity duration-300 group-hover:opacity-50">
                  <span className="z-50 text-white">Upload avatar</span>
                </div>
              </div>

              <h1 className="text-2xl font-semibold text-gray-900 p-2">
                {`${formData?.personal.firstName} ${formData?.personal.lastName}`}
              </h1>
              <h3 className="text-xl text-gray-500">
                {formData?.personal.email}
              </h3>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateInformation}>
          {profileInput.map((pi, idx) => (
            <div className="p-5 container mx-auto" key={idx}>
              <div className="bg-white border border-gray-50 rounded-md shadow-md p-5 min-h-[20rem] w-full">
                <h1 className="text-2xl font-bold text-gray-900">{pi.label}</h1>
                <div className="py-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pi.fields.map((field, idx) => (
                    <div key={idx}>
                      <label
                        htmlFor={field.label}
                        className="text-md font-semibold text-gray-900"
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        disabled={field.isDisable}
                        className={`px-3 py-2 border focus:outline-none focus:ring-1 rounded-md w-full ${
                          field.isDisable
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : ""
                        }`}
                        defaultValue={field.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(
                            pi.section as keyof profile,
                            field.name ?? "",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
                {/* Save changes button */}
                <div className="flex justify-end">
                  <button
                    className="px-3 py-2 rounded-md bg-black text-white hover:bg-indigo-500 hover:text-white transition-colors duration-200 cursor-pointer shadow-md"
                    onClick={() => setActionType("updateUser")}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </form>

        <div className="p-5 container mx-auto">
          <div className="bg-white border border-gray-50 rounded-md shadow-md p-5 min-h-[20rem] w-full space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="p-2 text-2xl text-gray-900 font-bold">
                Order History
              </h1>
              <a href="#" className="text-md text-gray-900 font-bold underline">
                View all
              </a>
            </div>
            <div className="p-3 border border-gray-300 bg-white min-h-[5rem] shadow-md rounded-md">
              <div className="flex justify-between items-center">
                <div className="p-2">
                  <h3 className="text-xl text-gray-900 font-semibold">
                    Order#2305
                  </h3>
                  <span className="text-gray-500 ">Placed on Jan 1, 2025</span>
                </div>
                <button className="px-3 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-200 text-sm cursor-pointer">
                  View details
                </button>
              </div>
            </div>

            <div className="p-3 border border-gray-300 bg-white min-h-[5rem] shadow-md rounded-md">
              <div className="flex justify-between items-center">
                <div className="p-2">
                  <h3 className="text-xl text-gray-900 font-semibold">
                    Order#2305
                  </h3>
                  <span className="text-gray-500 ">Placed on Jan 1, 2025</span>
                </div>
                <button className="px-3 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-200 text-sm cursor-pointer">
                  View details
                </button>
              </div>
            </div>

            <div className="p-3 border border-gray-300 bg-white min-h-[5rem] shadow-md rounded-md">
              <div className="flex justify-between items-center">
                <div className="p-2">
                  <h3 className="text-xl text-gray-900 font-semibold">
                    Order#2305
                  </h3>
                  <span className="text-gray-500 ">Placed on Jan 1, 2025</span>
                </div>
                <button className="px-3 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-200 text-sm cursor-pointer">
                  View details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-5 container mx-auto">
          {/* Lớp phủ luôn hiện nếu là Google user */}
          {isGoogleLogin && (
            <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="bg-white p-5 rounded-md shadow-md">
                <p className="text-lg font-semibold text-red-600">
                  You signed in with Google. Password change is not allowed.
                </p>
              </div>
            </div>
          )}

          {/* Form thay đổi mật khẩu */}
          <div
            className={`bg-white border border-gray-50 rounded-md shadow-md p-5 min-h-[20rem] w-full ${
              isGoogleLogin ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <h1 className="text-2xl font-bold text-gray-900">Security</h1>
            <form onSubmit={handleUpdateInformation}>
              <div className="py-5 space-y-2">
                {/* Current password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="text-md font-semibold text-gray-900"
                  >
                    Current password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="px-3 py-2 border focus:outline-none focus:ring-1 rounded-md w-full"
                    value={password.currentPassword}
                    onChange={handlePasswordChange}
                    disabled={isGoogleLogin}
                  />
                </div>
                {/* New password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="text-md font-semibold text-gray-900"
                  >
                    New password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    className="px-3 py-2 border focus:outline-none focus:ring-1 rounded-md w-full"
                    value={password.newPassword}
                    onChange={handlePasswordChange}
                    disabled={isGoogleLogin}
                  />
                </div>
                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-md font-semibold text-gray-900"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    className="px-3 py-2 border focus:outline-none focus:ring-1 rounded-md w-full"
                    value={password.confirmNewPassword}
                    onChange={handlePasswordChange}
                    disabled={isGoogleLogin}
                  />
                </div>
              </div>
              {/* Save changes button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-3 py-2 rounded-md bg-black text-white hover:bg-indigo-500 transition-colors duration-200 cursor-pointer shadow-md"
                  disabled={isGoogleLogin}
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Toaster />
    </>
  );
}
