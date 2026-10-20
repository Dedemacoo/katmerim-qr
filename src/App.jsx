import React from 'react'
import { MenuProvider, useMenu } from './context/MenuContext'
import CustomerMenu from './components/CustomerMenu'
import AdminLayout from './components/AdminPanel/AdminLayout'
import AdminLogin from './components/AdminPanel/AdminLogin'

function AppContent() {
  const { isAdminMode, isAdminAuthenticated } = useMenu()
  
  if (isAdminMode) {
    return isAdminAuthenticated ? <AdminLayout /> : <AdminLogin />
  }

  return <CustomerMenu />
}

export default function App() {
  return (
    <MenuProvider>
      <AppContent />
    </MenuProvider>
  )
}
