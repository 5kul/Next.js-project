import React, { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useProductsStore } from "../../stores/useProductsStore";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;

  const fetchProduct = useProductsStore((s) => s.fetchProduct);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const p = await fetchProduct(Number(id));

      if (!p) {
        setError("Product not found");
        return;
      }

      setProduct(p);
      setError(null);
    } catch (e) {
      setError("Failed to load product details");
      console.error("Product fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [id, fetchProduct]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Loading product details...</Typography>
          </Box>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Error view
  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 600, width: '100%' }}>
              <Alert severity="error">{error}</Alert>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => router.push("/products")}
              >
                Back to Products
              </Button>
            </Box>
          </Box>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Success: product details
  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ p: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => router.push("/products")}
            sx={{ mb: 3 }}
          >
            Back to Products
          </Button>

          {/* ✅ CSS Flexbox/Grid use karein (MUI Grid ki jagah) */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mt: 2
          }}>
            
            {/* IMAGES SECTION - Left side on desktop, top on mobile */}
            <Box sx={{
              flex: 1,
              minWidth: { md: '50%' }
            }}>
              {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                product.images.map((img: string, idx: number) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <img
                      src={img}
                      alt={`${product.title} - Image ${idx + 1}`}
                      style={{ 
                        width: "100%", 
                        height: "auto",
                        borderRadius: "8px",
                        maxHeight: "400px",
                        objectFit: "contain"
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Alert severity="warning">No images available</Alert>
              )}
            </Box>

            {/* DETAILS SECTION - Right side on desktop, bottom on mobile */}
            <Box sx={{
              flex: 1,
              minWidth: { md: '50%' }
            }}>
              <Typography variant="h4" gutterBottom>
                {product.title}
              </Typography>

              <Typography variant="h5" sx={{ mt: 2, mb: 2, color: 'primary.main' }}>
                ₹ {product.price}
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                backgroundColor: '#f5f5f5',
                p: 2,
                borderRadius: '8px',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Typography variant="body1">
                  Rating: <strong>{product.rating}</strong>/5
                </Typography>
                
                {product.brand && (
                  <Typography variant="body2" sx={{ 
                    backgroundColor: 'white', 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                  }}>
                    Brand: <strong>{product.brand}</strong>
                  </Typography>
                )}
              </Box>

              <Typography variant="body1" paragraph sx={{ 
                mt: 2, 
                lineHeight: 1.6,
                backgroundColor: '#fafafa',
                p: 2,
                borderRadius: '8px'
              }}>
                {product.description}
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                mt: 3
              }}>
                {product.category && (
                  <Box sx={{
                    backgroundColor: '#e3f2fd',
                    px: 2,
                    py: 1,
                    borderRadius: '20px',
                    border: '1px solid #bbdefb'
                  }}>
                    <Typography variant="body2">
                      Category: <strong>{product.category}</strong>
                    </Typography>
                  </Box>
                )}

                {product.stock !== undefined && (
                  <Box sx={{
                    backgroundColor: product.stock > 0 ? '#e8f5e9' : '#ffebee',
                    px: 2,
                    py: 1,
                    borderRadius: '20px',
                    border: product.stock > 0 ? '1px solid #c8e6c9' : '1px solid #ffcdd2'
                  }}>
                    <Typography variant="body2">
                      Stock: <strong>{product.stock} units</strong>
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
}