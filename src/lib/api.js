// src/lib/api.js
const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "https://backend-vc-vpdemo-production.up.railway.app").replace(/\/$/, "");

// ตั้งค่า path ผ่าน ENV ให้ยืดหยุ่นกับ prefix ใน FastAPI
// ตัวอย่างค่าเริ่มต้นตามโค้ดแบ็กเอนด์ที่ include_router(prefix="/verifier")
const VERIFY_PATH =
  (process.env.NEXT_PUBLIC_VERIFY_PATH || "/verifier/verify").replace(/\/{2,}/g, "/");
const ISSUE_PATH =
  (process.env.NEXT_PUBLIC_ISSUE_PATH || "/issuer/credentials").replace(/\/{2,}/g, "/");

// helper รวม error-handling + แปลง JSON
async function apiFetch(path, init) {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });

  // พยายามอ่าน body เป็น text ก่อน เพื่อโชว์ข้อความ error ได้ครบ
  const bodyText = await res.text().catch(() => "");
  let data = null;
  try {
    data = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    // ไม่ใช่ JSON ก็ปล่อยเป็น null
  }

  if (!res.ok) {
    // โยนข้อความละเอียดขึ้น (เช่น {"detail":"Not Found"})
    const detail = data?.detail || data?.message || bodyText || res.statusText;
    throw new Error(`HTTP ${res.status} ${detail}`);
  }

  return data;
}

// === Public APIs ===

// ออกเอกสาร (issuer)
export async function issueCredential(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("issueCredential: payload ต้องเป็น object");
  }
  return apiFetch(ISSUE_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ตรวจสอบเอกสาร (verifier) — ส่ง JWT ไปให้แบ็คเอนด์ตรวจ
export async function verifyCredential(jwtString) {
  const jwt = String(jwtString || "").trim();
  if (!jwt) throw new Error("verifyCredential: กรุณาส่ง JWT");

  return apiFetch(VERIFY_PATH, {
    method: "POST",
    body: JSON.stringify({ jwt }),
  });
}

// (ถ้าหน้าเดิม import ชื่อ verifyCredentialJWT อยู่ ให้ export alias ไว้)
export const verifyCredentialJWT = verifyCredential;

export async function getIssuedVCs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/holder/credentials`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch VC list");
  return res.json();
}
