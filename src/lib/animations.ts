import { useState, useEffect } from "react";
import { useReducedMotion as framerUseReducedMotion } from "framer-motion";

export function useReducedMotion() {
  return framerUseReducedMotion();
}

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkIsMobile = () => setIsMobile(window.innerWidth <= breakpoint);
    
    // Initial check
    checkIsMobile();
    
    // Add event listener
    window.addEventListener("resize", checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}
