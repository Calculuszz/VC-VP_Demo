"use client";
import { useState } from "react";
import Section from "../../components/Section";
import QRCard from "../../components/QRCard";

export default function HolderPage() {
  const [wallet, setWallet] = useState([]);
  const [shareId, setShareId] = useState(null);

  const importMock = () => {
    const vc = { id: "vc_" + Math.random().toString(36).slice(2), schema: "HealthPass", status: "valid" };
    setWallet([vc, ...wallet]);
  };

  const createShare = (vc) => {
    const id = "vp_" + Math.random().toString(36).slice(2);
    setShareId(id);
  };

  return (
    <>
      <h1>Holder (Wallet)</h1>
      <Section title="กระเป๋าเอกสาร">
        <button className="btn" onClick={importMock}>นำเข้า VC ตัวอย่าง</button>
        <div className="grid2">
          {wallet.map((vc) => (
            <div key={vc.id} className="card">
              <h3>{vc.schema}</h3>
              <p>ID: {vc.id}</p>
              <p>สถานะ: {vc.status}</p>
              <button className="btn btn--small" onClick={() => createShare(vc)}>สร้างลิงก์/QR สำหรับแชร์</button>
            </div>
          ))}
        </div>

        {shareId && (
          <QRCard title="ลิงก์แชร์ VP" value={`https://example.com/vp/${shareId}`} />
        )}
      </Section>
    </>
  );
}
