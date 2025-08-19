"use client";
import { useMemo, useState } from "react";
import Section from "../../components/Section";

const MOCK = [
  { id: "issuer_carepass", type: "Issuer", name: "Carepass", trust: 0.99 },
  { id: "schema_healthpass", type: "Schema", name: "HealthPass v1", trust: 0.98 },
  { id: "verifier_hospital", type: "Verifier", name: "General Hospital", trust: 0.96 },
];

export default function RegistryPage() {
  const [q, setQ] = useState("");
  const list = useMemo(
    () => MOCK.filter(x => (x.name + x.id).toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <>
      <h1>Registry</h1>
      <Section title="ค้นหา Registry">
        <input className="input" placeholder="พิมพ์เพื่อค้นหา..." value={q} onChange={e=>setQ(e.target.value)} />
        <div className="grid3">
          {list.map(x => (
            <div key={x.id} className="card">
              <h3>{x.name}</h3>
              <p>ประเภท: {x.type}</p>
              <p>ความน่าเชื่อถือ: {(x.trust*100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
