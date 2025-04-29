import React from 'react';
import { Box, Typography, TextField, Button, Paper, Stack, Avatar } from '@mui/material';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import SecuritySection from './SecuritySection';

function AdminPanel({ onAddProduct, products, onUpdateProduct, onDeleteProduct, orders, onReplyOrder, onChangeOrderStatus, onGoHome, onLogout }) {
  const [form, setForm] = React.useState({ name: '', price: '', image: '', available: true });
  const [error, setError] = React.useState('');
  const [preview, setPreview] = React.useState('');
  const [editOpen, setEditOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState(null);

  const [editPreview, setEditPreview] = React.useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({ ...prev, image: ev.target.result }));
        setPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image) {
      setError('يرجى تعبئة جميع الحقول');
      return;
    }
    setError('');
    onAddProduct({
      id: Date.now(),
      name: form.name,
      price: Number(form.price.replace(/,/g, '.')), // تحويل الفواصل إلى نقطة ثم رقم
      image: form.image,
      available: form.available,
    });
    setForm({ name: '', price: '', image: '' });
    setPreview('');
  };

  const [section, setSection] = React.useState('add'); // 'add' | 'edit' | 'orders'

  return (
    <>
      <Paper sx={{ p: { xs: 1, sm: 2 }, maxWidth: { xs: 360, sm: 700 }, mx: 'auto', mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, alignItems: 'center' }} elevation={2}>
        <Button variant={section === 'add' ? 'contained' : 'outlined'} color="primary" onClick={() => setSection('add')}>إضافة منتج جديد</Button>
        <Button variant={section === 'edit' ? 'contained' : 'outlined'} color="secondary" onClick={() => setSection('edit')}>تعديل المنتجات</Button>
        <Button variant={section === 'orders' ? 'contained' : 'outlined'} color="success" onClick={() => setSection('orders')}>الطلبات</Button>
        <Button variant={section === 'security' ? 'contained' : 'outlined'} color="warning" onClick={() => setSection('security')}>أمان</Button>
        {onLogout && (
          <Button variant="outlined" color="error" sx={{ ml: 'auto', fontWeight: 'bold' }} onClick={onLogout}>
            تسجيل خروج
          </Button>
        )}
      </Paper>
      {section === 'add' && (
        <Paper sx={{ p: 3, maxWidth: 450, mx: 'auto', mb: 4 }} elevation={4}>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            sx={{ mb: 2, fontWeight: 'bold' }}
            onClick={onGoHome}
          >
            العودة للرئيسية
          </Button>
          <Typography variant="h6" fontWeight="bold" mb={2} align="center">لوحة التحكم - إضافة منتج</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="اسم المنتج"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <TextField
                label="السعر"
                name="price"
                value={form.price}
                onChange={e => {
                  // يسمح بفواصل الألف والفاصلة العشرية
                  const value = e.target.value.replace(/[^0-9.,]/g, '');
                  setForm({ ...form, price: value });
                }}
                required
                placeholder="مثال: 1,500 أو 10.75"
              />
              <Button variant="outlined" component="label" color="primary">
                اختر صورة المنتج
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              </Button>
              {preview && (
                <Avatar src={preview} alt="صورة المنتج" variant="rounded" sx={{ width: 80, height: 80, mx: 'auto' }} />
              )}
              {/* متوفر أو غير متوفر */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography>متوفر؟</Typography>
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={e => setForm({ ...form, available: e.target.checked })}
                  style={{ transform: 'scale(1.4)' }}
                />
              </Box>
              {error && <Typography color="error" align="center">{error}</Typography>}
              <Button type="submit" variant="contained" color="primary" fullWidth>إضافة المنتج</Button>
            </Stack>
          </Box>
        </Paper>
      )}
      {section === 'edit' && (
        <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto', mb: 4 }} elevation={2}>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            sx={{ mb: 2, fontWeight: 'bold' }}
            onClick={onGoHome}
          >
            العودة للرئيسية
          </Button>
          <Typography variant="h6" fontWeight="bold" mb={2} align="center">إدارة جميع المنتجات</Typography>
          <Stack spacing={2}>
            {products && products.length > 0 ? products.map((product) => (
              <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #eee', borderRadius: 2, p: 1 }}>
                <Avatar src={product.image} alt={product.name} variant="rounded" sx={{ width: 56, height: 56 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight="bold">{product.name}</Typography>
                  <Typography color="text.secondary">{product.price} جنيه</Typography>
                </Box>
                <Button variant="outlined" color="primary" size="small" sx={{ minWidth: 0, px: 2 }} onClick={() => {
                  setEditProduct(product);
                  setEditPreview(product.image);
                  setEditOpen(true);
                }}>تعديل</Button>
                <Button variant="outlined" color="error" size="small" sx={{ minWidth: 0, px: 2 }} onClick={() => onDeleteProduct(product.id)}>حذف</Button>
              </Box>
            )) : (
              <Typography align="center" color="text.secondary">لا توجد منتجات</Typography>
            )}
          </Stack>
        </Paper>
      )}
      {section === 'orders' && (
        <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto', mb: 4 }} elevation={2}>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            sx={{ mb: 2, fontWeight: 'bold' }}
            onClick={onGoHome}
          >
            العودة للرئيسية
          </Button>
          <Typography variant="h6" fontWeight="bold" mb={2} align="center">طلبات الزبائن</Typography>
          <Stack spacing={2}>
            {orders && orders.length > 0 ? orders.map((order, idx) => (
              <OrderBox key={order.id || idx} order={order} idx={idx} onReplyOrder={onReplyOrder} onChangeOrderStatus={onChangeOrderStatus} />
            )) : <Typography align="center">لا توجد طلبات حالياً.</Typography>}
          </Stack>
        </Paper>
      )}
      {/* قسم الأمان */}
      {section === 'security' && (
        <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', mb: 4 }} elevation={4}>
          <Typography variant="h6" fontWeight="bold" mb={2} align="center" color="warning.main">إعدادات الأمان</Typography>
          <SecuritySection />
        </Paper>
      )}
      {/* نافذة تعديل المنتج */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>تعديل المنتج</DialogTitle>
        {editProduct && (
          <Box component="form" onSubmit={e => {
            e.preventDefault();
            if (!editProduct.name || !editProduct.price) return;
            onUpdateProduct({
  ...editProduct,
  price: Number((typeof editProduct.price === "string" ? editProduct.price : String(editProduct.price)).replace(/,/g, '.')),
  image: editPreview || editProduct.image,
  available: editProduct.available
});
            setEditOpen(false);
          }}>
            <DialogContent>
              <Stack spacing={2}>
                <TextField
                  label="اسم المنتج"
                  name="name"
                  value={editProduct.name}
                  onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                  required
                />
                <TextField
                  label="السعر"
                  name="price"
                  value={editProduct.price}
                  onChange={e => {
                    const value = e.target.value.replace(/[^0-9.,]/g, '');
                    setEditProduct({ ...editProduct, price: value });
                  }}
                  required
                  placeholder="مثال: 1,500 أو 10.75"
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Typography>متوفر؟</Typography>
                  <input
                    type="checkbox"
                    checked={editProduct.available}
                    onChange={e => setEditProduct({ ...editProduct, available: e.target.checked })}
                    style={{ transform: 'scale(1.4)' }}
                  />
                </Box>
                <Button variant="outlined" component="label" color="primary">
                  اختر صورة جديدة
                  <input type="file" accept="image/*" hidden onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setEditPreview(ev.target.result);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </Button>
                {editPreview && (
                  <Avatar src={editPreview} alt="صورة المنتج" variant="rounded" sx={{ width: 80, height: 80, mx: 'auto' }} />
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditOpen(false)} color="secondary">إلغاء</Button>
              <Button type="submit" variant="contained" color="primary">حفظ التغييرات</Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>
    </>
  );
}

// مكون فرعي لعرض الطلب مع إمكانية الرد
function OrderBox({ order, idx, onReplyOrder, onChangeOrderStatus }) {
  const [reply, setReply] = React.useState("");
  return (
    <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
      <Typography fontWeight="bold" color="primary.main">طلب رقم #{order.id || idx+1}</Typography>
      <Typography>المنتجات:</Typography>
      <ul style={{ margin: 0, paddingRight: 20 }}>
        {order.items.map((item, i) => (
          <li key={i}>
            {item.name} ({item.quantity})
          </li>
        ))}
      </ul>
      {order.note && <Typography color="text.secondary">ملاحظة: {order.note}</Typography>}
      {order.customer && <Typography color="text.secondary">العميل: {order.customer}</Typography>}
      <Typography sx={{ mt: 1 }}>
        الحالة: <b style={{ color: order.status === 'تم التوصيل' ? 'green' : '#e67e22' }}>{order.status || 'قيد التنفيذ'}</b>
      </Typography>
      {order.reply && (
        <Typography sx={{ mt: 1, color: 'green' }}>رد الإدارة: {order.reply}</Typography>
      )}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField
          label="رد الإدارة"
          size="small"
          value={reply}
          onChange={e => setReply(e.target.value)}
          fullWidth
          sx={{ minWidth: 200, flex: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!reply}
          onClick={() => {
            onReplyOrder(order.id, reply);
            setReply("");
          }}
        >إرسال</Button>
        <Button
          variant="outlined"
          color={order.status === 'تم التوصيل' ? 'warning' : 'success'}
          sx={{ minWidth: 120 }}
          onClick={() => onChangeOrderStatus(order.id, order.status === 'تم التوصيل' ? 'قيد التنفيذ' : 'تم التوصيل')}
        >{order.status === 'تم التوصيل' ? 'إرجاع قيد التنفيذ' : 'تأكيد التوصيل'}</Button>
      </Box>
    </Box>
  );
}

export default AdminPanel;
