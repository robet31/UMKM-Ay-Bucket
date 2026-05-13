// ============================================================
// Google Apps Script — Ay Bucket Cloud Database v2 (CORS-Fixed)
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
//
// ⚠️ PENTING: Setiap kali kode diubah, klik Deploy → Manage Deployments
//    → Edit (ikon pensil) → Version: "New version" → Deploy
// ============================================================

const SHEET_NAME = 'Data';

// ---- doGet: Handle GET requests (READ + WRITE) ----
// Browser mengirim GET request untuk baca data DAN tulis data
// Ini menghindari masalah CORS yang terjadi pada POST requests
function doGet(e) {
  const params = e.parameter || {};
  
  // Jika ada parameter "payload" (JSON string), parse dan gunakan sebagai params
  if (params.payload) {
    try {
      const parsed = JSON.parse(params.payload);
      // Merge parsed payload dengan params
      Object.keys(parsed).forEach(k => { params[k] = parsed[k]; });
    } catch(err) {
      // payload bukan JSON valid, lanjutkan dengan params biasa
    }
  }
  
  return handleRequest(params);
}

// ---- doPost: Handle POST requests (form POST + raw JSON) ----
function doPost(e) {
  try {
    var contents = e.postData.contents || '';
    var contentType = e.postData.type || '';
    var body = {};
    
    // Case 1: Form submission dari iframe (application/x-www-form-urlencoded)
    // Data dikirim sebagai: payload=<URL-encoded JSON>
    if (contentType.indexOf('form') >= 0 || contents.indexOf('payload=') === 0) {
      var parts = contents.split('&');
      for (var i = 0; i < parts.length; i++) {
        var kv = parts[i].split('=');
        if (kv[0] === 'payload' && kv.length > 1) {
          var decoded = decodeURIComponent(kv.slice(1).join('='));
          body = JSON.parse(decoded);
          break;
        }
      }
    }
    // Case 2: Raw JSON POST (fetch API)
    else {
      body = JSON.parse(contents);
    }
    
    return handleRequest(body);
  } catch (err) {
    return jsonResponse({ success: false, error: 'POST parse error: ' + err.message });
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
    // Pastikan "data" di-parse jika masih berbentuk string
    let dataToSave = params.data;
    if (typeof dataToSave === 'string') {
      try { dataToSave = JSON.parse(dataToSave); } catch(e) { /* biarkan sebagai string */ }
    }
    setData(params.key, dataToSave);
    return jsonResponse({ success: true });
  }
  
  // ---- WRITE: Simpan banyak key sekaligus ----
  if (action === 'set_bundle') {
    if (!isAuthorized(params.username || '', params.password || '')) {
      return jsonResponse({ success: false, error: 'Unauthorized' });
    }
    let payload = params.payload || {};
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch(e) { payload = {}; }
    }
    const keys = ['site_config', 'products', 'videos', 'gallery_projects'];
    keys.forEach(k => {
      if (payload[k] !== undefined) {
        setData(k, payload[k]);
      }
    });
    return jsonResponse({ success: true });
  }
  
  return jsonResponse({ success: false, error: 'Invalid action. Valid: get, get_bundle, set, set_bundle, auth' });
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
