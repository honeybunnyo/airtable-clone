import React from 'react'

import type { LucideIcon } from 'lucide-react';

type FormatIconProps = {
  icon: LucideIcon;
};

const FormatIcon = ({ icon: Icon }: FormatIconProps) => {
  return (
    <Icon className="w-4 h-4 text-black" strokeWidth={1}/>
  );
};
export default FormatIcon