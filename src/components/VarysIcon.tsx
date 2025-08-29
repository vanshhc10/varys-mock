import React from 'react'

interface VarysIconProps {
  size?: number
  className?: string
}

const VarysIcon: React.FC<VarysIconProps> = ({ size = 24, className = '' }) => {
  return (
    <img
      src="/varys icon.svg"
      width={size}
      height={size}
      alt="Varys Icon"
      className={className}
    />
  )
}

export default VarysIcon
