# Jinsoo Clinic - ระบบจัดการนัดหมาย

ระบบจัดการนัดหมายสำหรับคลินิกเสริมความงาม Jinsoo Clinic

## 🎯 ฟีเจอร์หลัก

- **ระบบ Login** - แยกสิทธิ์แอดมิน/พนักงาน (รหัสผ่าน: `jinsoo2024`)
- **การจัดการนัดหมาย** - สร้าง/แก้ไข/ยกเลิกนัดหมาย
- **ระบบ HN** - สร้างเลขประจำตัวผู้ป่วยอัตโนมัติ (รูปแบบ: J-YYYY-XXXXX)
- **การแยกสาขา** - งามวงศ์วาน (ชมพู) / ราชเทวี (ฟ้า)
- **Audit Log** - บันทึกประวัติการทำงาน
- **ซิงค์ Google Sheets** - ดึงข้อมูลลูกค้าจาก Google Sheet

## 🎨 สีสถานะนัดหมาย

| สถานะ | สี | ความหมาย |
|-------|-----|----------|
| ใหม่ | 🔵 ฟ้า | new |
| คอนเฟิร์ม | 🟡 เหลือง | confirmed |
| มาถึง | 🟣 ม่วง | arrived |
| เสร็จสิ้น | 🟢 เขียว | completed |
| ยกเลิก | ⚪ เทา | cancelled |
| รอตอบ | 🩷 ชมพู | pending_reply |
| ปัญหา | 🔴 แดง | problem |

## 🚀 การ Deploy บน GitHub Pages

### ขั้นตอนที่ 1: สร้าง Repository บน GitHub

1. ไปที่ [GitHub](https://github.com)
2. สร้าง Repository ใหม่ชื่อ `jinsoo-clinic`
3. ตั้งค่าให้เป็น Public

### ขั้นตอนที่ 2: Push โค้ดขึ้น GitHub

```bash
# ในโฟลเดอร์โปรเจค
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jinsoo-clinic.git
git push -u origin main
```

### ขั้นตอนที่ 3: ตั้งค่า GitHub Pages

1. ไปที่ Settings > Pages
2. Source: เลือก "GitHub Actions"

### ขั้นตอนที่ 4: รอการ Deploy

GitHub Actions จะทำการ Build และ Deploy อัตโนมัติ

เข้าใช้งานได้ที่: `https://YOUR_USERNAME.github.io/jinsoo-clinic/`

## 🔧 การตั้งค่า Google Sheets

### 1. สร้าง Google Sheet หลัก

- ไปที่ [Google Sheets](https://sheets.new)
- สร้าง Sheet ใหม่ชื่อ "Jinsoo Clinic Database"
- สร้าง 3 Sheets ย่อย:
  - `Customers` - เก็บข้อมูลลูกค้า
  - `Appointments` - เก็บข้อมูลนัดหมาย
  - `AuditLogs` - เก็บประวัติการทำงาน

### 2. สร้าง Google Apps Script

- ใน Sheet ไปที่ Extensions > Apps Script
- ลบโค้ดเดิม แล้ววางโค้ดจาก `google-apps-script/Code.gs`
- แก้ไข `SHEET_ID` เป็น Sheet ID ของคุณ

### 3. Deploy Web App

- คลิก Deploy > New deployment
- เลือก Type: Web app
- Execute as: Me
- Who has access: Anyone
- คัดลอก URL มาใส่ใน `src/services/googleSheetsApi.ts`

### 4. หัวตารางที่รองรับสำหรับซิงค์

```
วันที่ลงทะเบียน | Hn | ชื่อลูกค้า | นามสกุล | ชื่อ-สกุล | ชื่อเล่น | มือถือ | วันเกิด | อายุ | รู้จักผ่านช่องทาง | ผู้ดูแล | จังหวัด | อำเภอ | LineUID
```

## 🛠️ การพัฒนาในเครื่อง

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# Build สำหรับ production
npm run build

# Preview production build
npm run preview
```

## 📝 เทคโนโลยีที่ใช้

- React 18
- TypeScript
- Vite
- Tailwind CSS
- date-fns
- lucide-react

## 👥 ผู้ใช้งานเริ่มต้น

| ผู้ใช้ | บทบาท |
|--------|-------|
| แอดมิน 1 | admin |
| แอดมิน 2 | admin |
| พนักงานต้อนรับ 1 | staff |
| พนักงานต้อนรับ 2 | staff |

**รหัสผ่าน:** `jinsoo2024`

## 📄 License

MIT License
