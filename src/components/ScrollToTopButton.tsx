import { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 10) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="
          fixed
          bottom-6
          right-6
          z-50
          bg-blue-600
          hover:bg-blue-700
          text-white
          p-3
          rounded-full
          shadow-lg
          transition-all
          duration-300
        "
      >
        <KeyboardArrowUpIcon />
      </button>
    )
  );
};

export default ScrollToTopButton;
