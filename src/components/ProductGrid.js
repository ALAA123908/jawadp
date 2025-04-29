import React from 'react';
import { Grid } from '@mui/material';
import ProductCard from './ProductCard';

function ProductGrid({ onAddToCart, products }) {
  return (
    <Grid container spacing={3} justifyContent="center">
      {products && products.length > 0 ? (
        products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <p style={{ textAlign: 'center', color: '#888', fontWeight: 'bold' }}>لا توجد منتجات متاحة</p>
        </Grid>
      )}
    </Grid>
  );
}

export default ProductGrid;
