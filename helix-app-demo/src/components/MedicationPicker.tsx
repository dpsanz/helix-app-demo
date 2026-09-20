import { useMemo, useState } from 'react'
import { MEDICATIONS } from '../data/medicalKnowledge'

type Props = { name: string; dosageMg: string; onChange: (name: string, dosageMg: string) => void }

export default function MedicationPicker({ name, dosageMg, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const matches = useMemo(() => {
    const query = name.trim().toLowerCase()
    return MEDICATIONS.filter(item => !query || `${item.name} ${item.category}`.toLowerCase().includes(query)).slice(0, 7)
  }, [name])
  const selected = MEDICATIONS.find(item => item.name.toLowerCase() === name.toLowerCase())

  return <div className="medication-picker">
    <label className="medication-search-field"><span>Medicamento</span><div><input value={name} onFocus={() => setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 120)} onChange={event => { onChange(event.target.value, dosageMg); setOpen(true) }} placeholder="Busque pelo nome ou categoria" autoComplete="off" /><span className="medication-search-icon">⌕</span></div></label>
    {open && matches.length > 0 && <div className="medication-results">{matches.map(item => <button type="button" key={item.name} onMouseDown={event => event.preventDefault()} onClick={() => { onChange(item.name, item.name === 'Varfarina' ? '5' : item.dosages[0]); setOpen(false) }}><span><strong>{item.name}</strong><small>{item.category}</small></span><em>{item.dosages[0]}–{item.dosages.at(-1)} mg</em></button>)}</div>}
    <label className="dosage-field"><span>Dose</span><div><input type="number" min="0" step="0.5" list="medication-dosages" value={dosageMg} onChange={event => onChange(name, event.target.value)} placeholder="500" /><b>mg</b></div></label>
    <datalist id="medication-dosages">{selected?.dosages.map(dosage => <option key={dosage} value={dosage} />)}</datalist>
  </div>
}
