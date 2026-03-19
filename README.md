# Jinsoo Clinic - Appointment System

ระบบนัดหมายสำหรับคลินิกเสริมความงาม

## 🚀 เริ่มต้นใช้งาน

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Google Sheet
ทำตามคำแนะนำใน `GOOGLE_SHEET_SETUP.md`

### 3. สร้างไฟล์ .env
```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:
```env
PORT=3000
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_CREDENTIALS={"type":"service_account",...}
```

### 4. รันแอป
```bash
npm start
```

เข้าใช้งานที่: http://localhost:3000

## 🎨 สีนัดหมาย

| สี | สถานะ |
|---|--------|
| 🔵 ฟ้า | นัดใหม่ |
| 🟡 เหลือง | คอนเฟิร์มแล้ว |
| 🟣 ม่วง | ลูกค้ามาถึง |
| 🟢 เขียว | เสร็จสิ้น |
| ⚪ เทา | ยกเลิก |
| 🩷 ชมพู | รอตอบ |
| 🔴 แดง | มีปัญหา |

## 👥 ผู้ใช้งาน

- **แอดมิน**: จัดการนัดหมายทั้งหมด
- **พนักงาน**: สร้าง/แก้ไข/ยกเลิกนัด

รหัสผ่านเริ่มต้น: `jinsoo2024`

## 📝 API Endpoints

- `GET /api/appointments` - ดึงนัดหมายทั้งหมด
- `POST /api/appointments` - สร้างนัดใหม่
- `PUT /api/appointments/:id` - แก้ไขนัด
- `DELETE /api/appointments/:id` - ยกเลิกนัด
- `GET /api/logs` - ดูประวัติการเปลี่ยนแปลง
- `GET /api/status-colors` - ดูสีสถานะ

## 🌐 Deploy บน Hostinger

1. อัปโหลดไฟล์ทั้งหมดไปยัง Hostinger (ผ่าน FTP หรือ File Manager)
2. ติดตั้ง Node.js บน Hostinger
3. ตั้งค่า Environment Variables
4. รันแอปด้วย PM2 หรือตั้งค่าเป็น Service

```bash
# ติดตั้ง PM2
npm install -g pm2

# รันแอป
pm2 start server.js --name jinsoo-clinic

# บันทึก config
pm2 save
pm2 startup
```
