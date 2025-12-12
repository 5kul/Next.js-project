import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import { useUsersStore } from "../../stores/useUsersStore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Link from "next/link";

export default function UsersPage() {
  const { users, total, page, limit, fetchUsers } = useUsersStore();
  const [q, setQ] = useState("");

  useEffect(()=> { fetchUsers({ page:0, limit }); }, []);

  const doSearch = async () => { await fetchUsers({ page:0, limit, search: q }); };
  const onPage = (_:any, p:number) => { fetchUsers({ page: p-1, limit }); };

  return (
    <ProtectedRoute>
      <Layout>
        <div style={{ display:"flex", gap:12, marginBottom:16 }}>
          <TextField placeholder="Search users..." value={q} onChange={(e)=>setQ(e.target.value)} />
          <Button variant="contained" onClick={doSearch}>Search</Button>
        </div>

        <Table>
          <TableHead>
            <TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Gender</TableCell><TableCell>Phone</TableCell><TableCell>Company</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {users.map((u:any) => (
              <TableRow key={u.id}>
                <TableCell><Link href={`/users/${u.id}`}>{u.firstName} {u.lastName}</Link></TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.gender}</TableCell>
                <TableCell>{u.phone}</TableCell>
                <TableCell>{u.company?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div style={{display:"flex",justifyContent:"center",marginTop:16}}>
          <Pagination count={Math.ceil(total/limit)} page={page+1} onChange={onPage} />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
