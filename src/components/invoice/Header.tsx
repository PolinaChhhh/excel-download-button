
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  title: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-8 animate-fade-in">
      <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2 text-primary`}>{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Header;
