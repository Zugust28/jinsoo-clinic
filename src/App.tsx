import { AppointmentProvider } from './context/AppointmentContext'
import LoginPage from './components/LoginPage'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import { useAppointment } from './context/AppointmentContext'

function AppContent() {
  const { currentUser } = useAppointment()

  if (!currentUser) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Dashboard />
      </main>
    </div>
  )
}

function App() {
  return (
    <AppointmentProvider>
      <AppContent />
    </AppointmentProvider>
  )
}

export default App
