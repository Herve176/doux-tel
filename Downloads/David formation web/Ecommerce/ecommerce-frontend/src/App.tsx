

import './App.css'
import AppRoutes from './routes/AppRoutes'
import Header from './components/header'
import Footer from './components/footer'


function App() {

  return (
    <div data-theme="cerberus" lang="en">
      <Header />
      <AppRoutes />
      <Footer />
    </div>
  )
}

export default App
