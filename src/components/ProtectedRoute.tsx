import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}><CircularProgress/></div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
