import { useState } from 'react'
import { MODULES } from './data/modules'
import Home from './components/Home'
import Lesson from './components/Lesson'
import Glossary from './components/Glossary'

export default function App() {
  const [screen, setScreen] = useState("home")
  const [activeId, setActiveId] = useState(null)
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('ai-course-completed')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })
  const mod = MODULES.find(m => m.id === activeId)
  const goHome = () => { setScreen("home"); setActiveId(null); window.scrollTo(0, 0) }
  const finish = () => {
    setCompleted(p => {
      const next = new Set([...p, activeId])
      localStorage.setItem('ai-course-completed', JSON.stringify([...next]))
      return next
    })
    goHome()
  }
  if (screen === "lesson" && mod) return <Lesson mod={mod} onBack={goHome} onFinish={finish} />
  if (screen === "glossary") return <Glossary onBack={goHome} />
  return <Home completed={completed} onSelect={id => { setActiveId(id); setScreen("lesson"); window.scrollTo(0, 0) }} onGlossary={() => { setScreen("glossary"); window.scrollTo(0, 0) }} />
}
