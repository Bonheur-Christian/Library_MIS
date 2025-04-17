"use client";
import { usePathname } from "next/navigation"; 
import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function PageLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return isLoading ? (
    <div>
      <Loader />
    </div>
  ) : null;
}
