"use client";

import { useState, useEffect } from "react";
import { getIssuedVCs } from "@/lib/api";
import Section from "../../components/Section";
import "../globals.css";

export default function HolderPage() {
  const [vcList, setVcList] = useState([]); // รายการ VC ที่ดึงจาก API
  const [loading, setLoading] = useState(false); // สถานะการโหลด
  const [error, setError] = useState(""); // ข้อผิดพลาด

  useEffect(() => {
    const fetchVCs = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getIssuedVCs(); // ดึงข้อมูล VC
        setVcList(data); // ตั้งค่ารายการ VC
      } catch (err) {
        setError("Error fetching VC list.");
      } finally {
        setLoading(false); // เมื่อโหลดเสร็จหรือมีข้อผิดพลาดแล้ว
      }
    };
    fetchVCs(); // เรียกใช้ฟังก์ชันดึงข้อมูล VC
  }, []);

  return (
    <>
      <h1>Holder - List of Verifiable Credentials</h1>

      <Section title="ข้อมูลบัตรยืนยันตัวตน (VC)">
        {loading && <p>กำลังโหลด...</p>} {/* แสดงข้อความระหว่างการโหลด */}
        {error && !loading && <p style={{ color: "red" }}>{error}</p>} {/* ข้อความข้อผิดพลาด */}

        {vcList.length === 0 && !loading && !error && (
          <p>ไม่มีบัตรยืนยันตัวตน (VC) ที่ได้รับ</p> // เมื่อไม่มีข้อมูล
        )}

        {vcList.map((vc) => (
          <div key={vc.id} className="vc-card">
            <h2>{vc.schema}</h2>
            <p><strong>Subject ID:</strong> {vc.subjectId}</p>
            <p><strong>Expires at:</strong> {vc.expires}</p>
            <p><strong>Status:</strong> {vc.status}</p>
            <button onClick={() => alert(`Verifying VC with ID: ${vc.id}`)}>
              Verify VC
            </button>
          </div>
        ))}
      </Section>
    </>
  );
}
