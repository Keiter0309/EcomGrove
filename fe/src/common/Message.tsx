// src/common/Message.tsx
import React, { useEffect, useState } from "react";

interface MessageProps {
  type: "success" | "error";
  content: string;
  onClose: () => void;
}

export default function Message({ type, content }: MessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed top-5 z-50 px-4 py-3 rounded-md shadow-md text-white transition-transform duration-500 ease-in-out 
        ${type === "success" ? "bg-green-500" : "bg-red-500"} 
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
    >
      {content}
    </div>
  );
}
