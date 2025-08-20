import Section from "../components/Section";
import StatCard from "../components/StatCard";

export default function Home() {
  return (
    <>
      <header className="hero">
        <div className="hero__content">
          <h1>Simulate System VC & VP</h1>
          <p>โครงสร้างตัวอย่างสำหรับ Issuer / Holder / Verifier / Registry</p>
        </div>
      </header>

      <Section title="สรุประบบ">
        <div className="grid3">
          <StatCard title="Issuer" desc="ออก Verifiable Credential" href="/issuer" />
          <StatCard title="Holder" desc="กระเป๋าเอกสารดิจิทัล (ยังไม่สามารถใช้งานได้)" href="/holder" />
          <StatCard title="Verifier" desc="อัปโหลด JWT เพื่อตรวจสอบ" href="/verifier" />
          <StatCard title="Registry" desc="Database (ยังไม่สามารถใช้งานได้)" href="/registry" />
        </div>
      </Section>
    </>
  );
}
