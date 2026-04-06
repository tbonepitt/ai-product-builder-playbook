import { useState } from 'react'
import { MODULES } from './data/modules'
import Home from './components/Home'
import Lesson from './components/Lesson'

export default function App() {
  const [screen, setScreen] = useState("home")
  const [activeId, setActiveId] = useState(null)
  const [completed, setCompleted] = useState(new Set())
  const mod = MODULES.find(m => m.id === activeId)
  const goHome = () => { setScreen("home"); setActiveId(null); window.scrollTo(0, 0) }
  const finish = () => { setCompleted(p => new Set([...p, activeId])); goHome() }
  if (screen === "lesson" && mod) return <Lesson mod={mod} onBack={goHome} onFinish={finish} />
  return <Home completed={completed} onSelect={id => { setActiveId(id); setScreen("lesson"); window.scrollTo(0, 0) }} />
}
