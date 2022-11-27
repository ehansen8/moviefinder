import React, { ReactNode } from 'react'
import { NavigationBar } from './NavigationBar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <React.StrictMode>
      <NavigationBar />
      {children}
    </React.StrictMode>
  )
}
