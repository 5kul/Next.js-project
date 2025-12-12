import React from "react";
import ProtectedRoute from "./../components/ProtectedRoute";
import Layout from "../components/Layout";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Layout>
        <Typography variant="h4">Dashboard</Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Link href="/users"><Button variant="contained">Users</Button></Link>
          <Link href="/products"><Button variant="contained">Products</Button></Link>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
}
