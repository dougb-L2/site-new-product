interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${
        hover ? 'hover:shadow-lg transition-shadow duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface ApproachCardProps {
  approach: 'gold-mine' | 'blue-ocean' | 'green-planet' | 'orange-sky';
  title: string;
  description: string;
  icon?: string;
}

export function ApproachCard({ approach, title, description, icon }: ApproachCardProps) {
  const colorMap = {
    'gold-mine': { bg: 'bg-yellow-50', border: 'border-gold-mine', text: 'text-gold-mine' },
    'blue-ocean': { bg: 'bg-blue-50', border: 'border-blue-ocean', text: 'text-blue-ocean' },
    'green-planet': { bg: 'bg-green-50', border: 'border-green-planet', text: 'text-green-planet' },
    'orange-sky': { bg: 'bg-orange-50', border: 'border-orange-sky', text: 'text-orange-sky' },
  };

  const colors = colorMap[approach];

  return (
    <div className={`${colors.bg} rounded-lg border-l-4 ${colors.border} p-6 h-full`}>
      {icon && <div className={`text-4xl mb-4 ${colors.text}`}>{icon}</div>}
      <h3 className={`text-xl font-semibold mb-3 ${colors.text}`}>{title}</h3>
      <p className="text-learn2-text text-sm leading-relaxed">{description}</p>
    </div>
  );
}
