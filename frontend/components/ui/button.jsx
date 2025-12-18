// components/ui/button.jsx

import React from 'react'
import classNames from 'classnames'  // optional, if using utility for class merging
export function Button({ children, className, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 ${className || ''}`}
    >
      {children}
    </button>
  )
}
