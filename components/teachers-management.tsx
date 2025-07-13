"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Music, Mail, Phone } from "lucide-react"
import type { Teacher } from "@/lib/types"

interface TeachersManagementProps {
  teachers: Teacher[]
}

export function TeachersManagement({ teachers }: TeachersManagementProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Zarządzanie Nauczycielami</CardTitle>
          <CardDescription>Przegląd wszystkich nauczycieli w szkole muzycznej</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachers.map((teacher) => (
              <Card key={teacher.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{teacher.name}</h3>
                        <Badge variant={teacher.available ? "default" : "secondary"}>
                          {teacher.available ? "Dostępny" : "Niedostępny"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Music className="w-4 h-4" />
                        <span className="font-medium">Specjalizacje:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {teacher.instruments.map((instrument, index) => (
                          <Badge key={index} variant="outline">
                            {instrument}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{teacher.phone}</span>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="font-medium">Doświadczenie:</span> {teacher.experience} lat
                    </div>

                    <div className="text-sm">
                      <span className="font-medium">Stawka:</span> {teacher.hourlyRate} zł/h
                    </div>

                    {teacher.bio && <p className="text-sm text-muted-foreground">{teacher.bio}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
