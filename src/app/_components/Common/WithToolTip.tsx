import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip'

interface WithTooltipProps {
  content: string;
  children: React.ReactNode;
}

const WithToolTip = ({ content, children }: WithTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default WithToolTip