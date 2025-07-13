"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Music } from "lucide-react"
import type { Room } from "@/lib/types"

interface RoomsManagementProps {
  rooms: Room[]
}

export function RoomsManagement({ rooms }: RoomsManagementProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Zarządzanie Salami</CardTitle>
          <CardDescription>Przegląd wszystkich sal w szkole muzycznej</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card key={room.id} className="relative">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">{room.name}</h3>
                      </div>
                      <Badge variant={room.available ? "default" : "secondary"}>
                        {room.available ? "Dostępna" : "Zajęta"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Pojemność: {room.capacity} osób</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Music className="w-4 h-4" />
                        <span className="font-medium">Instrumenty:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {room.instruments.map((instrument, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {instrument}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {room.description && <p className="text-sm text-muted-foreground">{room.description}</p>}

                    <div className="text-xs text-muted-foreground">Cena wynajmu: {room.hourlyRate} zł/h</div>
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
