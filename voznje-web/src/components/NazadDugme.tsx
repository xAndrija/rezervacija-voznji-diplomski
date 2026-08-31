import { Link } from 'react-router-dom';

export default function NazadDugme({ to, tekst = 'Nazad' }: { to: string; tekst?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm text-text-soft hover:text-accent bg-surface hover:bg-accent/5 border border-border px-3 py-1.5 rounded-full transition"
    >
      <span aria-hidden="true">←</span> {tekst}
    </Link>
  );
}