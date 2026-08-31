export default function RutaPozadina() {
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 800 240"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M -50 180 C 150 100, 250 220, 450 120 S 750 20, 900 80"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M -50 60 C 200 140, 300 20, 500 100 S 700 180, 900 140"
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
          opacity="0.18"
        />
      </svg>
    );
  }