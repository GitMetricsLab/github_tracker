import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const BOTTOM_THRESHOLD = 24;

const ScrollNavigator = () => {
  const [showUpButton, setShowUpButton] = useState(false);
  const [showDownButton, setShowDownButton] = useState(false);

  const updateVisibility = () => {
    const { documentElement } = document;
    const scrollTop = window.scrollY;
    const scrollableHeight =
      documentElement.scrollHeight - documentElement.clientHeight;
    const nearBottom = scrollTop >= scrollableHeight - BOTTOM_THRESHOLD;

    setShowUpButton(scrollTop > 300);
    setShowDownButton(scrollableHeight > 0 && !nearBottom);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", updateVisibility);
    window.addEventListener("resize", updateVisibility);
    updateVisibility();

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  if (!showUpButton && !showDownButton) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      {showUpButton && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}

      {showDownButton && (
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/30 transition-all duration-200 hover:translate-y-1 hover:bg-slate-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus:ring-offset-slate-900"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default ScrollNavigator;