import React from 'react';
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemText, Divider, Button, Avatar, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { TextField, Alert, DialogActions, Snackbar } from '@mui/material';

function CartDrawer({ open, onClose, items, onRemoveItem, onChangeQuantity, onConfirmOrder, orders }) {
  const [orderStep, setOrderStep] = React.useState('cart'); // 'cart' | 'form' | 'done'
  const [form, setForm] = React.useState({ name: '', phone: '', address: '', notes: '' });
  const [error, setError] = React.useState('');
  const [showReplySnackbar, setShowReplySnackbar] = React.useState(false);
  const lastOrder = orders && orders.length > 0 ? orders[orders.length-1] : null;
  const [lastReply, setLastReply] = React.useState(null);

  // راقب التغير في رد الإدارة على آخر طلب
  React.useEffect(() => {
    if (orderStep === 'done' && lastOrder && lastOrder.reply && lastOrder.reply !== lastReply) {
      setShowReplySnackbar(true);
      setLastReply(lastOrder.reply);
      setTimeout(() => setShowReplySnackbar(false), 3000);
    }
    // eslint-disable-next-line
  }, [lastOrder && lastOrder.reply]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirm = () => {
    setOrderStep('form');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setError('ير$ى تعبئة $ميع الحقول');
      return;
    }
    setError('');
    // إرسال الطلب إلى App.js
    onConfirmOrder({
      items: items.map(item => ({ name: item.name, quantity: item.quantity })),
      note: form.notes,
      customer: form.name,
      phone: form.phone,
      address: form.address,
    });
    setOrderStep('done');
  };

  const handleDrawerClose = () => {
    setOrderStep('cart');
    setForm({ name: '', phone: '', address: '' });
    setError('');
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
      <Box sx={{ width: 340, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">سلة المشتريات</Typography>
          <IconButton onClick={handleDrawerClose}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        {orderStep === 'cart' && (
          <>
            <List>
              {items.length === 0 ? (
                <Box sx={{ textAlign: 'center', color: 'text.secondary', my: 4 }}>
                  <ShoppingCartIcon sx={{ fontSize: 48, mb: 1, color: 'grey.400' }} />
                  <Typography variant="body1">السلة فارغة</Typography>
                </Box>
              ) : (
                items.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem alignItems="flex-start" sx={{ py: 1 }}
                      secondaryAction={
                        <IconButton color="error" onClick={() => onRemoveItem(item.id)} title="حذف المنتج"><DeleteIcon /></IconButton>
                      }
                    >
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                        <Avatar src={item.image} alt={item.name} variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'grey.200' }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography fontWeight="bold">{item.name}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                            <IconButton size="small" color="primary" onClick={() => onChangeQuantity(item.id, 1)}><AddIcon /></IconButton>
                            <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</Typography>
                            <IconButton size="small" color="primary" onClick={() => onChangeQuantity(item.id, -1)} disabled={item.quantity <= 1}><RemoveIcon /></IconButton>
                            <Typography sx={{ color: 'text.secondary', mx: 1 }}>{item.price} $</Typography>
                          </Box>
                        </Box>
                        <Typography fontWeight="bold" color="success.main">{item.price * item.quantity} $</Typography>
                      </Stack>
                    </ListItem>
                    <Divider variant="middle" />
                  </React.Fragment>
                ))
              )}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, mt: 2 }}>
              <Typography fontWeight="bold" color="primary.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptLongIcon sx={{ mr: 1 }} /> الإجمالي:
              </Typography>
              <Typography fontWeight="bold" color="success.main" sx={{ fontSize: 20 }}>{total} $</Typography>
            </Box>
            <Button variant="contained" color="success" fullWidth size="large" disabled={items.length === 0} onClick={handleConfirm} sx={{ fontWeight: 'bold', fontSize: 18 }}>
              تأكيد الطلب
            </Button>
          </>
        )}
        {orderStep === 'form' && (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
              <Typography fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>ملخص الطلب:</Typography>
              {items.map((item) => (
                <Typography key={item.id} variant="body2">{item.name} × {item.quantity} = {item.price * item.quantity} $</Typography>
              ))}
              <Typography fontWeight="bold" color="success.main" sx={{ mt: 1 }}>الإجمالي: {total} $</Typography>
            </Box>
            <Typography fontWeight="bold" sx={{ mb: 2 }}>معلومات التوصيل</Typography>
            <TextField
              label="الاسم الكامل"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="رقم الهاتف"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
              inputProps={{ inputMode: 'tel', pattern: '[0-9]*' }}
            />
            <TextField
              label="العنوان الكامل"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="ملاحظات إضافية (اختياري)"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              multiline
              minRows={2}
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Button variant="contained" color="success" type="submit" fullWidth>
              إرسال الطلب
            </Button>
            <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }} onClick={() => setOrderStep('cart')}>
              العودة للسلة
            </Button>
          </Box>
        )}
        {orderStep === 'done' && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 2 }}>تم إرسال الطلب بنجاح! سنقوم بالتواصل معك قريباً.</Alert>
            <DialogActions>
              <Button onClick={onClose}>إغلاق</Button>
              <Button onClick={handleConfirm} variant="contained" color="primary" disabled={items.length === 0}>تأكيد الطلب</Button>
            </DialogActions>
            {/* عرض ملخص آخر طلب ورد الإدارة إذا وُجد */}
            {orders && orders.length > 0 && (
              <Box sx={{ p: 2, mt: 2, background: '#f7f7f7', borderRadius: 2 }}>
                <Typography fontWeight="bold" color="primary">ملخص آخر طلب</Typography>
                <Typography>الحالة: <b style={{ color: orders[orders.length-1].status === 'تم التوصيل' ? 'green' : '#e67e22' }}>{orders[orders.length-1].status || 'قيد التنفيذ'}</b></Typography>
                {orders[orders.length-1].reply && (
                  <Typography sx={{ color: 'green' }}>رد الإدارة: {orders[orders.length-1].reply}</Typography>
                )}
              </Box>
            )}
            <Snackbar
              open={showReplySnackbar}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              onClose={() => setShowReplySnackbar(false)}
              message={lastOrder && lastOrder.reply ? `رد الإدارة: ${lastOrder.reply}` : ''}
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

export default CartDrawer;
