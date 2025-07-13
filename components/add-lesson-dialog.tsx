"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, CheckCircle, XCircle } from "lucide-react"
import type { Room, Teacher, Instrument, Lesson, Student } from "@/lib/types"

// Dodaj props dla edycji
interface AddLessonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddLesson: (lesson: Omit<Lesson, "id">) => void
  onUpdateLesson?: (lesson: Lesson) => void
  editingLesson?: Lesson | null
  rooms: Room[]
  teachers: Teacher[]
  instruments: Instrument[]
  students: Student[]
}

// Zaktualizuj komponent - dodaj editingLesson i onUpdateLesson
export function AddLessonDialog({
  open,
  onOpenChange,
  onAddLesson,
  onUpdateLesson,
  editingLesson,
  rooms,
  teachers,
  instruments,
  students,
}: AddLessonDialogProps) {
  // Zaktualizuj formData - dodaj priceType i usuń pricePerPerson
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: 45,
    teacher: "",
    room: "",
    instrument: "",
    students: [] as string[],
    maxParticipants: 1,
    description: "",
    priceType: "total" as "total" | "per-person",
    price: 0,
    studentPayments: {} as { [studentName: string]: boolean },
    isRecurring: false,
    recurringType: "weekly" as "daily" | "weekly" | "biweekly" | "monthly",
    recurringCount: 1, // Zmień z recurringEndDate na recurringCount
  })

  const lessonTypes = [
    { value: "individual-stationary", label: "Lekcja indywidualna (stacjonarna)" },
    { value: "individual-online", label: "Lekcja indywidualna (online)" },
    { value: "group", label: "Zajęcia grupowe" },
    { value: "children", label: "Zajęcia dla dzieci" },
    { value: "academy", label: "Akademia" },
    { value: "residency", label: "Rezydencja artystyczna" },
    { value: "practice-room", label: "Wynajem sali prób" },
    { value: "concert-hall", label: "Studio koncertowe" },
  ]

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ]

  const recurringOptions = [
    { value: "daily", label: "Codziennie" },
    { value: "weekly", label: "Co tydzień" },
    { value: "biweekly", label: "Co 2 tygodnie" },
    { value: "monthly", label: "Co miesiąc" },
  ]

  const availableTeachers = teachers.filter((teacher) => {
    if (formData.instrument && !teacher.instruments.includes(formData.instrument)) return false
    return true
  })

  const availableRooms = rooms.filter((room) => {
    if (formData.type === "individual-online") return false
    if (formData.instrument && !room.instruments.includes(formData.instrument)) return false
    return true
  })
  const availableStudents = students

  const addStudent = (studentId: string) => {
    setFormData((prev) => ({
      ...prev,
      students: [...prev.students, studentId],
    }))
  }

  const toggleStudentPayment = (studentId: string) => {
    setFormData((prev) => ({
      ...prev,
      studentPayments: {
        ...prev.studentPayments,
        [studentId]: !prev.studentPayments[studentId],
      },
    }))
  }

  const removeStudent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      students: prev.students.filter((_, i) => i !== index),
    }))
  }

  // Automatyczne ustawienie godziny zakończenia na podstawie czasu trwania
  useEffect(() => {
    if (formData.startTime && formData.duration) {
      const [hours, minutes] = formData.startTime.split(":").map(Number)
      const startMinutes = hours * 60 + minutes
      const endMinutes = startMinutes + formData.duration
      const endHours = Math.floor(endMinutes / 60)
      const endMins = endMinutes % 60
      const endTime = `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`
      setFormData((prev) => ({ ...prev, endTime }))
    }
  }, [formData.startTime, formData.duration])

  // Automatyczne ustawienie maksymalnej liczby uczestników na podstawie sali
  useEffect(() => {
    if (formData.room) {
      const selectedRoom = rooms.find((room) => room.name === formData.room)
      if (selectedRoom) {
        setFormData((prev) => ({ ...prev, maxParticipants: selectedRoom.capacity }))
      }
    }
  }, [formData.room, rooms])

  // Dodaj useEffect do wypełnienia formularza przy edycji
  useEffect(() => {
    if (editingLesson && open) {
      setFormData({
        title: editingLesson.title || "",
        type: editingLesson.type,
        date: editingLesson.date,
        startTime: editingLesson.startTime,
        endTime: editingLesson.endTime,
        duration: editingLesson.duration,
        teacher: editingLesson.teacher,
        room: editingLesson.room || "",
        instrument: editingLesson.instrument,
        students: editingLesson.students || [],
        maxParticipants: editingLesson.maxParticipants || 1,
        description: editingLesson.description || "",
        priceType: editingLesson.priceType,
        price: editingLesson.price,
        studentPayments: editingLesson.studentPayments || {},
        isRecurring: false, // Nie pozwalamy edytować powtarzających się zajęć jako powtarzające
        recurringType: "weekly",
        recurringCount: 1,
      })
    }
  }, [editingLesson, open])

  // Zaktualizuj handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingLesson && onUpdateLesson) {
      // Edycja istniejących zajęć
      onUpdateLesson({
        ...editingLesson,
        ...formData,
      })
    } else if (formData.isRecurring && formData.recurringCount > 1) {
      // Generuj powtarzające się zajęcia
      const lessons = generateRecurringLessons(formData)
      lessons.forEach((lesson) => onAddLesson(lesson))
    } else {
      // Pojedyncze zajęcia
      onAddLesson(formData)
    }

    onOpenChange(false)
    // Reset formularza
    setFormData({
      title: "",
      type: "",
      date: "",
      startTime: "",
      endTime: "",
      duration: 45,
      teacher: "",
      room: "",
      instrument: "",
      students: [],
      maxParticipants: 1,
      description: "",
      priceType: "total",
      price: 0,
      studentPayments: {},
      isRecurring: false,
      recurringType: "weekly",
      recurringCount: 1,
    })
  }

  // Napraw generateRecurringLessons - problem był w logice dat
  const generateRecurringLessons = (baseLesson: typeof formData) => {
    const lessons = []
    const startDate = new Date(baseLesson.date)

    for (let i = 0; i < baseLesson.recurringCount; i++) {
      const currentDate = new Date(startDate)

      // Dodaj interwał na podstawie typu powtarzania
      switch (baseLesson.recurringType) {
        case "daily":
          currentDate.setDate(startDate.getDate() + i)
          break
        case "weekly":
          currentDate.setDate(startDate.getDate() + i * 7)
          break
        case "biweekly":
          currentDate.setDate(startDate.getDate() + i * 14)
          break
        case "monthly":
          currentDate.setMonth(startDate.getMonth() + i)
          break
      }

      lessons.push({
        ...baseLesson,
        date: currentDate.toISOString().split("T")[0],
      })
    }

    return lessons
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Zaktualizuj tytuł dialogu */}
          <DialogTitle>{editingLesson ? "Edytuj zajęcia" : "Dodaj nowe zajęcia"}</DialogTitle>
          <DialogDescription>Wypełnij formularz aby dodać nowe zajęcia do kalendarza</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Typ zajęć</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz typ" />
              </SelectTrigger>
              <SelectContent>
                {lessonTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instrument">Instrument</Label>
            <Select
              value={formData.instrument}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, instrument: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz instrument" />
              </SelectTrigger>
              <SelectContent>
                {instruments.map((instrument) => (
                  <SelectItem key={instrument.id} value={instrument.name}>
                    {instrument.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Nauczyciel</Label>
            <Select
              value={formData.teacher}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, teacher: value }))}
              required={formData.type !== "practice-room"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz nauczyciela" />
              </SelectTrigger>
              <SelectContent>
                {availableTeachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.name}>
                    {teacher.name} ({teacher.instruments.join(", ")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.type !== "individual-online" && (
            <div className="space-y-2">
              <Label htmlFor="room">Sala</Label>
              <Select
                value={formData.room}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, room: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz salę" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.name}>
                      {room.name} (pojemność: {room.capacity}, instrumenty: {room.instruments.join(", ")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Godzina rozpoczęcia</Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, startTime: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz godzinę" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Czas trwania (min)</Label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: Number.parseInt(value) }))}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="90">90 min</SelectItem>
                  <SelectItem value="120">120 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRecurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRecurring: !!checked }))}
            />
            <Label htmlFor="isRecurring">Zajęcia powtarzające się</Label>
          </div>

          {formData.isRecurring && (
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="recurringType">Częstotliwość</Label>
                <Select
                  value={formData.recurringType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, recurringType: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recurringCount">Liczba wystąpień</Label>
                <Input
                  id="recurringCount"
                  type="number"
                  min="1"
                  max="52"
                  value={formData.recurringCount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, recurringCount: Number.parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Maksymalna liczba uczestników</Label>
            <Input
              id="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData((prev) => ({ ...prev, maxParticipants: Number.parseInt(e.target.value) }))}
              min="1"
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.room &&
                `Pojemność wybranej sali: ${rooms.find((r) => r.name === formData.room)?.capacity} osób`}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Uczniowie</Label>
            <Select onValueChange={addStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz ucznia" />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                    {student.hasActiveSubscription && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Abonament
                      </Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formData.students.length > 0 && (
              <div className="space-y-2 p-3 border rounded-lg bg-muted/50">
                <Label className="text-sm font-medium">Uczniowie i płatności:</Label>
                {formData.students.map((studentId, index) => {
                  const student = availableStudents.find((s) => s.id === studentId)
                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="text-sm">
                        {student?.firstName} {student?.lastName}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStudentPayment(studentId)}
                          className={`p-1 ${formData.studentPayments[studentId] ? "text-green-600" : "text-red-600"}`}
                        >
                          {formData.studentPayments[studentId] ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </Button>
                        <X
                          className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground"
                          onClick={() => removeStudent(index)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Zaktualizuj sekcję ceny w formularzu */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Typ ceny</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="total-price"
                    name="priceType"
                    value="total"
                    checked={formData.priceType === "total"}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, priceType: e.target.value as "total" | "per-person" }))
                    }
                  />
                  <Label htmlFor="total-price">Cena całkowita za zajęcia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="per-person-price"
                    name="priceType"
                    value="per-person"
                    checked={formData.priceType === "per-person"}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, priceType: e.target.value as "total" | "per-person" }))
                    }
                  />
                  <Label htmlFor="per-person-price">Cena za osobę</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                {formData.priceType === "total" ? "Cena całkowita (zł)" : "Cena za osobę (zł)"}
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) }))}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tytuł zajęć (opcjonalnie)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Niestandardowy tytuł zajęć..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis (opcjonalnie)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Dodatkowe informacje o zajęciach..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            {/* Zaktualizuj przycisk submit */}
            <Button type="submit">
              {editingLesson ? "Zapisz zmiany" : formData.isRecurring ? "Dodaj zajęcia" : "Dodaj zajęcia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
