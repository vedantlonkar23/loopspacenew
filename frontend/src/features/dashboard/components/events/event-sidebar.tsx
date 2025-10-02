"use client"

import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { CalendarDays, MapPin, Users, Clock, Tag, QrCode, Ticket, Download } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import type { Event } from "@/src/types/user"

interface EventSidebarProps {
  event: Event
  isRegistered: boolean
  onRegister: () => void
}

export default function EventSidebar({ event, isRegistered, onRegister }: EventSidebarProps) {
  // Format date
  const formattedDate = format(new Date(event.date), "MMMM d, yyyy")

  // Format price
  const formattedPrice = event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {/* Registration button at the top for mobile */}
        <div className="md:hidden mb-4">
          {event.status === "published" && (
            <Button className="w-full" onClick={onRegister} disabled={isRegistered}>
              <Ticket className="h-4 w-4 mr-2" />
              {isRegistered ? "Registered" : "Register Now"}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge className="mb-2 text-base sm:text-lg">{formattedPrice}</Badge>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.attendees.length}/{event.capacity || "∞"}
              </span>
            </div>
          </div>

          {/* Event details in a grid for mobile */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-2">
            <div className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">Date</div>
                <div className="text-xs md:text-sm text-muted-foreground">{formattedDate}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">Time</div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {event.startTime} - {event.endTime}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">Location</div>
                <div className="text-xs md:text-sm text-muted-foreground truncate max-w-[120px] md:max-w-none">
                  {event.location || "Online"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Tag className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">Type</div>
                <div className="text-xs md:text-sm text-muted-foreground capitalize">{event.eventType}</div>
              </div>
            </div>
          </div>

          {/* QR code - smaller on mobile */}
          {event.qrCodeUrl && (
            <div className="flex flex-col items-center border rounded-md p-2 sm:p-3 bg-muted/30">
              <QrCode className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2" />
              <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Event QR Code</div>
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 mb-1">
                <Image
                  src={event.qrCodeUrl || "/placeholder.svg"}
                  alt="Event QR Code"
                  fill
                  className="object-contain"
                />
              </div>
              <Button variant="outline" size="sm" className="mt-1 sm:mt-2 w-full text-xs sm:text-sm">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Download
              </Button>
            </div>
          )}

          {/* Registration button - hidden on mobile, shown on desktop */}
          <div className="hidden md:block">
            {event.status === "published" && (
              <Button className="w-full" onClick={onRegister} disabled={isRegistered}>
                <Ticket className="h-4 w-4 mr-2" />
                {isRegistered ? "Registered" : "Register Now"}
              </Button>
            )}
          </div>

          {event.status === "draft" && (
            <div className="rounded-md bg-muted p-2 sm:p-3 text-xs sm:text-sm">
              <div className="font-medium mb-1">Event Draft</div>
              <p className="text-muted-foreground">
                This event is not yet published and is only visible to organizers.
              </p>
            </div>
          )}

          {event.status === "cancelled" && (
            <div className="rounded-md bg-destructive/10 p-2 sm:p-3 text-xs sm:text-sm">
              <div className="font-medium mb-1 text-destructive">Event Cancelled</div>
              <p className="text-muted-foreground">This event has been cancelled by the organizer.</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-2 border-t">
            <div className="flex justify-between mb-1">
              <span>Event Code:</span>
              <span className="font-mono">{event.eventCode}</span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{format(new Date(event.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

