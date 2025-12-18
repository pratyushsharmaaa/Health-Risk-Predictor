import React from 'react'

export function Card({ children, className }) {
  return <div className={`rounded-xl border p-4 shadow ${className}`}>{children}</div>
}

export function CardHeader({ children }) {
  return <div className="mb-2 font-semibold text-lg">{children}</div>
}

export function CardTitle({ children }) {
  return <h3 className="text-xl font-bold">{children}</h3>
}

export function CardContent({ children }) {
  return <div className="text-sm">{children}</div>
}
