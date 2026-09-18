import { initials } from '../data/helixDb'

type Props = { userId: string; name: string; photoDataUrl?: string; size?: 'small' | 'large' }

const palettes = [
  ['#116149', '#13a77c'], ['#24536d', '#2a8ca5'], ['#60417a', '#9564b5'],
  ['#73542d', '#b98238'], ['#6f3d50', '#b65d7c'], ['#375f58', '#52a493'],
]

export default function UserAvatar({ userId, name, photoDataUrl, size = 'large' }: Props) {
  const hash = [...`${userId}${name}`].reduce((total, char) => total + char.charCodeAt(0), 0)
  const [from, to] = palettes[hash % palettes.length]
  return <span className={`user-avatar ${size}`} style={{ '--avatar-from': from, '--avatar-to': to } as React.CSSProperties} aria-label={`Avatar de ${name}`}>
    {photoDataUrl ? <img src={photoDataUrl} alt="" /> : <strong>{initials(name)}</strong>}
  </span>
}
