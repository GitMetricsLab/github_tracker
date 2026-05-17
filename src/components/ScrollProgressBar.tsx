import { useEffect } from "react";

const ScrollProgressBar = () => {
  useEffect(() => {
    const updateProgress = () => {
      const { documentElement } = document;
      const scrollTop = documentElement.scrollTop || document.body.scrollTop;
      const scrollableHeight = documentElement.scrollHeight - documentElement.clientHeight;
      const width = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      const bar = document.getElementById("scroll-progress");
      if (bar) bar.style.width = `${width}%`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return null; // bar is rendered via #scroll-progress in Navbar/CSS
};

export default ScrollProgressBar;