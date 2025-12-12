import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import { useProductsStore } from "../../stores/useProductsStore";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Link from "next/link";

export default function ProductsPage() {
  const { products, total, page, limit, fetchProducts, categories, fetchCategories } = useProductsStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | "">("");

  useEffect(() => {
    fetchCategories();
    fetchProducts({ page:0, limit });
  }, []);

  const doSearch = async () => { await fetchProducts({ page:0, limit, search, category: category || undefined }); };
  const onPage = (_:any, p:number) => { fetchProducts({ page: p-1, limit, search, category: category || undefined }); };

  return (
    <ProtectedRoute>
      <Layout>
        <div style={{display:"flex", gap:12, marginBottom:16}}>
          <TextField placeholder="Search products..." value={search} onChange={(e)=>setSearch(e.target.value)} />
          <Select value={category} onChange={(e)=>setCategory(e.target.value as any)} displayEmpty>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((c:any)=><MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
          <Button variant="contained" onClick={doSearch}>Search</Button>
        </div>

        {/* <Grid container spacing={2}>
          {products.map((p:any)=>(
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <Card>
                <Link href={`/products/${p.id}`}>
                  <CardMedia component="img" height="160" image={p.thumbnail || p.images?.[0]} />
                </Link>
                <CardContent>
                  <Typography variant="subtitle1">{p.title}</Typography>
                  <Typography>₹ {p.price}</Typography>
                  <Typography>Rating: {p.rating}</Typography>
                </CardContent>
              </Card>
            </Grid>
        //   ))}
        // </Grid> */}

        <div style={{display:"flex",justifyContent:"center",marginTop:16}}>
          <Pagination count={Math.ceil(total/limit)} page={page+1} onChange={onPage} />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
