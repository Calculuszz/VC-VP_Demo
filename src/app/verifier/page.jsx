"use client";

import { useState } from "react";
import Section from "../../components/Section";
import { verifyCredentialJWT } from "@/lib/api";

export default function VerifierPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ตัวช่วย: ถ้า user วาง URL มาจะลองไปดึงเนื้อหามาเป็น JWT ให้
  async function resolveToJWT(raw) {
    const trimmed = raw.trim();

    // เคสทั่วไป: ผู้ใช้วาง JWT ตรง ๆ
    if (trimmed.split(".").length === 3) return trimmed;

    // ถ้าเป็น URL: พยายาม fetch แล้วเดาว่าเป็น text หรือ JSON {jwt: "..."}
    if (/^https?:\/\//i.test(trimmed)) {
      const r = await fetch(trimmed);
      if (!r.ok) throw new Error(`โหลดจากลิงก์ไม่สำเร็จ: ${r.status} ${r.statusText}`);

      // พยายามอ่านเป็น text ก่อน
      const ct = r.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const json = await r.json();
        if (typeof json === "string" && json.split(".").length === 3) return json;
        if (json?.jwt && json.jwt.split(".").length === 3) return json.jwt;
        throw new Error("JSON จากลิงก์ไม่ใช่ JWT หรือไม่มีฟิลด์ jwt");
      } else {
        const txt = (await r.text()).trim();
        if (txt.split(".").length === 3) return txt;
        throw new Error("เนื้อหาจากลิงก์ไม่ใช่ JWT");
      }
    }

    // เผื่อผู้ใช้วาง JSON ที่มีฟิลด์ jwt มาเลย
    try {
      const j = JSON.parse(trimmed);
      if (typeof j?.jwt === "string" && j.jwt.split(".").length === 3) return j.jwt;
    } catch (_) {
      /* not json */
    }

    // สุดท้าย: ไม่รู้จักรูปแบบ
    throw new Error("กรุณาวาง JWT แบบ JWS (header.payload.signature) หรือ URL/JSON ที่มี jwt");
  }

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const jwtString = await resolveToJWT(input);
      const data = await verifyCredentialJWT(jwtString);

      // รูปแบบรีสปอนส์จากแบ็คเอนด์ตัวอย่าง:
      // { valid: boolean, payload?: any, reason?: string }
      setResult({
        success: !!data.valid,
        reason: data.valid ? "ตรวจสอบลายเซ็นสำเร็จ" : data.reason || "ไม่ผ่านการตรวจสอบ",
        trust: data.valid ? 0.98 : 0.0, // คุณจะเปลี่ยนเป็นคะแนนจริงจากแบ็คเอนด์ก็ได้
        payload: data.payload ?? null,
      });
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Verifier</h1>
      <Section title="ตรวจสอบเอกสาร">
        <form className="form" onSubmit={verify}>
          <label>
            วาง JWT ที่ได้จาก Issuer 
            <input
              placeholder="เช่น eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRJRDo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </label>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "กำลังตรวจสอบ..." : "ตรวจสอบ"}
          </button>
        </form>

        {error && (
          <div className="card bad">
            <h3>เกิดข้อผิดพลาด</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className={`card ${result.success ? "ok" : "bad"}`}>
            <h3>{result.success ? "ผ่านการตรวจสอบ" : "ไม่ผ่านการตรวจสอบ"}</h3>
            <p>เหตุผล: {result.reason}</p>
            <p>ความเชื่อมั่น: {(result.trust * 100).toFixed(0)}%</p>

            {result.payload && (
              <>
                <hr />
                <h4>Payload ที่ถอดแล้ว</h4>
                <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>
                  {JSON.stringify(result.payload, null, 2)}
                </pre>
              </>
            )}
          </div>
        )}
      </Section>
    </>
  );
}
