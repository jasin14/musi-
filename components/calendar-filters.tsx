"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Filter } from "lucide-react"
import type { CalendarFilters, Teacher, Room, Instrument } from "@/lib/types"

interface CalendarFiltersProps {
  filters: CalendarFilters
  onFiltersChange: (filters: CalendarFilters) => void
  teachers: Teacher[]
  rooms: Room[]
  instruments: Instrument[]
}

export function CalendarFiltersComponent({
  filters,
  onFiltersChange,
  teachers,
  rooms,
  instruments,
}: CalendarFiltersProps) {
  const lessonTypes = [
    { value: "individual-stationary", label: "Lekcje indywidualne" },
    { value: "individual-online", label: "Lekcje online" },
    { value: "group", label: "Zajęcia grupowe" },
    { value: "children", label: "Zajęcia dla dzieci" },
    { value: "academy", label: "Akademia" },
    { value: "residency", label: "Rezydencja" },
    { value: "practice-room", label: "Sala prób" },
    { value: "concert-hall", label: "Studio koncertowe" },
  ]

  const addFilter = (category: keyof CalendarFilters, value: string) => {
    if (value === "") return // Ignoruj puste wartości
    if (!filters[category].includes(value)) {
      onFiltersChange({
        ...filters,
        [category]: [...filters[category], value],
      })
    }
  }

  const removeFilter = (category: keyof CalendarFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [category]: filters[category].filter((item) => item !== value),
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      teachers: [],
      rooms: [],
      instruments: [],
      lessonTypes: [],
    })
  }

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtry kalendarza
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Wyczyść wszystkie
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nauczyciele</label>
            <Select onValueChange={(value) => addFilter("teachers", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz nauczyciela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-teachers">Wszyscy nauczyciele</SelectItem>
                {teachers
                  .filter((teacher) => !filters.teachers.includes(teacher.name))
                  .map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.name}>
                      {teacher.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sale</label>
            <Select onValueChange={(value) => addFilter("rooms", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz salę" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-rooms">Wszystkie sale</SelectItem>
                {rooms
                  .filter((room) => !filters.rooms.includes(room.name))
                  .map((room) => (
                    <SelectItem key={room.id} value={room.name}>
                      {room.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Instrumenty</label>
            <Select onValueChange={(value) => addFilter("instruments", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-instruments">Wszystkie instrumenty</SelectItem>
                {instruments
                  .filter((instrument) => !filters.instruments.includes(instrument.name))
                  .map((instrument) => (
                    <SelectItem key={instrument.id} value={instrument.name}>
                      {instrument.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Typy zajęć</label>
            <Select onValueChange={(value) => addFilter("lessonTypes", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-lesson-types">Wszystkie typy</SelectItem>
                {lessonTypes
                  .filter((type) => !filters.lessonTypes.includes(type.value))
                  .map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Aktywne filtry:</label>
            <div className="flex flex-wrap gap-2">
              {filters.teachers.map((teacher) => (
                <Badge key={teacher} variant="secondary" className="flex items-center gap-1">
                  Nauczyciel: {teacher}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter("teachers", teacher)} />
                </Badge>
              ))}
              {filters.rooms.map((room) => (
                <Badge key={room} variant="secondary" className="flex items-center gap-1">
                  Sala: {room}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter("rooms", room)} />
                </Badge>
              ))}
              {filters.instruments.map((instrument) => (
                <Badge key={instrument} variant="secondary" className="flex items-center gap-1">
                  Instrument: {instrument}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter("instruments", instrument)} />
                </Badge>
              ))}
              {filters.lessonTypes.map((type) => (
                <Badge key={type} variant="secondary" className="flex items-center gap-1">
                  Typ: {lessonTypes.find((t) => t.value === type)?.label}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter("lessonTypes", type)} />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
