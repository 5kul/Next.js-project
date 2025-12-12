import React from "react";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <>
    <AppBar position="static">
      <Toolbar>
        <Link href="/dashboard"><Typography variant="h6">UXD Lab Admin</Typography></Link>
      </Toolbar>
    </AppBar>
    <Container sx={{ mt: 3 }}>{children}</Container>
  </>
);

export default Layout;
