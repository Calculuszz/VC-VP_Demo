export default function StatCard({ title, desc, href }) {
  return (
    <a className="card card--link" href={href}>
      <h3>{title}</h3>
      <p>{desc}</p>
    </a>
  );
}
