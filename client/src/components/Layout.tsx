import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
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
