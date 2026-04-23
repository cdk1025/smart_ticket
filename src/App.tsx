import { HashRouter, Routes, Route } from 'react-router'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'
import ResultPage from './pages/ResultPage'
import PrivacyPage from './pages/PrivacyPage'
import DisclaimerPage from './pages/DisclaimerPage'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <HashRouter>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <Header />
        <main className="flex-1 min-h-0 overflow-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}

export default App
