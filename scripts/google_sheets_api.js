// ============================================================
// Google Apps Script — Ay Bucket Cloud Database
// ============================================================
// CARA SETUP:
// 1. Buka https://sheets.google.com → Buat Spreadsheet baru
// 2. Rename sheet pertama menjadi "Data" (klik 2x pada tab bawah)
// 3. Di baris 1, isi: A1="key", B1="data", C1="updated_at"
// 4. Klik Extensions → Apps Script
// 5. Hapus semua kode bawaan, lalu PASTE seluruh kode di bawah ini
// 6. Klik Deploy → New Deployment
//    - Type: Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 7. Klik Deploy → Salin URL deployment
// 8. Tambahkan URL tersebut ke Vercel Environment Variables:
//    Nama: VITE_GSHEET_API_URL
//    Nilai: https://script.google.com/macros/s/xxxxx/exec
// ============================================================

const SHEET_NAME = 'Data';

function doGet(e) {
  return handleRequest(e.parameter);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    return handleRequest(body);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function handleRequest(params) {
  const action = params.action || '';
  
  // ---- READ: Ambil satu key ----
  if (action === 'get') {
    const data = getData(params.key);
    return jsonResponse({ success: true, data: data });
  }
  
  // ---- READ: Ambil semua key sekaligus ----
  if (action === 'get_bundle') {
    const keys = ['site_config', 'products', 'videos', 'gallery_projects'];
    const bundle = {};
    keys.forEach(k => {
      const d = getData(k);
      if (d !== null) bundle[k] = d;
    });
    return jsonResponse({ success: true, data: bundle });
  }
  
  // ---- AUTH: Verifikasi login admin ----
  if (action === 'auth') {
    const ok = isAuthorized(params.username || '', params.password || '');
    return jsonResponse({ success: ok });
  }
  
  // ---- WRITE: Simpan satu key ----
  if (action === 'set') {
    if (!isAuthorized(params.username || '', params.password || '')) {
      return jsonResponse({ success: false, error: 'Unauthorized' });
    }
    setData(params.key, params.data);
    return jsonResponse({ success: true });
  }
  
  // ---- WRITE: Simpan banyak key sekaligus ----
  if (action === 'set_bundle') {
    if (!isAuthorized(params.username || '', params.password || '')) {
      return jsonResponse({ success: false, error: 'Unauthorized' });
    }
    const payload = params.payload || {};
    const keys = ['site_config', 'products', 'videos', 'gallery_projects'];
    keys.forEach(k => {
      if (payload[k] !== undefined) {
        setData(k, payload[k]);
      }
    });
    return jsonResponse({ success: true });
  }
  
  return jsonResponse({ success: false, error: 'Invalid action' });
}

// ---- Helper: Baca data dari Google Sheet ----
function getData(key) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      try {
        return JSON.parse(data[i][1]);
      } catch {
        return data[i][1];
      }
    }
  }
  return null;
}

// ---- Helper: Tulis data ke Google Sheet ----
function setData(key, value) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['key', 'data', 'updated_at']);
  }
  
  const data = sheet.getDataRange().getValues();
  const jsonStr = JSON.stringify(value);
  const now = new Date().toISOString();
  
  // Update jika key sudah ada
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(jsonStr);
      sheet.getRange(i + 1, 3).setValue(now);
      return;
    }
  }
  
  // Insert baru jika key belum ada
  sheet.appendRow([key, jsonStr, now]);
}

// ---- Helper: Validasi kredensial admin ----
function isAuthorized(username, password) {
  // Ambil kredensial dari config yang tersimpan
  const config = getData('site_config');
  let expectedUser = 'admin';
  let expectedPass = 'AyBucket2026!';
  
  if (config && config.adminUsername && config.adminPassword) {
    expectedUser = config.adminUsername;
    expectedPass = config.adminPassword;
  }
  
  return username === expectedUser && password === expectedPass;
}

// ---- Helper: Format respons JSON ----
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
