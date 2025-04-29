import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

import { Snackbar } from '@mui/material';
function ProductCard({ product, onAddToCart }) {
  const [showUnavailable, setShowUnavailable] = React.useState(false);
  return (
    <Card sx={{ maxWidth: { xs: 270, sm: 320 }, mx: 'auto', borderRadius: 3, boxShadow: 5, position: 'relative', p: { xs: 1, sm: 2 } }}>
      {/* شارة غير متوفر */}
      {product.available === false && (
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: '#e53935',
          color: '#fff',
          padding: '2px 14px',
          borderRadius: 16,
          fontWeight: 'bold',
          fontSize: 15,
          zIndex: 2,
          boxShadow: '0 2px 8px #0002',
        }}>
          غير متوفر
        </div>
      )}
      <CardMedia
        component="img"
        height={window.innerWidth < 400 ? 100 : 140}
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'contain', mb: 1, width: '100%', maxHeight: { xs: 100, sm: 140 }, background: '#f9fafb' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" align="center" sx={{ fontSize: { xs: 16, sm: 18 } }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1, fontSize: { xs: 13, sm: 15 } }}>
          السعر: {product.price} $
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (product.available === false) {
              setShowUnavailable(true);
            } else {
              onAddToCart(product);
            }
          }}
          disabled={product.available === false}
          sx={{ mt: 1, width: { xs: '100%', sm: 'auto' }, fontSize: { xs: 15, sm: 16 } }}
        >
          أضف إلى السلة
        </Button>
      </CardActions>
      <Snackbar
        open={showUnavailable}
        autoHideDuration={2000}
        onClose={() => setShowUnavailable(false)}
        message="هذا المنتج غير متوفر حالياً"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ContentProps={{ sx: { bgcolor: '#e53935', color: '#fff', fontWeight: 'bold', fontSize: 16, borderRadius: 2 } }}
      />
    </Card>
  );
}

export default ProductCard;
