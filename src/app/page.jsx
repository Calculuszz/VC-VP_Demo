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
          <StatCard title="Issuer" desc="ออก VC / จัดการสคีมา / เพิกถอน" href="/issuer" />
          <StatCard title="Holder" desc="กระเป๋าเอกสารดิจิทัล / แชร์เป็น VP" href="/holder" />
          <StatCard title="Verifier" desc="สแกน/อัปโหลดเพื่อตรวจสอบ" href="/verifier" />
        </div>
      </Section>

      <Section title="Registry">
        <p>ค้นหาสคีมาและผู้ออกที่เชื่อถือได้ <a href="/registry">ดูทั้งหมด</a></p>
      </Section>
    </>
  );
}
