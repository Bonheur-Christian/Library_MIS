"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true); // Ensures the component is mounted
    }, []);

    useEffect(() => {
      if (isMounted) {
        const user = localStorage.getItem("user");
        if (!user) {
          router.push("/signin");
        }
      }
    }, [isMounted]);

    if (!isMounted) return null; // ⛔ Prevent rendering before mount

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
