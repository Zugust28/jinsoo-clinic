// Google Apps Script for Jinsoo Clinic
// Deploy as Web App with Execute as: Me, Who has access: Anyone

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // แก้ไขเป็น Sheet ID ของคุณ

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper: Get sheet by name
function getSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(sheetName);
}

// Helper: Convert sheet data to JSON
function sheetToJson(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

// ==================== API Endpoints ====================

// GET - ดึงข้อมูล
function doGet(e) {
  const action = e.parameter.action;

  try {
    let result;

    switch(action) {
      case 'getCustomers':
        result = getCustomers();
        break;
      case 'getAppointments':
        result = getAppointments();
        break;
      case 'getAuditLogs':
        result = getAuditLogs();
        break;
      case 'syncFromExternalSheet':
        const sheetId = e.parameter.sheetId;
        result = syncFromExternalSheet(sheetId);
        break;
      default:
        result = { success: false, error: 'Unknown action' };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(corsHeaders);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(corsHeaders);
  }
}

// POST - เพิ่ม/แก้ไขข้อมูล
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  try {
    let result;

    switch(action) {
      case 'createAppointment':
        result = createAppointment(data);
        break;
      case 'updateAppointment':
        result = updateAppointment(data);
        break;
      case 'createCustomer':
        result = createCustomer(data);
        break;
      case 'createAuditLog':
        result = createAuditLog(data);
        break;
      default:
        result = { success: false, error: 'Unknown action' };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(corsHeaders);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(corsHeaders);
  }
}

// OPTIONS for CORS preflight
function doOptions() {
  return ContentService.createTextOutput('')
    .setHeaders(corsHeaders);
}

// ==================== Data Functions ====================

function getCustomers() {
  try {
    const sheet = getSheet('Customers');
    const customers = sheetToJson(sheet);
    return { success: true, customers };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function getAppointments() {
  try {
    const sheet = getSheet('Appointments');
    const appointments = sheetToJson(sheet);
    return { success: true, appointments };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function getAuditLogs() {
  try {
    const sheet = getSheet('AuditLogs');
    const logs = sheetToJson(sheet);
    return { success: true, logs };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function createCustomer(data) {
  try {
    const sheet = getSheet('Customers');
    sheet.appendRow([
      data.hn,
      data.name,
      data.phone,
      data.visitCount || 1,
      data.lastVisit || '',
      data.nickname || '',
      data.birthday || '',
      data.age || '',
      data.source || '',
      data.caretaker || '',
      data.province || '',
      data.district || '',
      data.lineUid || '',
      data.registeredDate || ''
    ]);
    return { success: true, message: 'Customer created' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function createAppointment(data) {
  try {
    const sheet = getSheet('Appointments');
    sheet.appendRow([
      data.id,
      data.hn,
      data.customerName,
      data.phone,
      data.branch,
      data.date,
      data.time,
      data.status,
      data.notes || '',
      data.createdBy,
      data.createdAt,
      data.updatedBy || '',
      data.updatedAt || ''
    ]);
    return { success: true, message: 'Appointment created' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function createAuditLog(data) {
  try {
    const sheet = getSheet('AuditLogs');
    sheet.appendRow([
      data.id,
      data.action,
      data.appointmentId,
      data.customerName,
      data.performedBy,
      data.performedAt,
      data.details,
      data.branch
    ]);
    return { success: true, message: 'Audit log created' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ==================== External Sheet Sync ====================

function syncFromExternalSheet(sheetId) {
  try {
    // Open external sheet
    const externalSS = SpreadsheetApp.openById(sheetId);
    const sheet = externalSS.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length < 2) {
      return { success: false, error: 'No data found in sheet' };
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    // Map column headers to indices
    const columnMap = {};
    headers.forEach((header, index) => {
      const normalizedHeader = header.toString().trim();
      columnMap[normalizedHeader] = index;
    });
    
    // Find required columns
    const nameCol = columnMap['ชื่อลูกค้า'] ?? columnMap['ชื่อ'] ?? columnMap['name'] ?? -1;
    const phoneCol = columnMap['มือถือ'] ?? columnMap['เบอร์โทร'] ?? columnMap['phone'] ?? -1;
    const hnCol = columnMap['Hn'] ?? columnMap['hn'] ?? columnMap['HN'] ?? -1;
    
    if (nameCol === -1 || phoneCol === -1) {
      return { success: false, error: 'Required columns not found (ชื่อลูกค้า, มือถือ)' };
    }
    
    // Optional columns
    const nicknameCol = columnMap['ชื่อเล่น'] ?? columnMap['nickname'] ?? -1;
    const birthdayCol = columnMap['วันเกิด'] ?? columnMap['birthday'] ?? -1;
    const ageCol = columnMap['อายุ'] ?? columnMap['age'] ?? -1;
    const sourceCol = columnMap['รู้จักผ่านช่องทาง'] ?? columnMap['source'] ?? -1;
    const caretakerCol = columnMap['ผู้ดูแล'] ?? columnMap['caretaker'] ?? -1;
    const provinceCol = columnMap['จังหวัด'] ?? columnMap['province'] ?? -1;
    const districtCol = columnMap['อำเภอ'] ?? columnMap['district'] ?? -1;
    const lineUidCol = columnMap['LineUID'] ?? columnMap['lineUid'] ?? -1;
    const registeredDateCol = columnMap['วันที่ลงทะเบียน'] ?? columnMap['registeredDate'] ?? -1;
    
    const customers = rows.map((row, index) => {
      return {
        hn: hnCol >= 0 ? row[hnCol] : '',
        name: row[nameCol] || '',
        phone: row[phoneCol] || '',
        nickname: nicknameCol >= 0 ? row[nicknameCol] : '',
        birthday: birthdayCol >= 0 ? row[birthdayCol] : '',
        age: ageCol >= 0 ? row[ageCol] : '',
        source: sourceCol >= 0 ? row[sourceCol] : '',
        caretaker: caretakerCol >= 0 ? row[caretakerCol] : '',
        province: provinceCol >= 0 ? row[provinceCol] : '',
        district: districtCol >= 0 ? row[districtCol] : '',
        lineUid: lineUidCol >= 0 ? row[lineUidCol] : '',
        registeredDate: registeredDateCol >= 0 ? row[registeredDateCol] : '',
        visitCount: 1,
        lastVisit: new Date().toISOString().split('T')[0]
      };
    }).filter(c => c.name && c.phone);
    
    return { success: true, customers };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}
