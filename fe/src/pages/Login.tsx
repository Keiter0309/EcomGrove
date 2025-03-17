import { Toaster } from "react-hot-toast";
import bg from "../assets/bg.jpg";
import { useAuthStore } from "../store/useAuthStore";
import { useForm, SubmitHandler } from "react-hook-form";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import BackToHome from "../components/common/BackToHome";
import Loading from "../components/common/Loading";

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const ggLogin = useAuthStore((state) => state.ggLogin);

  const isLoading = useAuthStore((state) => state.isLoading);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await login(data.email, data.password);
  };

  const handleLogin = async (credentialResponse: any) => {
    await ggLogin(credentialResponse);
  };

  return (
    <>
      {/* Back to Home button */}
      <BackToHome textColor="text-white" />

      <div
        className="relative min-h-screen bg-cover bg-center flex flex-col justify-center items-center w-full"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <div className="relative z-10 max-w-md w-full rounded-md shadow-md bg-transparent p-8">
          <div className="flex flex-col items-center mb-6">
            <h3 className="text-2xl text-white">Welcome Back</h3>
            <span className="text-sm text-gray-300">
              Enter your credentials to access your account
            </span>
          </div>
          <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                className={`border rounded-full px-5 py-3 text-white bg-transparent border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#fbceb5] transition-all duration-200 ease-in-out ${
                  errors.email ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />

              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`border rounded-full px-5 py-3 text-white bg-transparent border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#fbceb5] transition-all duration-200 ease-in-out ${
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#fbceb5] text-black rounded-full px-5 py-3 transition duration-200 hover:cursor-pointer hover:bg-[#e0b39d]"
              disabled={isLoading}
            >
              {isLoading ? <div>Processing...</div> : "SIGN IN"}
            </button>
            <div className="flex justify-end">
              <a
                href="#"
                className="text-white hover:text-indigo-500 transition-all duration-300 ease-in-out hover:underline underline-offset-2"
              >
                Forgot password
              </a>
            </div>
          </form>
          <div className="text-center mt-4">
            <span className="text-sm text-white">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Signup
              </a>
            </span>
          </div>
          <div className="flex flex-col justify-center items-center text-white text-xl mt-5">
            - Or Sign In With -{" "}
            <div className="mt-5">
              <GoogleOAuthProvider clientId={clientId}>
                <div className="">
                  <GoogleLogin
                    text="signin_with"
                    onSuccess={handleLogin}
                    onError={() => {
                      alert("Đăng nhập thất bại!");
                    }}
                  />
                </div>
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
        <Loading isVisible={isLoading} />
        <Toaster />
      </div>
    </>
  );
}
