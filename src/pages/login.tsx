import React, { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useAuthStore } from "../stores/useAuthStore";

export default function LoginPage() {
  const [username, setUsername] = useState("kminchelle");
  const [password, setPassword] = useState("0lelplR");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e?: any) => {
    e?.preventDefault();
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) router.push("/dashboard");
    else alert("Login failed");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <Typography variant="h4" align="center">Admin Login</Typography>
        <TextField label="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <Button variant="contained" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
      </Box>
    </Container>
  );
}
