// ใช้แทนการสร้าง QR จริง ๆ (คร่าว ๆ)
// ถ้าจะทำจริง แนะใช้ qrcode.react หรือ lib อื่นฝั่ง client
export default function QRCard({ title, value }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="qr-placeholder">{value}</div>
      <small>*(เดโม) แสดงค่าเป็นข้อความ แทน QR จริง</small>
    </div>
  );
}
