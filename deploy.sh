#!/bin/bash
# Jinsoo Clinic Deploy Script for Hostinger
# รันสคริปต์นี้บนเซิร์ฟเวอร์ Hostinger

echo "🚀 เริ่มต้น Deploy Jinsoo Clinic..."

# ============ ตั้งค่า ============
APP_NAME="jinsoo-clinic"
DOMAIN="zugust.cloud"
APP_DIR="/home/$USER/$APP_NAME"
NODE_VERSION="18"

# ============ ตรวจสอบ Node.js ============
echo "📦 ตรวจสอบ Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ไม่พบ กำลังติดตั้ง..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# ============ สร้างโฟลเดอร์ ============
echo "📁 สร้างโฟลเดอร์แอป..."
mkdir -p $APP_DIR
cd $APP_DIR

# ============ สร้างไฟล์ package.json ============
echo "📝 สร้าง package.json..."
cat > package.json << 'EOF'
{
  "name": "jinsoo-clinic",
  "version": "1.0.0",
  "description": "Appointment system for Jinsoo Clinic",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["clinic", "appointment", "booking"],
  "author": "Jinsoo Clinic",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "googleapis": "^171.4.0"
  }
}
EOF

# ============ ติดตั้ง Dependencies ============
echo "📦 ติดตั้ง dependencies..."
npm install

# ============ สร้างไฟล์ .env ============
echo "🔐 สร้างไฟล์ .env..."
echo "⚠️  กรุณาแก้ไขไฟล์ .env ด้วยข้อมูลจริงของคุณ"
cat > .env << 'EOF'
PORT=3000
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
EOF

echo ""
echo "⚠️  คำเตือน: กรุณาแก้ไขไฟล์ .env ด้วยข้อมูลจริง:"
echo "   - GOOGLE_SHEET_ID: ID ของ Google Sheet"
echo "   - GOOGLE_CREDENTIALS: Service Account JSON"
echo ""

echo "✅ Deploy Script สร้างเสร็จแล้ว!"
echo ""
echo "📋 ขั้นตอนถัดไป:"
echo "1. แก้ไขไฟล์ .env ด้วยข้อมูลจริง"
echo "2. รัน: npm start"
echo "3. ตั้งค่า Nginx/Apache เป็น Reverse Proxy ไปที่พอร์ต 3000"
echo "4. ตั้งค่า SSL สำหรับ $DOMAIN"
