"use client"

import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Card, CardContent } from "@/src/components/ui/card"
import { Globe, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import type { Event } from "@/src/types/user"

interface EventOrganizerTabProps {
  event: Event
}

export default function EventOrganizerTab({ event }: EventOrganizerTabProps) {
  const organizer = event.organizer

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={organizer.profilePic} alt={organizer.name} />
          <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{organizer.organizationName || organizer.name}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Event Organizer</p>
        </div>
      </div>

      {organizer.organizationDescription && <p className="text-sm">{organizer.organizationDescription}</p>}

      {/* Contact info card for better mobile display */}
      <Card>
        <CardContent className="p-3 sm:p-4 space-y-2">
          {organizer.website && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a
                href={organizer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline truncate"
              >
                {organizer.website}
              </a>
            </div>
          )}

          {organizer.email && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a href={`mailto:${organizer.email}`} className="hover:underline truncate">
                {organizer.email}
              </a>
            </div>
          )}

          {organizer.phoneNumber && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a href={`tel:${organizer.phoneNumber}`} className="hover:underline">
                {organizer.phoneNumber}
              </a>
            </div>
          )}

          {organizer.location && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{organizer.location}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" asChild className="w-full">
        <Link href={`/dashboard/profile/${organizer._id}`}>View Organizer Profile</Link>
      </Button>
    </div>
  )
}

