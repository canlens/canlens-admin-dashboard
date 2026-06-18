/**
 * CanLens Admin — Google Apps Script Backend
 * ============================================================
 * Deploy this file as a Google Apps Script Web App.
 * Set execution to "Me" and access to "Anyone".
 *
 * Script Properties required (Project Settings → Script Properties):
 *   ADMIN_EMAIL    — admin login email
 *   ADMIN_PASSWORD — admin login password
 *   AUTH_TOKEN     — a long random string used as bearer token
 *   SHEET_ID       — Google Sheet ID (from the sheet URL)
 *   SHEET_NAME     — Sheet tab name, e.g. "Products"
 *   FOLDER_ID      — Google Drive folder ID for storing uploaded images
 *
 * Google Sheet Column Layout (Sheet: Products):
 *   A = id          B = imageId     C = imageUrl
 *   D = name        E = category    F = description
 *   G = price       H = featured    I = createdAt
 * ============================================================
 */

// ──────────────────────────────────────────────────────────
// CORS Helper
// ──────────────────────────────────────────────────────────
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonResponse(data, statusCode) {
  var code = statusCode || 200;
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ──────────────────────────────────────────────────────────
// Token Validation
// ──────────────────────────────────────────────────────────
function validateToken(token) {
  if (!token) return false;
  var stored = PropertiesService.getScriptProperties().getProperty('AUTH_TOKEN');
  return token === stored;
}

function getTokenFromRequest(e) {
  // Expect: Authorization: Bearer <token>
  var auth = e && e.headers && e.headers['Authorization'];
  if (!auth) return null;
  var parts = auth.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') return parts[1];
  return null;
}

// ──────────────────────────────────────────────────────────
// Sheet Access
// ──────────────────────────────────────────────────────────
function getSheet() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SHEET_ID');
  var sheetName = props.getProperty('SHEET_NAME') || 'Products';
  var ss = SpreadsheetApp.openById(sheetId);
  return ss.getSheetByName(sheetName);
}

// Row → object
function rowToProduct(row) {
  return {
    id: row[0] ? String(row[0]) : '',
    imageId: row[1] || '',
    imageUrl: row[2] || '',
    name: row[3] || '',
    category: row[4] || '',
    description: row[5] || '',
    price: row[6] !== undefined && row[6] !== '' ? Number(row[6]) : 0,
    featured: row[7] === true || row[7] === 'TRUE' || row[7] === 'true',
    createdAt: row[8] || '',
  };
}

function rowToAffiliateProduct(row) {
  return {
    id: row[0] ? String(row[0]) : '',
    name: row[1] || '',
    imageUrl: row[2] || '',
    productUrl: row[3] || '',
    storeName: row[4] || '',
    featured: row[5] === true || row[5] === 'TRUE' || row[5] === 'true',
    createdAt: row[6] || '',
  };
}

// ──────────────────────────────────────────────────────────
// Drive Access (Removed)
// ──────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────
// doGet — Handle GET requests
// ──────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var path = e && e.parameter && e.parameter.path ? e.parameter.path : '';
    var id = e && e.parameter && e.parameter.id ? e.parameter.id : null;

    // GET /products or GET /products?id=123
    if (path === 'products' || path === '' || path === '/products') {
      var sheet = getSheet();
      var data = sheet.getDataRange().getValues();

      // Skip header row
      var rows = data.slice(1);
      var products = rows
        .filter(function (row) { return row[0] !== ''; })
        .map(function (row) { return rowToProduct(row); });

      if (id) {
        var product = products.find(function (p) { return p.id === String(id); });
        if (!product) {
          return jsonResponse({ success: false, error: 'Product not found' }, 404);
        }
        return jsonResponse({ success: true, data: product });
      }

      return jsonResponse({ success: true, data: products, total: products.length });
    }

    // GET /affiliate-products
    if (path === 'affiliate-products') {
      var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
      var sheet = ss.getSheetByName('AffiliateProducts');
      if (!sheet) {
        return jsonResponse({ success: false, error: 'AffiliateProducts sheet not found' }, 404);
      }
      var data = sheet.getDataRange().getValues();
      var rows = data.slice(1);
      var products = rows
        .filter(function (row) { return row[0] !== ''; })
        .map(function (row) { return rowToAffiliateProduct(row); });

      if (id) {
        var product = products.find(function (p) { return p.id === String(id); });
        if (!product) {
          return jsonResponse({ success: false, error: 'Affiliate Product not found' }, 404);
        }
        return jsonResponse({ success: true, data: product });
      }

      return jsonResponse({ success: true, data: products, total: products.length });
    }

    return jsonResponse({ success: false, error: 'Not found' }, 404);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

// ──────────────────────────────────────────────────────────
// doPost — Handle POST / PUT / DELETE
// ──────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var body = {};
    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
    }

    var action = body.action || (e.parameter && e.parameter.action) || '';

    // ── POST /login ──────────────────────────────────────
    if (action === 'login') {
      var props = PropertiesService.getScriptProperties();
      var storedEmail = props.getProperty('ADMIN_EMAIL');
      var storedPassword = props.getProperty('ADMIN_PASSWORD');
      var token = props.getProperty('AUTH_TOKEN');

      if (body.email === storedEmail && body.password === storedPassword) {
        return jsonResponse({ success: true, token: token });
      }
      return jsonResponse({ success: false, error: 'Invalid credentials' }, 401);
    }

    // All other actions require auth token
    var token = body.token;
    if (!validateToken(token)) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }

    // ── POST /products — Create ──────────────────────────
    if (action === 'createProduct') {
      var sheet = getSheet();
      var newId = Utilities.getUuid();
      var now = new Date().toISOString();
      
      var finalImageId = '';
      var finalImageUrl = body.imageUrl || '';
      
      sheet.appendRow([
        newId,
        finalImageId,
        finalImageUrl,
        body.name || '',
        body.category || '',
        body.description || '',
        body.price || 0,
        body.featured ? 'TRUE' : 'FALSE',
        now,
      ]);
      return jsonResponse({
        success: true,
        data: {
          id: newId,
          imageId: finalImageId,
          imageUrl: finalImageUrl,
          name: body.name,
          category: body.category,
          description: body.description,
          price: body.price,
          featured: body.featured,
          createdAt: now,
        },
      });
    }

    // ── PUT /products — Update ───────────────────────────
    if (action === 'updateProduct') {
      if (!body.id) {
        return jsonResponse({ success: false, error: 'id is required' }, 400);
      }
      var sheet = getSheet();
      var data = sheet.getDataRange().getValues();
      var rowIndex = -1;
      var existingImageId = '';
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(body.id)) {
          rowIndex = i + 1; // 1-indexed
          existingImageId = data[i][1] || ''; // B column
          break;
        }
      }
      if (rowIndex === -1) {
        return jsonResponse({ success: false, error: 'Product not found' }, 404);
      }
      
      var finalImageId = existingImageId;
      var finalImageUrl = body.imageUrl || '';

      // Update columns B-I (imageId, imageUrl, name, category, description, price, featured)
      // Actually B is 2, C is 3, D is 4, E is 5, F is 6, G is 7, H is 8
      sheet.getRange(rowIndex, 2).setValue(finalImageId);
      sheet.getRange(rowIndex, 3).setValue(finalImageUrl);
      sheet.getRange(rowIndex, 4).setValue(body.name || '');
      sheet.getRange(rowIndex, 5).setValue(body.category || '');
      sheet.getRange(rowIndex, 6).setValue(body.description || '');
      sheet.getRange(rowIndex, 7).setValue(body.price || 0);
      sheet.getRange(rowIndex, 8).setValue(body.featured ? 'TRUE' : 'FALSE');

      return jsonResponse({ success: true, data: { id: body.id, imageId: finalImageId, imageUrl: finalImageUrl } });
    }

    // ── DELETE /products — Delete ────────────────────────
    if (action === 'deleteProduct') {
      if (!body.id) {
        return jsonResponse({ success: false, error: 'id is required' }, 400);
      }
      var sheet = getSheet();
      var data = sheet.getDataRange().getValues();
      var rowIndex = -1;
      var existingImageId = '';
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(body.id)) {
          rowIndex = i + 1;
          existingImageId = data[i][1] || '';
          break;
        }
      }
      if (rowIndex === -1) {
        return jsonResponse({ success: false, error: 'Product not found' }, 404);
      }
      
      sheet.deleteRow(rowIndex);
      return jsonResponse({ success: true, message: 'Product deleted' });
    }

    // ── Affiliate Products Actions ─────────────────────────
    function getAffiliateSheet() {
      var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
      var sheet = ss.getSheetByName('AffiliateProducts');
      if (!sheet) {
        sheet = ss.insertSheet('AffiliateProducts');
        sheet.appendRow(['id', 'name', 'imageUrl', 'productUrl', 'storeName', 'featured', 'createdAt']);
      }
      return sheet;
    }

    if (action === 'createAffiliateProduct') {
      var sheet = getAffiliateSheet();
      var newId = Utilities.getUuid();
      var now = new Date().toISOString();
      
      sheet.appendRow([
        newId,
        body.name || '',
        body.imageUrl || '',
        body.productUrl || '',
        body.storeName || '',
        body.featured ? 'TRUE' : 'FALSE',
        now,
      ]);
      return jsonResponse({
        success: true,
        data: {
          id: newId,
          name: body.name,
          imageUrl: body.imageUrl,
          productUrl: body.productUrl,
          storeName: body.storeName,
          featured: body.featured,
          createdAt: now,
        },
      });
    }

    if (action === 'updateAffiliateProduct') {
      if (!body.id) {
        return jsonResponse({ success: false, error: 'id is required' }, 400);
      }
      var sheet = getAffiliateSheet();
      var data = sheet.getDataRange().getValues();
      var rowIndex = -1;
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(body.id)) {
          rowIndex = i + 1;
          break;
        }
      }
      if (rowIndex === -1) {
        return jsonResponse({ success: false, error: 'Affiliate Product not found' }, 404);
      }
      
      sheet.getRange(rowIndex, 2).setValue(body.name || '');
      sheet.getRange(rowIndex, 3).setValue(body.imageUrl || '');
      sheet.getRange(rowIndex, 4).setValue(body.productUrl || '');
      sheet.getRange(rowIndex, 5).setValue(body.storeName || '');
      sheet.getRange(rowIndex, 6).setValue(body.featured ? 'TRUE' : 'FALSE');

      return jsonResponse({ success: true, data: { id: body.id, name: body.name } });
    }

    if (action === 'deleteAffiliateProduct') {
      if (!body.id) {
        return jsonResponse({ success: false, error: 'id is required' }, 400);
      }
      var sheet = getAffiliateSheet();
      var data = sheet.getDataRange().getValues();
      var rowIndex = -1;
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(body.id)) {
          rowIndex = i + 1;
          break;
        }
      }
      if (rowIndex === -1) {
        return jsonResponse({ success: false, error: 'Affiliate Product not found' }, 404);
      }
      
      sheet.deleteRow(rowIndex);
      return jsonResponse({ success: true, message: 'Affiliate Product deleted' });
    }

    return jsonResponse({ success: false, error: 'Unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}
