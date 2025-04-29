import React from "react";
import { Box, Typography, TextField, Button, MenuItem, Snackbar } from "@mui/material";

const sectionNames = [
  { value: "adminpanel", label: "لوحة التحكم" },
  { value: "add", label: "إضافة منتج جديد" },
  { value: "edit", label: "تعديل المنتجات" },
  { value: "orders", label: "الطلبات" },
];

export default function SecuritySection() {
  const [targetSection, setTargetSection] = React.useState("add");
  const [password, setPassword] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  // كلمة السر الحالية للقسم المختار
  const [currentPassword, setCurrentPassword] = React.useState("");

  React.useEffect(() => {
    // تحميل كلمة السر الحالية للقسم المختار
    const saved = localStorage.getItem("security_" + targetSection) || "";
    setCurrentPassword(saved);
    setPassword("");
    setOldPassword("");
  }, [targetSection]);

  const handleSave = () => {
    if (currentPassword && oldPassword !== currentPassword) {
      setError("كلمة السر القديمة غير صحيحة!");
      setShowError(true);
      return;
    }
    localStorage.setItem("security_" + targetSection, password);
    setSuccess(true);
    setError("");
    setOldPassword("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <TextField
        select
        label="اختر القسم المطلوب"
        value={targetSection}
        onChange={e => setTargetSection(e.target.value)}
        fullWidth
      >
        {sectionNames.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>
      {currentPassword && (
        <TextField
          label="كلمة السر القديمة"
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          fullWidth
          placeholder="ادخل كلمة السر القديمة"
        />
      )}
      <TextField
        label="كلمة السر الجديدة لهذا القسم"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        placeholder="ادخل كلمة سر قوية"
      />
      <Button variant="contained" color="warning" onClick={handleSave} sx={{ fontWeight: "bold" }}>
        حفظ كلمة السر
      </Button>
      <Snackbar
        open={success}
        autoHideDuration={1800}
        onClose={() => setSuccess(false)}
        message="تم حفظ كلمة السر بنجاح!"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{ sx: { bgcolor: "#ffa726", color: "#fff", fontWeight: "bold", fontSize: 16, borderRadius: 2 } }}
      />
      <Snackbar
        open={showError}
        autoHideDuration={1800}
        onClose={() => setShowError(false)}
        message={error}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{ sx: { bgcolor: "#e53935", color: "#fff", fontWeight: "bold", fontSize: 16, borderRadius: 2 } }}
      />
    </Box>
  );
}
