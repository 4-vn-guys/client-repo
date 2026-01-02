"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"

interface DateNavigationProps {
  date: Date
  onDateChange: (date: Date) => void
}

export function DateNavigation({ date, onDateChange }: DateNavigationProps) {
  const [open, setOpen] = useState(false)

  const handlePrevDay = () => {
    const prevDay = new Date(date)
    prevDay.setDate(prevDay.getDate() - 1)
    onDateChange(prevDay)
  }

  const handleNextDay = () => {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    onDateChange(nextDay)
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      onDateChange(newDate)
      setOpen(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 font-normal bg-transparent">
            <CalendarIcon className="size-4" />
            {format(date, "MMM dd, yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={handlePrevDay}>
        <ChevronLeft className="size-4" />
        <span className="sr-only">Previous day</span>
      </Button>

      <Button variant="outline" size="icon" onClick={handleNextDay}>
        <ChevronRight className="size-4" />
        <span className="sr-only">Next day</span>
      </Button>
    </div>
  )
}
