import { HashRouter, Routes, Route } from 'react-router'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'
import ResultPage from './pages/ResultPage'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 min-h-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}

export default App
