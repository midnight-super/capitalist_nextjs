"use client";
import { useEffect, useState } from "react";

const useIsMobile = (size = 991) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= size
  );

  const handleResize = () => {
    setIsMobile(typeof window !== "undefined" && window.innerWidth <= size);
  };

  useEffect(() => {
    // Add a resize event listener to update the state when the window is resized
    typeof window !== "undefined" &&
      window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
