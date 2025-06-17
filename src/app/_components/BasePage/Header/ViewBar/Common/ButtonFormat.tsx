import React from 'react'
import { Button } from '~/components/ui/button'

const ButtonFormat = ({ children }: { children: React.ReactNode }) => (
  <Button variant="ghost" className="flex items-center justify-center gap-1 flex-row h-6 p-0 rounded-xs">
    {children}
  </Button>
)

export default ButtonFormat
