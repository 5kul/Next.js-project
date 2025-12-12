import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useUsersStore } from "../../stores/useUsersStore";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function UserDetails() {
  const router = useRouter();
  const { id } = router.query;
  const fetchSingleUser = useUsersStore((s: { fetchSingleUser: any; }) => s.fetchSingleUser);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    (async()=> {
      const u = await fetchSingleUser(Number(id));
      setUser(u);
    })();
  }, [id]);

  if (!user) return <ProtectedRoute><div>Loading...</div></ProtectedRoute>;

  return (
    <ProtectedRoute>
      <Layout>
        <Button variant="outlined" onClick={()=>router.push("/users")}>Back to Users</Button>
        <Typography variant="h4" sx={{ mt:2 }}>{user.firstName} {user.lastName}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Phone: {user.phone}</Typography>
        <Typography>Gender: {user.gender}</Typography>
        <Typography>Company: {user.company?.name}</Typography>
        <Typography>Address: {user.address?.address}, {user.address?.city}</Typography>
      </Layout>
    </ProtectedRoute>
  );
}
