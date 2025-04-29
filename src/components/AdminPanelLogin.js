import React from "react";
import { Box, Typography, TextField, Button, Paper, Snackbar } from "@mui/material";

export default function AdminPanelLogin({ onLogin }) {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const saved = localStorage.getItem("security_adminpanel") || "";
    if (!saved || password === saved) {
      setError("");
      onLogin();
    } else {
      setError("كلمة السر غير صحيحة!");
      setShowError(true);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 350, mx: "auto", mt: 8 }} elevation={6}>
      <Typography variant="h6" fontWeight="bold" mb={2} align="center">تسجيل دخول لوحة التحكم</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="كلمة السر"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: "bold" }}>
          دخول
        </Button>
      </Box>
      <Snackbar
        open={showError}
        autoHideDuration={2000}
        onClose={() => setShowError(false)}
        message={error}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{ sx: { bgcolor: "#e53935", color: "#fff", fontWeight: "bold", fontSize: 16, borderRadius: 2 } }}
      />
    </Paper>
  );
}
