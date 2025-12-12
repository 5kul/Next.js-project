import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import { useProductsStore } from "../../stores/useProductsStore";

// MUI imports (Grid ke bina)
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
    fetchProducts({ page: 0, limit });
  }, []);

  const doSearch = async () => { 
    await fetchProducts({ 
      page: 0, 
      limit, 
      search, 
      category: category || undefined 
    }); 
  };
  
  const onPage = (_: any, p: number) => { 
    fetchProducts({ 
      page: p - 1, 
      limit, 
      search, 
      category: category || undefined 
    }); 
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <TextField 
            placeholder="Search products..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            fullWidth
          />
          
      
<Select 
  value={category} 
  onChange={(e) => setCategory(e.target.value as string)} 
  displayEmpty
  style={{ minWidth: 150 }}
>
  <MenuItem value="">All Categories</MenuItem>
  
  {/* ✅ FIXED: Object categories ko properly handle karein */}
  {categories.map((cat: any) => {
    // Agar cat string hai
    if (typeof cat === 'string') {
      return (
        <MenuItem key={cat} value={cat}>
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </MenuItem>
      );
    }
    
    // Agar cat object hai {slug, name, url}
    if (cat && typeof cat === 'object') {
      const value = cat.slug || cat.id || cat.name;
      const label = cat.name || cat.title || cat.slug || 'Unnamed Category';
      
      return (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      );
    }
    
    // Default fallback
    return (
      <MenuItem key={String(cat)} value={String(cat)}>
        {String(cat)}
      </MenuItem>
    );
  })}
</Select>
          
          <Button variant="contained" onClick={doSearch}>
            Search
          </Button>
        </div>

        {/* ✅ CSS Grid use karein (Grid component ki jagah) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px',
          marginTop: '16px'
        }}>
          {products.map((p: any) => (
            <div key={p.id}>
              <Card style={{ height: '100%' }}>
                <Link href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <CardMedia 
                    component="img" 
                    height="160" 
                    image={p.thumbnail || p.images?.[0]} 
                    alt={p.title}
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
                
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {p.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    ₹ {p.price}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Rating: {p.rating}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <Pagination 
            count={Math.ceil(total / limit)} 
            page={page + 1} 
            onChange={onPage} 
            color="primary"
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}