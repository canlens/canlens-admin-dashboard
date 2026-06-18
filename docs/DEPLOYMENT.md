# CanLens Admin — Deployment Guide

## Prerequisites

- A Google account
- Google Sheets (already in Google Drive)
- Google Apps Script (script.google.com)

---

## Step 1 — Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it **CanLens Products** (or any name you prefer).
3. In the first sheet tab, add these exact column headers in row 1:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| id | name | category | description | price | imageUrl | featured | createdAt |

4. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/THIS_IS_THE_SHEET_ID/edit
   ```

---

## Step 2 — Set Up Google Apps Script

1. Go to [script.google.com](https://script.google.com) and click **New Project**.
2. Delete the default `myFunction()` code.
3. Open `docs/google-apps-script.js` from this project and paste the entire file contents.
4. Save the project (Ctrl+S). Name it **CanLens Admin Backend**.

---

## Step 3 — Configure Script Properties

1. In the Apps Script editor, click the ⚙️ **Project Settings** (gear icon in the left sidebar).
2. Scroll down to **Script Properties** and click **Add script property**.
3. Add the following properties:

| Property | Value |
|----------|-------|
| `ADMIN_EMAIL` | Your admin email (e.g., `admin@canlens.com`) |
| `ADMIN_PASSWORD` | A strong password |
| `AUTH_TOKEN` | A long random string (e.g., paste output of a UUID generator) |
| `SHEET_ID` | The Sheet ID you copied in Step 1 |
| `SHEET_NAME` | `Products` (or the name of your sheet tab) |

> **Security Note:** Never hard-code credentials in the script. Always use Script Properties.

---

## Step 4 — Deploy as Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the ⚙️ gear icon next to "Select type" and choose **Web app**.
3. Configure:
   - **Description:** CanLens Admin API v1
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXX/exec
   ```

> Every time you make changes to the script, you must create a **new deployment** (not update an existing one) to push the changes.

---

## Step 5 — Configure the React App

1. In the `canlens-admin` project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and replace the placeholder with your Web App URL:
   ```
   VITE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```
3. Restart the dev server:
   ```bash
   npm run dev
   ```

---

## Step 6 — Google Drive Image Storage (Optional)

For storing product images in Google Drive:

1. Create a folder in Google Drive called **CanLens Products Images**.
2. Right-click the folder → **Share** → Change to **Anyone with the link** (Viewer).
3. Upload images to this folder.
4. For each image, right-click → **Share** → **Copy link**.
5. Convert the shareable link to a direct image URL:
   - Original: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   - Direct: `https://drive.google.com/uc?export=view&id=FILE_ID`
6. Paste the direct URL into the `imageUrl` field when creating/editing products.

---

## Step 7 — Test the Setup

1. Open the app in your browser: `http://localhost:5173/admin/login`
2. Enter your `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. You should be redirected to the dashboard at `/admin`.
4. Try creating a product in the Products page and verify the row appears in your Google Sheet.

---

## Architecture Notes

### Replacing the Backend

The entire API surface lives in `src/services/googleSheetsApi.js`. To swap Google Sheets for a real REST API:

1. Open `src/services/googleSheetsApi.js`
2. Replace each method's `fetch` call to point to your new API endpoints.
3. Adjust request/response shapes to match your API contract.
4. **No UI component changes required.**

### Token Authentication

- The token is generated once and stored in Script Properties as `AUTH_TOKEN`.
- After login, the token is stored in `localStorage` in the browser.
- All subsequent API calls include the token in the request body.
- To invalidate all sessions, change `AUTH_TOKEN` in Script Properties.

### Limitations of Google Apps Script

- Response time can be 1–3 seconds (cold start latency).
- No real-time updates — data is fetched on page load.
- No file upload via GAS — use Google Drive share links as image URLs.
- GAS quotas: 6 min/execution, 90 min/day total (free tier).

---

## Production Build

```bash
npm run build
```

The output is in the `dist/` folder. Deploy to:
- **Vercel:** Connect GitHub repo, set `VITE_SCRIPT_URL` as an environment variable.
- **Netlify:** Same as Vercel.
- **GitHub Pages:** Build locally, push `dist/` to `gh-pages` branch.
