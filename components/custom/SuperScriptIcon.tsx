import React from "react";
import { LucideProps } from "lucide-react";

interface CustomIconProps {
  icon: React.ComponentType<LucideProps>;
  size?: number;
  className?: string;
}

function CustomIcon({ icon: Icon, size = 16, className = "" }: CustomIconProps) {
  // Add this check to ensure Icon is a valid component
  if (!Icon || typeof Icon !== 'function') {
    console.error('Invalid icon component:', Icon);
    return null;
  }
  
  return <Icon size={size} className={className} />;
}

export default CustomIcon;