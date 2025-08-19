export default function Nav() {
  return (
    <nav className="nav">
      <a className="brand" href="/"><img src="/logo.svg" alt="" /> VC Demo</a>
      <div className="nav__links">
        <a href="/issuer">Issuer</a>
        <a href="/holder">Holder</a>
        <a href="/verifier">Verifier</a>
        <a href="/registry">Registry</a>
      </div>
    </nav>
  );
}
