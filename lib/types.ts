export interface Room {
  id: string
  name: string
  capacity: number
  instruments: string[]
  available: boolean
  hourlyRate: number
  description?: string
}

export interface Teacher {
  id: string
  name: string
  instruments: string[]
  available: boolean
  email: string
  phone: string
  experience: number
  hourlyRate: number
  bio?: string
}

export interface Instrument {
  id: string
  name: string
  type: string
  available: boolean
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  hasActiveSubscription: boolean
}

// Zaktualizuj interface Lesson - zmień system płatności na poziomie studenta
export interface Lesson {
  id: string
  title?: string
  type:
    | "individual-stationary"
    | "individual-online"
    | "group"
    | "children"
    | "academy"
    | "residency"
    | "practice-room"
    | "concert-hall"
  date: string
  startTime: string
  endTime: string
  duration: number
  teacher: string
  room?: string
  instrument: string
  students?: string[]
  maxParticipants?: number
  description?: string
  priceType: "total" | "per-person" // Nowe pole - typ ceny
  price: number
  studentPayments?: { [studentName: string]: boolean } // Płatności per student
  isRecurring?: boolean
  recurringType?: "daily" | "weekly" | "biweekly" | "monthly"
  recurringCount?: number // Zmień z recurringEndDate
}

// Dodaj interface dla filtrów
export interface CalendarFilters {
  teachers: string[]
  rooms: string[]
  instruments: string[]
  lessonTypes: string[]
}
