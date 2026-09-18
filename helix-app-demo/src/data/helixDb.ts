export type UserRole = 'beneficiary' | 'doctor'
export type PatientStatus = 'alerta' | 'ok'

export type HealthProfile = {
  conditions: string[]
  allergies: string[]
  familyHistory: string[]
  medication: string
}

export type HelixUser = {
  id: string
  role: UserRole
  name: string
  email: string
  cpf: string
  passwordHash: string
  phone?: string
  birth?: string
  cardNumber?: string
  plan?: string
  doctorId?: string
  createdAt: string
  health?: HealthProfile
  genomicStatus?: string
  genes?: string[]
  patientStatus?: PatientStatus
}

export type CreateBeneficiaryInput = Omit<HelixUser, 'id' | 'role' | 'passwordHash' | 'createdAt' | 'doctorId' | 'genomicStatus' | 'genes' | 'patientStatus'> & { password: string }

const DB_NAME = 'helix_app'
const DB_VERSION = 1
const USERS = 'users'
export const DEMO_DOCTOR_ID = 'MED-00001'

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function hashPassword(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      const store = db.createObjectStore(USERS, { keyPath: 'id' })
      store.createIndex('email', 'email', { unique: true })
      store.createIndex('cpf', 'cpf', { unique: true })
      store.createIndex('role', 'role')
      store.createIndex('doctorId', 'doctorId')
    }
    request.onsuccess = async () => {
      const db = request.result
      try {
        await seedDoctor(db)
        resolve(db)
      } catch (error) {
        db.close()
        reject(error)
      }
    }
    request.onerror = () => reject(request.error)
  })
}

async function seedDoctor(db: IDBDatabase) {
  const existing = await requestResult(db.transaction(USERS).objectStore(USERS).get(DEMO_DOCTOR_ID))
  if (!existing) {
    const doctor: HelixUser = {
      id: DEMO_DOCTOR_ID,
      role: 'doctor',
      name: 'Dr. Carlos Almeida',
      email: 'medico@helix.com',
      cpf: '00000000000',
      passwordHash: await hashPassword('medico123'),
      createdAt: new Date().toISOString(),
    }
    await requestResult(db.transaction(USERS, 'readwrite').objectStore(USERS).add(doctor))
  }
}

export async function createBeneficiary(input: CreateBeneficiaryInput) {
  const db = await openDatabase()
  const email = input.email.trim().toLowerCase()
  const cpf = input.cpf.replace(/\D/g, '')
  const lookup = db.transaction(USERS).objectStore(USERS)
  if (await requestResult(lookup.index('email').get(email))) throw new Error('Este e-mail já está cadastrado.')
  const cpfLookup = db.transaction(USERS).objectStore(USERS)
  if (cpf && await requestResult(cpfLookup.index('cpf').get(cpf))) throw new Error('Este CPF já está cadastrado.')
  const { password, ...profile } = input
  const user: HelixUser = {
    ...profile,
    id: `HLX-${Date.now().toString().slice(-6)}`,
    role: 'beneficiary',
    email,
    cpf,
    passwordHash: await hashPassword(password),
    doctorId: DEMO_DOCTOR_ID,
    createdAt: new Date().toISOString(),
    genomicStatus: 'Perfil genômico em preparação',
    genes: ['CYP2C9', 'VKORC1', 'CYP2C19'],
    patientStatus: input.health?.medication ? 'alerta' : 'ok',
  }
  await requestResult(db.transaction(USERS, 'readwrite').objectStore(USERS).add(user))
  db.close()
  return user
}

export async function authenticate(identifier: string, password: string, role: UserRole) {
  const db = await openDatabase()
  const normalized = identifier.trim().toLowerCase()
  const cpf = identifier.replace(/\D/g, '')
  const store = db.transaction(USERS).objectStore(USERS)
  const user = await requestResult<HelixUser | undefined>(store.index('email').get(normalized))
    ?? (cpf ? await requestResult<HelixUser | undefined>(store.index('cpf').get(cpf)) : undefined)
  db.close()
  if (!user || user.role !== role || user.passwordHash !== await hashPassword(password)) return null
  return user
}

export async function getUser(id: string) {
  const db = await openDatabase()
  const user = await requestResult<HelixUser | undefined>(db.transaction(USERS).objectStore(USERS).get(id))
  db.close()
  return user ?? null
}

export async function updateUser(id: string, changes: Partial<HelixUser>) {
  const db = await openDatabase()
  const transaction = db.transaction(USERS, 'readwrite')
  const store = transaction.objectStore(USERS)
  const current = await requestResult<HelixUser | undefined>(store.get(id))
  if (!current) throw new Error('Perfil não encontrado.')
  const next = { ...current, ...changes, id: current.id, role: current.role }
  await requestResult(store.put(next))
  db.close()
  return next
}

export async function listDoctorPatients(doctorId: string) {
  const db = await openDatabase()
  const users = await requestResult<HelixUser[]>(db.transaction(USERS).objectStore(USERS).index('doctorId').getAll(doctorId))
  db.close()
  return users.filter(user => user.role === 'beneficiary').sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function listAllUsers() {
  const db = await openDatabase()
  const users = await requestResult<HelixUser[]>(db.transaction(USERS).objectStore(USERS).getAll())
  db.close()
  return users.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function deleteUser(id: string) {
  if (id === DEMO_DOCTOR_ID) throw new Error('A conta médica do sistema não pode ser excluída.')
  const db = await openDatabase()
  await requestResult(db.transaction(USERS, 'readwrite').objectStore(USERS).delete(id))
  db.close()
}

export async function deleteAllBeneficiaries() {
  const users = await listAllUsers()
  const beneficiaries = users.filter(user => user.role === 'beneficiary')
  const db = await openDatabase()
  for (const user of beneficiaries) {
    await requestResult(db.transaction(USERS, 'readwrite').objectStore(USERS).delete(user.id))
  }
  db.close()
  return beneficiaries.length
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()
}
