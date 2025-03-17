import React, { useRef, useEffect } from "react";

interface AnimatedMenuButtonProps {
  isOpened: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AnimatedMenuButton: React.FC<AnimatedMenuButtonProps> = ({
  isOpened,
  onClick,
}) => {
  const topLineRef = useRef<SVGPolylineElement | null>(null);
  const bottomLineRef = useRef<SVGPolylineElement | null>(null);

  useEffect(() => {
    const topAnimations = topLineRef.current?.querySelectorAll("animate");
    const bottomAnimations = bottomLineRef.current?.querySelectorAll("animate");

    if (!isOpened) {
      topAnimations?.[1]?.beginElement();
      bottomAnimations?.[1]?.beginElement();
    } else {
      topAnimations?.[0]?.beginElement();
      bottomAnimations?.[0]?.beginElement();
    }
  }, [!isOpened]);

  return (
    <button
      onClick={onClick}
      className="mt-2 focus:outline-none hover:cursor-pointer"
      aria-label={!isOpened ? "Close menu" : "Open menu"}
      type="button"
    >
      <svg
        className="h-7 w-7"
        viewBox="0 0 18 18"
        fill="none"
        strokeWidth="1.2"
      >
        <polyline
          ref={topLineRef}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="2 12, 16 12"
        >
          <animate
            attributeName="points"
            keyTimes="0;0.5;1"
            dur="0.24s"
            begin="indefinite"
            fill="freeze"
            calcMode="spline"
            keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
            values="2 12, 16 12; 2 9, 16 9; 3.5 15, 15 3.5"
          />
          <animate
            attributeName="points"
            keyTimes="0;0.5;1"
            dur="0.24s"
            begin="indefinite"
            fill="freeze"
            calcMode="spline"
            keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
            values="3.5 15, 15 3.5; 2 9, 16 9; 2 12, 16 12"
          />
        </polyline>

        <polyline
          ref={bottomLineRef}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="2 5, 16 5"
        >
          <animate
            attributeName="points"
            keyTimes="0;0.5;1"
            dur="0.24s"
            begin="indefinite"
            fill="freeze"
            calcMode="spline"
            keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
            values="2 5, 16 5; 2 9, 16 9; 3.5 3.5, 15 15"
          />
          <animate
            attributeName="points"
            keyTimes="0;0.5;1"
            dur="0.24s"
            begin="indefinite"
            fill="freeze"
            calcMode="spline"
            keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
            values="3.5 3.5, 15 15; 2 9, 16 9; 2 5, 16 5"
          />
        </polyline>
      </svg>
    </button>
  );
};

export default AnimatedMenuButton;
