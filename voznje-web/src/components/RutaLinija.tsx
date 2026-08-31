interface RutaLinijaProps {
    polazna: string;
    odredisna: string;
    velicina?: 'sm' | 'md' | 'lg';
  }
  
  export default function RutaLinija({ polazna, odredisna, velicina = 'md' }: RutaLinijaProps) {
    const tekstVelicina = velicina === 'lg' ? 'text-xl' : velicina === 'sm' ? 'text-sm' : 'text-base';
  
    return (
      <div className="flex items-center gap-3">
        <span className={`font-display font-semibold text-text ${tekstVelicina}`}>{polazna}</span>
  
        <span className="flex items-center gap-0.5 flex-shrink-0" aria-hidden="true">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="w-3 h-px border-t-2 border-dotted border-border" />
          <span className="w-3 h-px border-t-2 border-dotted border-border" />
          <span className="w-1.5 h-1.5 rounded-full bg-teal" />
        </span>
  
        <span className={`font-display font-semibold text-text ${tekstVelicina}`}>{odredisna}</span>
      </div>
    );
  }