import React from 'react';
import { Container, Typography, AppBar, Toolbar, Badge, IconButton, Button, Snackbar } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import AdminPanelLogin from './components/AdminPanelLogin';
import { TextField } from '@mui/material';
import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

function App() {
  // حماية لوحة التحكم
  const [adminLogged, setAdminLogged] = React.useState(false);
  const adminPassword = localStorage.getItem('security_adminpanel') || '';
  // حالة البحث
  const [searchQuery, setSearchQuery] = React.useState("");
  // متغيرات الحالة الرئيسية
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState([]);
  const [tab, setTab] = React.useState(0);
  const [products, setProducts] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  // متغيرات الإشعار السحابي
  const [showCloudReply, setShowCloudReply] = React.useState(false);
  const [lastReply, setLastReply] = React.useState(null);
  const lastOrder = orders && orders.length > 0 ? orders[orders.length-1] : null;

  // جلب المنتجات والطلبات من Firestore بشكل لحظي
  React.useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, []);

  // إشعار غيمة الرد في الرئيسية
  React.useEffect(() => {
    if (lastOrder && lastOrder.reply && lastOrder.reply !== lastReply) {
      setShowCloudReply(true);
      setLastReply(lastOrder.reply);
      setTimeout(() => setShowCloudReply(false), 3000);
    }
    // eslint-disable-next-line
  }, [lastOrder && lastOrder.reply]);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // دوال التحكم
  const handleCartToggle = () => setCartOpen((open) => !open);
  const handleTabChange = (value) => setTab(value);
  const handleAddProduct = async (product) => {
    await addDoc(collection(db, 'products'), product);
  };
  const handleAddOrder = async (order) => {
    await addDoc(collection(db, 'orders'), {
      ...order,
      status: 'قيد التنفيذ',
      createdAt: Date.now(),
    });
    setCartItems([]); // تفريغ السلة بعد الطلب
  };


  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* إشعار الغيمة أعلى القائمة */}
          <Snackbar
            open={showCloudReply && tab === 0}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={() => setShowCloudReply(false)}
            message={lastOrder && lastOrder.reply ? (<span style={{display:'flex',alignItems:'center',gap:8}}><CloudIcon style={{verticalAlign:'middle',color:'#1976d2'}}/> <b>رد الإدارة:</b> {lastOrder.reply}</span>) : ''}
            ContentProps={{
              sx: {
                bgcolor: '#fff',
                color: '#1976d2',
                fontWeight: 'bold',
                boxShadow: 3,
                borderRadius: 2,
                border: '1px solid #1976d2',
                minWidth: 260,
                justifyContent: 'center',
              },
            }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            سوبر ماركت التوصيل السريع
          </Typography>
          <Button color={tab === 0 ? 'secondary' : 'inherit'} onClick={() => handleTabChange(0)} sx={{ fontWeight: 'bold', mr: 2 }}>
            الرئيسية
          </Button>
          <Button color={tab === 1 ? 'secondary' : 'inherit'} onClick={() => handleTabChange(1)} sx={{ fontWeight: 'bold', mr: 2 }}>
            لوحة التحكم
          </Button>
          <IconButton color="inherit" onClick={handleCartToggle}>
            <Badge badgeContent={cartItems.reduce((a, i) => a + i.quantity, 0)} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      {tab === 0 && (
        <>
          <Container sx={{ mt: 4 }}>
            {/* مربع البحث عن المنتجات */}
            <TextField
              label="ابحث عن منتج..."
              variant="outlined"
              fullWidth
              sx={{ mb: 3 }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <ProductGrid onAddToCart={handleAddToCart} products={products.filter(p => {
  const q = searchQuery.toLowerCase();
  return (
    p.name.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q)) ||
    String(p.price).includes(q)
  );
})} />
          </Container>
          <CartDrawer 
            open={cartOpen}
            onClose={handleCartToggle}
            items={cartItems}
            onRemoveItem={(id) => setCartItems((prev) => prev.filter((item) => item.id !== id))}
            onChangeQuantity={(id, delta) => setCartItems((prev) => prev.map((item) => item.id === id ? {...item, quantity: Math.max(1, item.quantity + delta)} : item))}
            onConfirmOrder={handleAddOrder}
            orders={orders}
          />
        </>
      )}
      {(tab === 1) && (
        (adminPassword && !adminLogged)
          ? <AdminPanelLogin onLogin={() => setAdminLogged(true)} />
            : <AdminPanel
                onAddProduct={handleAddProduct}
                products={products}
                onUpdateProduct={async (prod) => {
                  const { id, ...data } = prod;
                  await updateDoc(doc(db, 'products', id), data);
                }}
                onDeleteProduct={async (id) => {
                  await deleteDoc(doc(db, 'products', id));
                }}
                orders={orders}
                onReplyOrder={async (orderId, reply) => {
                  await updateDoc(doc(db, 'orders', orderId), { reply });
                  setShowCloudReply(true);
                  setTimeout(() => {
                    setShowCloudReply(false);
                  }, 3000);
                }}
                onChangeOrderStatus={async (orderId, status) => {
                  await updateDoc(doc(db, 'orders', orderId), { status });
                }}
                onGoHome={() => setTab(0)}
                onLogout={() => setAdminLogged(false)}
              />
      )}
    </>
  );
}

export default App;
