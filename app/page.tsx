"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, CalendarIcon, Users, Music, MapPin } from "lucide-react"
import { AddLessonDialog } from "@/components/add-lesson-dialog"
import { RoomsManagement } from "@/components/rooms-management"
import { TeachersManagement } from "@/components/teachers-management"
import { CalendarFiltersComponent } from "@/components/calendar-filters"
// Dodaj import getInstrumentsFromTeachers
import { mockLessons, mockRooms, mockTeachers, mockStudents, getInstrumentsFromTeachers } from "@/lib/mock-data"
import type { Lesson, CalendarFilters } from "@/lib/types"
import { CalendarView } from "@/components/calendar-view"
import { LessonsList } from "@/components/lessons-list"

export default function MusicSchoolScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filters, setFilters] = useState<CalendarFilters>({
    teachers: [],
    rooms: [],
    instruments: [],
    lessonTypes: [],
  })

  // Dodaj stan dla edycji
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  // Generuj instrumenty z nauczycieli
  const instruments = getInstrumentsFromTeachers(mockTeachers)

  const addLesson = (lesson: Omit<Lesson, "id">) => {
    const newLesson: Lesson = {
      ...lesson,
      id: Math.random().toString(36).substr(2, 9),
    }
    setLessons([...lessons, newLesson])
  }

  // Dodaj funkcje do obsługi edycji i usuwania
  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setIsAddDialogOpen(true)
  }

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    setLessons(lessons.map((lesson) => (lesson.id === updatedLesson.id ? updatedLesson : lesson)))
    setEditingLesson(null)
  }

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== lessonId))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Terminarz Szkoły Muzycznej</h1>
          <p className="text-muted-foreground">Zarządzaj zajęciami, salami i nauczycielami</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Dodaj zajęcia
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Kalendarz
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Sale
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Nauczyciele
          </TabsTrigger>
          <TabsTrigger value="instruments" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Instrumenty
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <CalendarFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            teachers={mockTeachers}
            rooms={mockRooms}
            instruments={instruments}
          />

          <div className="space-y-6">
            <CalendarView
              lessons={lessons}
              selectedDate={selectedDate || new Date()}
              onDateSelect={setSelectedDate}
              filters={filters}
            />

            <LessonsList
              lessons={lessons}
              selectedDate={selectedDate || new Date()}
              filters={filters}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
            />
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <RoomsManagement rooms={mockRooms} />
        </TabsContent>

        <TabsContent value="teachers">
          <TeachersManagement teachers={mockTeachers} />
        </TabsContent>

        <TabsContent value="instruments">
          <Card>
            <CardHeader>
              <CardTitle>Dostępne Instrumenty</CardTitle>
              <CardDescription>Instrumenty używane przez nauczycieli w szkole</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instruments.map((instrument) => (
                  <Card key={instrument.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Music className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-medium">{instrument.name}</h3>
                          <p className="text-sm text-muted-foreground">{instrument.type}</p>
                          <Badge variant={instrument.available ? "default" : "secondary"}>
                            {instrument.available ? "Dostępny" : "Niedostępny"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddLessonDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) setEditingLesson(null)
        }}
        onAddLesson={addLesson}
        onUpdateLesson={handleUpdateLesson}
        editingLesson={editingLesson}
        rooms={mockRooms}
        teachers={mockTeachers}
        instruments={instruments}
        students={mockStudents}
      />
    </div>
  )
}
