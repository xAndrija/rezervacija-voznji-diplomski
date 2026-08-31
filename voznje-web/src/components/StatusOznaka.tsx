const STILOVI: Record<string, string> = {
    AKTIVNA: 'bg-teal/10 text-teal',
    OTKAZANA: 'bg-danger-soft text-danger',
    ZAVRSENA: 'bg-border text-text-soft',
    POTVRDJENA: 'bg-teal/10 text-teal',
  };
  
  export default function StatusOznaka({ status }: { status: string }) {
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STILOVI[status] || 'bg-border text-text-soft'}`}>
        {status}
      </span>
    );
  }