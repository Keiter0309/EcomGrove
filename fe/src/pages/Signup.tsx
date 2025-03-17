import { ETypes } from "../enums/ETypes";
import { EURI } from "../enums/EURI";
import toast, { Toaster } from "react-hot-toast";
import "../styles/global-style.css";
import { useAuthStore } from "../store/useAuthStore";
import { SubmitHandler, useForm } from "react-hook-form";
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";
import Loading from "../components/common/Loading";

type FormValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export default function Signup() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await signup(data);
      if (response) {
        navigate("/login");
      }
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const input = [
    {
      name: "firstName",
      placeHolder: "Enter your first name",
      validation: {
        required: "First name is required",
        minLength: {
          value: 2,
          message: "First name must be at least 2 characters",
        },
      },
    },
    {
      name: "lastName",
      placeHolder: "Enter your last name",
      validation: {
        required: "Last name is required",
        minLength: {
          value: 2,
          message: "Last name must be at least 2 characters",
        },
      },
    },
    {
      name: "username",
      placeHolder: "Enter your username",
      validation: {
        required: "Username is required",
        minLength: {
          value: 3,
          message: "Username must be at least 3 characters",
        },
      },
    },
    {
      name: "phoneNumber",
      placeHolder: "Enter your phone number",
      validation: {
        required: "Phone number is required",
        pattern: {
          value: /^[0-9]{10,}$/,
          message: "Phone number must be at least 10 digits",
        },
      },
    },
    {
      name: "email",
      placeHolder: "Enter your email",
      type: "email",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          message: "Invalid email format",
        },
      },
    },
    {
      name: "password",
      placeHolder: "Enter your password",
      type: "password",
      validation: {
        required: "Password is required",
        pattern: {
          value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
          message:
            "assword must contain at least one uppercase letter and one special character.",
        },
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
      },
    },
  ];

  return (
    <>
      <Header />
      <div
        className="relative min-h-screen bg-cover bg-center flex flex-col justify-center items-center w-full"
        style={{
          backgroundImage: `url(${EURI.IMAGE_URI}/${ETypes.CITY}/city_10.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="relative z-10 max-w-md w-full rounded-md shadow-md bg-transparent p-8">
          <div className="flex flex-col items-center mb-6">
            <h3 className="text-2xl text-gray-100">Create Account</h3>
            <span className="text-sm text-gray-400">
              Enter your credentials to access your account
            </span>
          </div>
          <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-5">
              {input.map((ip) => (
                <div key={ip.name} className="flex flex-col">
                  <input
                    type={ip.type || "text"}
                    {...register(ip.name as keyof FormValues, ip.validation)}
                    placeholder={ip.placeHolder}
                    className={`border rounded-full px-5 py-3 text-gray-100 bg-transparent border-gray-300 focus:outline-none focus:ring-[#fbecb5] focus:ring-1 transition-all duration-200 ease-in-out ${
                      errors[ip.name as keyof FormValues]
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {errors[ip.name as keyof FormValues] && (
                    <span className="text-red-500 text-sm mt-1">
                      {
                        errors[ip.name as keyof FormValues]
                          ?.message as React.ReactNode
                      }
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#fbceb5] text-black rounded-full px-5 py-3 transition duration-200 hover:cursor-pointer hover:bg-[#e0b39d]"
            >
              {isLoading ? <div>Processing...</div> : "SIGN UP"}
            </button>
          </form>
        </div>
        <Toaster />
        <Loading isVisible={isLoading} />
      </div>
    </>
  );
}
