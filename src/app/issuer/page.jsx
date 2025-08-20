"use client";

import { useState } from "react";
import Section from "../../components/Section";
import { issueCredential } from "@/lib/api";

export default function IssuerPage() {
  const [form, setForm] = useState({
    subjectId: "",
    schema: "HealthPass",
    expires: "",          // YYYY-MM-DD หรือปล่อยว่างได้
    name: "",             // ตัวอย่าง claim
  });

  const [issued, setIssued] = useState(null);   // { id, jwt, ... }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIssued(null);
    setLoading(true);

    try {
      // map form -> payload ที่ backend คาดหวัง
      const payload = {
        subject_id: form.subjectId,
        schema: form.schema,
        // ส่งเฉพาะเมื่อมีวันหมดอายุ (แล้วแต่ backend คุณจะรองรับ key อะไร)
        ...(form.expires && { expires_at: `${form.expires}T23:59:59Z` }),
        claims: {
          name: form.name || "Demo",
          ok: true,
        },
      };

      const res = await issueCredential(payload); // POST /issuer/credentials
      // สมมติ backend ตอบ { id, jwt, ... }
      setIssued(res);
    } catch (err) {
      setError(err?.message || "Issue failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Issuer</h1>

      <Section title="ออกเอกสารรับรอง (VC)">
        <form className="form" onSubmit={submit}>
          <label>
            Subject DID
            <input
              required
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              placeholder="เช่น did:key:z6Mk..."
            />
          </label>

          <label>
            Schema
            <select
              value={form.schema}
              onChange={(e) => setForm({ ...form, schema: e.target.value })}
            >
              <option>HealthPass</option>
              <option>StudentCard</option>
              <option>EmployeeID</option>
            </select>
          </label>

          <label>
            ชื่อ (claim: name)
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="เช่น Demo User"
            />
          </label>

          <label>
            วันหมดอายุ (ถ้ามี)
            <input
              type="date"
              value={form.expires}
              onChange={(e) => setForm({ ...form, expires: e.target.value })}
            />
          </label>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "กำลังออกเอกสาร..." : "ออกเอกสาร"}
          </button>
        </form>

        {error && (
          <div className="card" style={{ color: "crimson" }}>
            <strong>เกิดข้อผิดพลาด:</strong> {error}
          </div>
        )}

        {issued && (
          <div className="card">
            <h3>ออกเอกสารสำเร็จ</h3>
            {"id" in issued && <p><b>ID:</b> {issued.id}</p>}
            {"jwt" in issued && (
              <>
                <p><b>JWT:</b></p>
                <textarea readOnly value={issued.jwt} rows={6} style={{ width: "100%" }} />
              </>
            )}
            <pre>{JSON.stringify(issued, null, 2)}</pre>
          </div>
        )}
      </Section>
    </>
  );
}
