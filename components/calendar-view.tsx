"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import type { Lesson, CalendarFilters } from "@/lib/types"

interface CalendarViewProps {
  lessons: Lesson[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  filters: CalendarFilters
}

export function CalendarView({ lessons, selectedDate, onDateSelect, filters }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("week")

  const getTypeColor = (type: string) => {
    const colors = {
      "individual-stationary": "bg-blue-500",
      "individual-online": "bg-green-500",
      group: "bg-purple-500",
      children: "bg-pink-500",
      academy: "bg-orange-500",
      residency: "bg-red-500",
      "practice-room": "bg-gray-500",
      "concert-hall": "bg-yellow-500",
    }
    return colors[type as keyof typeof colors] || "bg-gray-500"
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    switch (view) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
        break
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
        break
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
        break
    }
    setCurrentDate(newDate)
  }

  const getDateRange = () => {
    switch (view) {
      case "day":
        return currentDate.toLocaleDateString("pl-PL", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      case "week":
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return `${weekStart.toLocaleDateString("pl-PL")} - ${weekEnd.toLocaleDateString("pl-PL")}`
      case "month":
        return currentDate.toLocaleDateString("pl-PL", {
          year: "numeric",
          month: "long",
        })
    }
  }

  const getDaysInView = () => {
    switch (view) {
      case "day":
        return [currentDate]
      case "week":
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1)
        return Array.from({ length: 7 }, (_, i) => {
          const day = new Date(weekStart)
          day.setDate(weekStart.getDate() + i)
          return day
        })
      case "month":
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        const firstDayOfWeek = monthStart.getDay() === 0 ? 7 : monthStart.getDay()
        const startDate = new Date(monthStart)
        startDate.setDate(startDate.getDate() - firstDayOfWeek + 1)

        const days = []
        const totalDays = 42 // 6 weeks * 7 days
        for (let i = 0; i < totalDays; i++) {
          const day = new Date(startDate)
          day.setDate(startDate.getDate() + i)
          days.push(day)
        }
        return days
    }
  }

  const getLessonsForDate = (date: Date) => {
    return lessons
      .filter((lesson) => {
        const lessonDate = new Date(lesson.date)
        // Upewnij się, że porównujemy tylko daty bez czasu
        const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const compareLessonDate = new Date(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate())
        return compareLessonDate.getTime() === compareDate.getTime()
      })
      .filter((lesson) => {
        // Zastosuj filtry
        if (filters.teachers.length > 0 && !filters.teachers.includes(lesson.teacher)) return false
        if (filters.rooms.length > 0 && lesson.room && !filters.rooms.includes(lesson.room)) return false
        if (filters.instruments.length > 0 && !filters.instruments.includes(lesson.instrument)) return false
        if (filters.lessonTypes.length > 0 && !filters.lessonTypes.includes(lesson.type)) return false
        return true
      })
  }

  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = 8 + i
    return `${hour.toString().padStart(2, "0")}:00`
  })

  const renderDayView = () => {
    const dayLessons = getLessonsForDate(currentDate)

    return (
      <div className="space-y-2">
        {timeSlots.map((time) => {
          const lessonsAtTime = dayLessons.filter((lesson) => lesson.startTime === time)
          return (
            <div key={time} className="flex border-b pb-2">
              <div className="w-16 text-sm text-muted-foreground font-mono">{time}</div>
              <div className="flex-1 space-y-1">
                {lessonsAtTime.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-2 rounded text-white text-xs cursor-pointer ${getTypeColor(lesson.type)}`}
                    onClick={() => onDateSelect(new Date(lesson.date))}
                  >
                    <div className="font-medium">{lesson.title || `${lesson.instrument} - ${lesson.teacher}`}</div>
                    <div className="opacity-90">
                      {lesson.startTime} - {lesson.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const days = getDaysInView()

    return (
      <div className="grid grid-cols-8 gap-1">
        <div className="p-2"></div>
        {days.map((day) => (
          <div key={day.toISOString()} className="p-2 text-center border-b">
            <div className="text-xs text-muted-foreground">{day.toLocaleDateString("pl-PL", { weekday: "short" })}</div>
            <div className="font-medium">{day.getDate()}</div>
          </div>
        ))}

        {timeSlots.map((time) => (
          <>
            <div key={time} className="p-2 text-xs text-muted-foreground font-mono border-r">
              {time}
            </div>
            {days.map((day) => {
              const lessonsAtTime = getLessonsForDate(day).filter((lesson) => lesson.startTime === time)
              return (
                <div key={`${day.toISOString()}-${time}`} className="p-1 border-r border-b min-h-[60px]">
                  {lessonsAtTime.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`p-1 rounded text-white text-xs cursor-pointer mb-1 ${getTypeColor(lesson.type)}`}
                      onClick={() => onDateSelect(day)}
                    >
                      <div className="font-medium truncate">{lesson.title || lesson.instrument}</div>
                      <div className="opacity-90 truncate">{lesson.teacher}</div>
                    </div>
                  ))}
                </div>
              )
            })}
          </>
        ))}
      </div>
    )
  }

  const renderMonthView = () => {
    const days = getDaysInView()

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nie"].map((day) => (
          <div key={day} className="p-2 text-center font-medium text-sm border-b">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dayLessons = getLessonsForDate(day)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <div
              key={day.toISOString()}
              className={`p-2 border min-h-[100px] cursor-pointer hover:bg-muted/50 ${
                !isCurrentMonth ? "text-muted-foreground bg-muted/20" : ""
              } ${isToday ? "bg-primary/10 border-primary" : ""}`}
              onClick={() => onDateSelect(day)}
            >
              <div className="font-medium text-sm mb-1">{day.getDate()}</div>
              <div className="space-y-1">
                {dayLessons.slice(0, 3).map((lesson) => (
                  <div key={lesson.id} className={`p-1 rounded text-white text-xs ${getTypeColor(lesson.type)}`}>
                    <div className="truncate">{lesson.title || lesson.instrument}</div>
                    <div className="opacity-90 truncate">{lesson.startTime}</div>
                  </div>
                ))}
                {dayLessons.length > 3 && (
                  <div className="text-xs text-muted-foreground">+{dayLessons.length - 3} więcej</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Kalendarz
          </CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Dzień</TabsTrigger>
              <TabsTrigger value="week">Tydzień</TabsTrigger>
              <TabsTrigger value="month">Miesiąc</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="font-medium">{getDateRange()}</div>
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="overflow-auto max-h-[500px]">
          {view === "day" && renderDayView()}
          {view === "week" && renderWeekView()}
          {view === "month" && renderMonthView()}
        </div>
      </CardContent>
    </Card>
  )
}
