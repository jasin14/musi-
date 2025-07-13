"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Clock, Users, MapPin, Music, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"
import type { Lesson, CalendarFilters } from "@/lib/types"

// Dodaj props dla edycji
interface LessonsListProps {
  lessons: Lesson[]
  selectedDate: Date
  filters: CalendarFilters
  onEditLesson: (lesson: Lesson) => void
  onDeleteLesson: (lessonId: string) => void
}

// Zaktualizuj komponent
export function LessonsList({ lessons, selectedDate, filters, onEditLesson, onDeleteLesson }: LessonsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const getTypeColor = (type: string) => {
    const colors = {
      "individual-stationary": "bg-blue-100 text-blue-800",
      "individual-online": "bg-green-100 text-green-800",
      group: "bg-purple-100 text-purple-800",
      children: "bg-pink-100 text-pink-800",
      academy: "bg-orange-100 text-orange-800",
      residency: "bg-red-100 text-red-800",
      "practice-room": "bg-gray-100 text-gray-800",
      "concert-hall": "bg-yellow-100 text-yellow-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      "individual-stationary": "Lekcja indywidualna",
      "individual-online": "Lekcja online",
      group: "Zajęcia grupowe",
      children: "Zajęcia dla dzieci",
      academy: "Akademia",
      residency: "Rezydencja",
      "practice-room": "Sala prób",
      "concert-hall": "Studio koncertowe",
    }
    return labels[type as keyof typeof labels] || type
  }

  const filteredLessons = lessons
    .filter((lesson) => {
      const lessonDate = new Date(lesson.date)
      // Upewnij się, że porównujemy tylko daty bez czasu
      const compareDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
      const compareLessonDate = new Date(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate())
      return compareLessonDate.getTime() === compareDate.getTime()
    })
    .filter((lesson) => {
      // Zastosuj filtry kalendarza
      if (filters.teachers.length > 0 && !filters.teachers.includes(lesson.teacher)) return false
      if (filters.rooms.length > 0 && lesson.room && !filters.rooms.includes(lesson.room)) return false
      if (filters.instruments.length > 0 && !filters.instruments.includes(lesson.instrument)) return false
      if (filters.lessonTypes.length > 0 && !filters.lessonTypes.includes(lesson.type)) return false

      // Zastosuj filtry lokalne
      if (filterType !== "all" && lesson.type !== filterType) return false
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          lesson.title?.toLowerCase().includes(searchLower) ||
          lesson.teacher.toLowerCase().includes(searchLower) ||
          lesson.instrument.toLowerCase().includes(searchLower) ||
          lesson.students?.some((student) => student.toLowerCase().includes(searchLower))
        )
      }
      return true
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const getPaymentStatus = (lesson: Lesson) => {
    if (!lesson.students || lesson.students.length === 0) return { paid: 0, total: 0 }

    const total = lesson.students.length
    const paid = lesson.students.filter((student) => lesson.studentPayments?.[student]).length

    return { paid, total }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Zajęcia na {selectedDate.toLocaleDateString("pl-PL")}</CardTitle>
            <CardDescription>{filteredLessons.length} zaplanowanych zajęć</CardDescription>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj zajęć, nauczycieli, uczniów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie typy</SelectItem>
              <SelectItem value="individual-stationary">Lekcje indywidualne</SelectItem>
              <SelectItem value="individual-online">Lekcje online</SelectItem>
              <SelectItem value="group">Zajęcia grupowe</SelectItem>
              <SelectItem value="children">Zajęcia dla dzieci</SelectItem>
              <SelectItem value="academy">Akademia</SelectItem>
              <SelectItem value="residency">Rezydencja</SelectItem>
              <SelectItem value="practice-room">Sala prób</SelectItem>
              <SelectItem value="concert-hall">Studio koncertowe</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm || filterType !== "all"
                ? "Brak zajęć spełniających kryteria wyszukiwania"
                : "Brak zajęć w wybranym dniu"}
            </p>
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const paymentStatus = getPaymentStatus(lesson)

            return (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(lesson.type)}>{getTypeLabel(lesson.type)}</Badge>
                          {lesson.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              Powtarzające się
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg">
                          {lesson.title || `${lesson.instrument} - ${lesson.teacher}`}
                        </h3>
                      </div>
                      {/* Zaktualizuj wyświetlanie ceny */}
                      <div className="text-right">
                        <div className="text-sm font-medium">{lesson.duration} min</div>
                        <div className="text-xs text-muted-foreground">
                          {lesson.price > 0 &&
                            (lesson.priceType === "total" ? `${lesson.price} zł (całość)` : `${lesson.price} zł/os.`)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {lesson.startTime} - {lesson.endTime}
                        </span>
                      </div>
                      {lesson.room && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{lesson.room}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-muted-foreground" />
                        <span>{lesson.instrument}</span>
                      </div>
                      {lesson.maxParticipants && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>Max: {lesson.maxParticipants} os.</span>
                        </div>
                      )}
                    </div>

                    {lesson.students && lesson.students.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Uczniowie i płatności:</div>
                        <div className="space-y-1">
                          {lesson.students.map((student, index) => {
                            const isPaid = lesson.studentPayments?.[student] || false
                            return (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-sm">{student}</span>
                                <div className="flex items-center gap-2">
                                  {isPaid ? (
                                    <Badge variant="default" className="text-xs flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Opłacone
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-xs flex items-center gap-1">
                                      <XCircle className="w-3 h-3" />
                                      Nieopłacone
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Opłacone: {paymentStatus.paid}/{paymentStatus.total} uczniów
                        </div>
                      </div>
                    )}

                    {lesson.description && <p className="text-sm text-muted-foreground">{lesson.description}</p>}

                    {/* Zaktualizuj przyciski akcji */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        {lesson.students && lesson.students.length > 0 ? (
                          <Badge
                            variant={
                              paymentStatus.paid === paymentStatus.total
                                ? "default"
                                : paymentStatus.paid > 0
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {paymentStatus.paid === paymentStatus.total
                              ? "Wszystko opłacone"
                              : paymentStatus.paid > 0
                                ? "Częściowo opłacone"
                                : "Nieopłacone"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Brak uczniów</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEditLesson(lesson)}>
                          Edytuj
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDeleteLesson(lesson.id)}>
                          Usuń
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
