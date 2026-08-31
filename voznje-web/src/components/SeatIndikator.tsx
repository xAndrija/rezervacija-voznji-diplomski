interface SeatIndikatorProps {
    ukupno: number;
    zauzeto: number;
  }
  
  export default function SeatIndikator({ ukupno, zauzeto }: SeatIndikatorProps) {
    return (
      <div className="flex items-center gap-1.5">
        {Array.from({ length: ukupno }).map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${i < zauzeto ? 'bg-accent' : 'bg-border'}`}
          />
        ))}
      </div>
    );
  }