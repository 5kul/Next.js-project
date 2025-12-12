import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useProductsStore } from "../../stores/useProductsStore";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import type { GridProps } from "@mui/material/Grid";  // ✅ ensures correct typing
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;

  const fetchProduct = useProductsStore((s) => s.fetchProduct);

  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const p = await fetchProduct(Number(id));

        if (!p) {
          setError("Product not found");
          return;
        }

        setProduct(p);
      } catch (e) {
        setError("Failed to load product details");
      }
    })();
  }, [id]);

  // -------------------------------------
  // Loading state
  // -------------------------------------
  if (!product && !error) {
    return (
      <ProtectedRoute>
        <Layout>
          <Typography>Loading...</Typography>
        </Layout>
      </ProtectedRoute>
    );
  }

  // -------------------------------------
  // Error view (grid only)
  // -------------------------------------
  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <Grid container justifyContent="center" sx={{ mt: 4 }}>
            {/* <Grid item xs={12} md={6}>
              <Alert severity="error">{error}</Alert>

              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => router.push("/products")}
              >
                Back to Products
              </Button>
            </Grid> */}
          </Grid>
        </Layout>
      </ProtectedRoute>
    );
  }

  // -------------------------------------
  // Success: product details
  // -------------------------------------
  return (
    <ProtectedRoute>
      <Layout>
        <Button variant="outlined" onClick={() => router.push("/products")}>
          Back to Products
        </Button>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* IMAGES GRID */}
          {/* <Grid item xs={12} md={6}>
            {Array.isArray(product.images) ? (
              product.images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  style={{ width: "100%", marginBottom: 8 }}
                />
              ))
            ) : (
              <Alert severity="warning">No images available</Alert>
            )}
          </Grid> */}

          {/* DETAILS GRID */}
          {/* <Grid item xs={12} md={6}>
            <Typography variant="h4">{product.title}</Typography>

            <Typography variant="h6" sx={{ mt: 1 }}>
              ₹ {product.price} — Rating: {product.rating}
            </Typography>

            <Typography sx={{ mt: 2 }}>{product.description}</Typography>
            <Typography sx={{ mt: 2 }}>Category: {product.category}</Typography>
          </Grid> */}
        </Grid>
      </Layout>
    </ProtectedRoute>
  );
}
