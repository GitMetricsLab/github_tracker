import { useState, useEffect, useRef } from "react";

// Inside your custom useDebounce hook function:
const isMounted = useRef(true); 

useEffect(() => {
  isMounted.current = true; 

  const handler = setTimeout(() => {
    if (isMounted.current) {
      setDebouncedValue(value);
    }
  }, delay);

  return () => {
    clearTimeout(handler);   
    isMounted.current = false; 
  };
}, [value, delay]);
