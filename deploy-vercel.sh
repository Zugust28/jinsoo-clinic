#!/bin/bash
# Jinsoo Clinic Deploy Script for Vercel
# รันสคริปต์นี้เพื่อ Deploy บน Vercel (ฟรีและง่ายที่สุด)

echo "🚀 Jinsoo Clinic - Vercel Deploy Script"
echo "========================================"
echo ""

# ============ ตรวจสอบ Node.js ============
echo "📦 ตรวจสอบ Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ กรุณาติดตั้ง Node.js ก่อน (https://nodejs.org)"
    exit 1
fi
echo "✅ Node.js: $(node -v)"

# ============ ตรวจสอบ Vercel CLI ============
echo ""
echo "📦 ตรวจสอบ Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "🔧 กำลังติดตั้ง Vercel CLI..."
    npm install -g vercel
fi
echo "✅ Vercel CLI พร้อมใช้งาน"

# ============ สร้างไฟล์ vercel.json ============
echo ""
echo "📝 สร้างไฟล์ตั้งค่า Vercel..."
cat > vercel.json << 'EOF'
{
  "version": 2,
  "name": "jinsoo-clinic",
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ],
  "env": {
    "GOOGLE_SHEET_ID": "@google-sheet-id",
    "GOOGLE_CREDENTIALS": "@google-credentials",
    "SMTP_HOST": "smtp.hostinger.com",
    "SMTP_PORT": "465",
    "SMTP_USER": "zugust10@zugust.cloud",
    "SMTP_PASS": "@smtp-pass"
  }
}
EOF
echo "✅ สร้าง vercel.json แล้ว"

# ============ สร้าง .vercelignore ============
echo ""
echo "📝 สร้างไฟล์ .vercelignore..."
cat > .vercelignore << 'EOF'
node_modules
.env
.env.local
.git
README.md
*.log
EOF
echo "✅ สร้าง .vercelignore แล้ว"

# ============ ติดตั้ง Dependencies ============
echo ""
echo "📦 ติดตั้ง dependencies..."
npm install
echo "✅ ติดตั้ง dependencies เสร็จแล้ว"

# ============ แสดงคำแนะนำ ============
echo ""
echo "========================================"
echo "✅ เตรียมพร้อมสำหรับ Deploy!"
echo ""
echo "📋 ขั้นตอนถัดไป:"
echo ""
echo "1️⃣  ตั้งค่า Environment Variables บน Vercel:"
echo "   - GOOGLE_SHEET_ID: ID ของ Google Sheet"
echo "   - GOOGLE_CREDENTIALS: Service Account JSON"
echo "   - SMTP_PASS: รหัสผ่าน SMTP (Zg941331.)"
echo ""
echo "2️⃣  รันคำสั่งนี้เพื่อ Deploy:"
echo "   vercel --prod"
echo ""
echo "3️⃣  หรือรันคำสั่งนี้เพื่อทดสอบก่อน:"
echo "   vercel"
echo ""
echo "🔗  หลัง Deploy เสร็จจะได้ URL เช่น:"
echo "   https://jinsoo-clinic.vercel.app"
echo ""
echo "❓  หากยังไม่มีบัญชี Vercel:"
echo "   1. ไปที่ https://vercel.com/signup"
echo "   2. สมัครด้วย GitHub หรือ Email"
echo "   3. ยืนยันอีเมล"
echo "   4. กลับมารันคำสั่ง 'vercel' อีกครั้ง"
echo ""
echo "========================================"

# ============ ถามว่าต้องการ Deploy เลยไหม ============
echo ""
read -p "ต้องการ Deploy เลยหรือไม่? (y/n): " answer

if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    echo ""
    echo "🚀 กำลัง Deploy บน Vercel..."
    vercel --prod
else
    echo ""
    echo "💡 รันคำสั่ง 'vercel --prod' เมื่อต้องการ Deploy"
fi
