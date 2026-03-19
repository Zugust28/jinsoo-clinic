const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Google Sheets Setup
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Email SMTP Setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_USER || 'zugust10@zugust.cloud',
    pass: process.env.SMTP_PASS || '',
  },
});

// Helper function to send email
async function sendAppointmentEmail(to, subject, htmlContent) {
  try {
    const info = await transporter.sendMail({
      from: `"Jinsoo Clinic" <${process.env.SMTP_USER || 'zugust10@zugust.cloud'}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Generate email HTML template
function generateAppointmentEmail(appointment, type = 'confirmation') {
  const BRANCH_NAMES = {
    'ngamwongwan': 'สาขางามวงศ์วาน',
    'ratchathewi': 'สาขาราชเทวี'
  };
  
  const STATUS_NAMES = {
    'new': 'นัดใหม่',
    'confirmed': 'คอนเฟิร์มแล้ว',
    'arrived': 'ลูกค้ามาถึง',
    'completed': 'เสร็จสิ้น',
    'cancelled': 'ยกเลิก',
    'waiting': 'รอตอบ',
    'problem': 'มีปัญหา'
  };
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };
  
  let title, message, color;
  
  switch(type) {
    case 'confirmation':
      title = 'ยืนยันการนัดหมาย';
      message = 'ขอบคุณที่นัดหมายกับ Jinsoo Clinic เรายืนยันการนัดหมายของคุณเรียบร้อยแล้ว';
      color = '#3B82F6';
      break;
    case 'reminder':
      title = 'แจ้งเตือนการนัดหมาย';
      message = 'นี่คือการแจ้งเตือนการนัดหมายของคุณที่จะถึงในเร็วๆ นี้';
      color = '#EAB308';
      break;
    case 'cancellation':
      title = 'การนัดหมายถูกยกเลิก';
      message = 'การนัดหมายของคุณถูกยกเลิกแล้ว';
      color = '#9CA3AF';
      break;
    default:
      title = 'ข้อมูลการนัดหมาย';
      message = 'รายละเอียดการนัดหมายของคุณ';
      color = '#3B82F6';
  }
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Prompt', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${color}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .detail-row { display: flex; margin-bottom: 15px; }
    .detail-label { font-weight: 600; width: 120px; color: #6b7280; }
    .detail-value { flex: 1; color: #111827; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Jinsoo Clinic</div>
      <h2>${title}</h2>
    </div>
    <div class="content">
      <p>เรียน คุณ${appointment.customerName},</p>
      <p>${message}</p>
      
      <h3 style="color: ${color}; margin-top: 25px;">รายละเอียดการนัดหมาย</h3>
      
      <div class="detail-row">
        <div class="detail-label">ชื่อ:</div>
        <div class="detail-value">${appointment.customerName}</div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">สาขา:</div>
        <div class="detail-value">${BRANCH_NAMES[appointment.branch] || appointment.branch}</div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">บริการ:</div>
        <div class="detail-value">${appointment.service}</div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">วันที่:</div>
        <div class="detail-value">${formatDate(appointment.date)}</div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">เวลา:</div>
        <div class="detail-value">${appointment.time} น.</div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">สถานะ:</div>
        <div class="detail-value">${STATUS_NAMES[appointment.status] || appointment.status}</div>
      </div>
      
      ${appointment.notes ? `
      <div class="detail-row">
        <div class="detail-label">หมายเหตุ:</div>
        <div class="detail-value">${appointment.notes}</div>
      </div>
      ` : ''}
      
      <div class="footer">
        <p>หากมีข้อสงสัย กรุณาติดต่อ Jinsoo Clinic</p>
        <p>โทร: 02-XXX-XXXX | อีเมล: zugust10@zugust.cloud</p>
        <p style="margin-top: 20px; font-size: 12px;">© 2026 Jinsoo Clinic. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Status Colors Mapping
const STATUS_COLORS = {
  'new': { name: 'นัดใหม่', color: '#3B82F6', bg: 'bg-blue-500' },           // ฟ้า
  'confirmed': { name: 'คอนเฟิร์มแล้ว', color: '#EAB308', bg: 'bg-yellow-500' }, // เหลือง
  'arrived': { name: 'ลูกค้ามาถึง', color: '#A855F7', bg: 'bg-purple-500' },     // ม่วง
  'completed': { name: 'เสร็จสิ้น', color: '#22C55E', bg: 'bg-green-500' },      // เขียว
  'cancelled': { name: 'ยกเลิก', color: '#9CA3AF', bg: 'bg-gray-400' },          // เทา
  'waiting': { name: 'รอตอบ', color: '#EC4899', bg: 'bg-pink-500' },            // ชมพู
  'problem': { name: 'มีปัญหา', color: '#EF4444', bg: 'bg-red-500' },            // แดง
};

// ============ API Routes ============

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Appointments!A:L',
    });
    
    const rows = response.data.values || [];
    if (rows.length === 0) {
      return res.json({ appointments: [] });
    }
    
    // Skip header row
    const appointments = rows.slice(1).map((row, index) => ({
      id: row[0] || '',
      customerName: row[1] || '',
      phone: row[2] || '',
      branch: row[3] || '',
      service: row[4] || '',
      date: row[5] || '',
      time: row[6] || '',
      status: row[7] || 'new',
      staff: row[8] || '',
      notes: row[9] || '',
      createdAt: row[10] || '',
      updatedAt: row[11] || '',
      rowIndex: index + 2, // For updates
    }));
    
    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Create appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { customerName, phone, branch, service, date, time, status, staff, notes, sendEmail, email } = req.body;

    const id = 'APT-' + Date.now();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const values = [[id, customerName, phone, branch, service, date, time, status || 'new', staff, notes, createdAt, updatedAt]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Appointments!A:L',
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    // Log the change
    await logChange('CREATE', id, staff, { customerName, service, date, time, status: status || 'new' });

    // Send confirmation email if requested and email is provided
    let emailResult = null;
    if (sendEmail && email) {
      const appointment = { id, customerName, phone, branch, service, date, time, status: status || 'new', notes };
      const emailHtml = generateAppointmentEmail(appointment, 'confirmation');
      emailResult = await sendAppointmentEmail(email, 'ยืนยันการนัดหมาย - Jinsoo Clinic', emailHtml);
    }

    res.json({ success: true, id, message: 'Appointment created', emailSent: emailResult });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, phone, branch, service, date, time, status, staff, notes } = req.body;
    
    // Find the row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Appointments!A:L',
    });
    
    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === id);
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const updatedAt = new Date().toISOString();
    const values = [[id, customerName, phone, branch, service, date, time, status, staff, notes, rows[rowIndex][10], updatedAt]];
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Appointments!A${rowIndex + 1}:L${rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });
    
    // Log the change
    await logChange('UPDATE', id, staff, { customerName, branch, service, date, time, status });
    
    res.json({ success: true, message: 'Appointment updated' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete/Cancel appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { staff } = req.body;
    
    // Find the row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Appointments!A:K',
    });
    
    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === id);
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Update status to cancelled instead of deleting
    const updatedAt = new Date().toISOString();
    rows[rowIndex][6] = 'cancelled';
    rows[rowIndex][10] = updatedAt;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Appointments!A${rowIndex + 1}:K${rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [rows[rowIndex]] },
    });
    
    // Log the change
    await logChange('CANCEL', id, staff, { reason: 'Cancelled by staff' });
    
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

// Get change logs
app.get('/api/logs', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Logs!A:F',
    });
    
    const rows = response.data.values || [];
    if (rows.length === 0) {
      return res.json({ logs: [] });
    }
    
    const logs = rows.slice(1).map(row => ({
      timestamp: row[0] || '',
      action: row[1] || '',
      appointmentId: row[2] || '',
      staff: row[3] || '',
      details: row[4] || '',
    })).reverse(); // Newest first
    
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Helper function to log changes
async function logChange(action, appointmentId, staff, details) {
  try {
    const timestamp = new Date().toISOString();
    const values = [[timestamp, action, appointmentId, staff, JSON.stringify(details)]];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Logs!A:E',
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });
  } catch (error) {
    console.error('Error logging change:', error);
  }
}

// Status colors endpoint
app.get('/api/status-colors', (req, res) => {
  res.json({ colors: STATUS_COLORS });
});

// Start server
app.listen(PORT, () => {
  console.log(`Jinsoo Clinic API running on port ${PORT}`);
});
