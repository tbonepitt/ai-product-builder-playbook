import { GLOSSARY } from '../data/glossary'

const sorted = Object.entries(GLOSSARY).sort(([a], [b]) => a.localeCompare(b))

export default function Glossary({ onBack }) {
  return (
    <div className="glossary-page">
      <div className="glossary-header">
        <button className="back-btn" onClick={onBack}>← Home</button>
        <h1 className="glossary-title">Glossary</h1>
        <p className="glossary-sub">{sorted.length} terms from across the course</p>
      </div>
      <div className="glossary-list">
        {sorted.map(([term, def]) => (
          <div key={term} className="glossary-entry">
            <div className="glossary-term">{term}</div>
            <div className="glossary-def">{def}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
