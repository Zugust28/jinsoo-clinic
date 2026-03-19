# Google Sheet Setup for Jinsoo Clinic

## ขั้นตอนที่ 1: สร้าง Google Sheet

1. ไปที่ https://sheets.new
2. สร้าง Sheet ใหม่ชื่อ "Jinsoo Clinic Appointments"
3. เปลี่ยนการแชร์เป็น "Anyone with the link can view"

## ขั้นตอนที่ 2: สร้าง Sheets

### Sheet 1: Appointments
คลิกขวาที่แท็บ "Sheet1" → Rename เป็น "Appointments"

เพิ่มหัวตารางในแถวที่ 1:
```
A: ID
B: CustomerName
C: Phone
D: Branch
E: Service
F: Date
G: Time
H: Status
I: Staff
J: Notes
K: CreatedAt
L: UpdatedAt
```

### Sheet 2: Logs
คลิกเครื่องหมาย + (Add Sheet) → ตั้งชื่อ "Logs"

เพิ่มหัวตารางในแถวที่ 1:
```
A: Timestamp
B: Action
C: AppointmentID
D: Staff
E: Details
```

### Sheet 3: Users
คลิกเครื่องหมาย + (Add Sheet) → ตั้งชื่อ "Users"

เพิ่มหัวตารางในแถวที่ 1:
```
A: Username
B: Password (แนะนำให้ใช้ hash ในอนาคต)
C: Role
D: Name
```

เพิ่มข้อมูลผู้ใช้ตัวอย่าง:
```
A: admin
B: jinsoo2024
C: admin
D: แอดมิน
```

## ขั้นตอนที่ 3: สร้าง Service Account

1. ไปที่ https://console.cloud.google.com/
2. เลือก Project ที่ใช้กับ gog (หรือสร้างใหม่)
3. ไปที่ **IAM & Admin** → **Service Accounts**
4. คลิก **Create Service Account**
5. ตั้งชื่อ: `jinsoo-clinic-sa`
6. คลิก **Create and Continue**
7. Role: เลือก **Editor** (หรือสร้าง custom role ที่มีสิทธิ์ Google Sheets)
8. คลิก **Done**

## ขั้นตอนที่ 4: สร้าง Key

1. คลิกที่ Service Account ที่สร้าง
2. ไปที่แท็บ **Keys**
3. คลิก **Add Key** → **Create New Key**
4. เลือก **JSON** → คลิก **Create**
5. ไฟล์ JSON จะดาวน์โหลดอัตโนมัติ (เก็บไว้อย่างปลอดภัย)

## ขั้นตอนที่ 5: แชร์ Sheet กับ Service Account

1. เปิด Google Sheet ที่สร้าง
2. คลิก **Share** (ปุ่มมุมขวาบน)
3. ใส่ email ของ Service Account (ดูจากไฟล์ JSON ที่ดาวน์โหลด, จะอยู่ใน field `client_email`)
4. ตั้งสิทธิ์เป็น **Editor**
5. คลิก **Share**

## ขั้นตอนที่ 6: เก็บข้อมูลสำหรับ .env

จากไฟล์ JSON ที่ดาวน์โหลด เก็บค่าต่อไปนี้:

```bash
# .env file
GOOGLE_SHEET_ID=<Sheet ID จาก URL>
GOOGLE_CREDENTIALS=<เนื้อหาไฟล์ JSON ทั้งหมด>
```

Sheet ID คือส่วนนี้ของ URL:
`https://docs.google.com/spreadsheets/d/`**`1ABC123xyz...`**`/edit`

## ขั้นตอนที่ 7: Enable Google Sheets API

1. ไปที่ https://console.cloud.google.com/apis/library
2. ค้นหา "Google Sheets API"
3. คลิก **Enable**

---

หลังจากตั้งค่าเสร็จ รันแอปด้วย:
```bash
npm start
```
