import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackToHomeColor {
  textColor: string;
}

const BackToHome: React.FC<BackToHomeColor> = ({ textColor }) => {
  const navigate = useNavigate();
  const handleGoBackHome = () => {
    navigate("/");
  };
  return (
    <div className="fixed inset-y-0 z-50 top-5 left-5 group">
      <button onClick={handleGoBackHome} className="">
        <ArrowLeft className={`h-8 w-8 ${textColor} hover:cursor-pointer`} />
      </button>
      <div className="absolute left-12 top-0 bg-gray-800 text-white text-xs rounded px-2 py-1 hidden group-hover:block min-w-24 text-center">
        Back to Home
      </div>
    </div>
  );
};

export default BackToHome;
