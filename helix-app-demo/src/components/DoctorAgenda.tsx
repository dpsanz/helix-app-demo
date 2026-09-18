import type { HelixUser } from '../data/helixDb'
import UserAvatar from './UserAvatar'

type Props = { patients: HelixUser[]; onSelect: (patient: HelixUser) => void }

const TIMES = ['09:00', '10:30', '14:00', '16:30']

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v3M18 3v3M4 9h16" /><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 13h3M14 13h2M8 17h2M13 17h3" /></svg>
}

export default function DoctorAgenda({ patients, onSelect }: Props) {
  const today = new Date()
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(today)
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(today)
  const appointmentCount = Math.min(patients.length, TIMES.length)

  return <section className="panel doctor-agenda" id="agenda">
    <div className="agenda-heading">
      <div><span className="eyebrow">Agenda clínica</span><h2>Consultas de hoje</h2><p>{appointmentCount ? `${appointmentCount} atendimento${appointmentCount === 1 ? '' : 's'} vinculado${appointmentCount === 1 ? '' : 's'}` : 'Nenhum atendimento agendado'}</p></div>
      <div className="agenda-date"><span><CalendarIcon /></span><strong>{String(today.getDate()).padStart(2, '0')}</strong><div><b>{weekday}</b><small>{month} · {today.getFullYear()}</small></div></div>
    </div>
    <div className="agenda-list">
      {TIMES.map((time, index) => {
        const patient = patients[index]
        return <button key={time} className={`agenda-slot ${patient ? 'booked' : 'available'}`} disabled={!patient} onClick={() => patient && onSelect(patient)}>
          <time>{time}</time>
          {patient ? <><UserAvatar userId={patient.id} name={patient.name} photoDataUrl={patient.photoDataUrl} size="small" /><span><strong>{patient.name}</strong><small>{patient.patientStatus === 'alerta' ? 'Revisão farmacogenômica' : 'Acompanhamento clínico'}</small></span><em className={patient.patientStatus === 'alerta' ? 'attention' : ''}>{patient.patientStatus === 'alerta' ? 'Atenção' : 'Confirmada'}</em></> : <><span className="agenda-empty-mark">+</span><span><strong>Horário disponível</strong><small>Sem paciente vinculado</small></span></>}
        </button>
      })}
    </div>
  </section>
}
