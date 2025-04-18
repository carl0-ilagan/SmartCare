"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function MiniCalendar({ unavailableDates = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  // Check if a day has an appointment (mock data)
  const hasAppointment = (day) => {
    // Mock data - appointments on the 5th, 12th, and 20th of the month
    return day === 5 || day === 12 || day === 20
  }

  // Check if a day is unavailable
  const isUnavailable = (day) => {
    if (!day) return false

    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return unavailableDates.includes(dateString)
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous month</span>
        </button>

        <h3 className="text-lg font-medium text-graphite">
          {monthNames[month]} {year}
        </h3>

        <button
          onClick={nextMonth}
          className="rounded-md p-1 text-drift-gray hover:bg-pale-stone hover:text-soft-amber"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next month</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Days of week headers */}
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-drift-gray">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`relative flex h-8 items-center justify-center rounded-md text-sm ${
              day === null
                ? "invisible"
                : day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
                  ? "bg-soft-amber font-medium text-white"
                  : isUnavailable(day)
                    ? "bg-red-100 font-medium text-red-500"
                    : hasAppointment(day)
                      ? "bg-pale-stone font-medium text-soft-amber"
                      : "text-graphite hover:bg-pale-stone"
            }`}
          >
            {day !== null && day}
            {day !== null && hasAppointment(day) && !isUnavailable(day) && (
              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-soft-amber"></span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-soft-amber"></div>
          <span className="text-drift-gray">Today</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-pale-stone border border-soft-amber"></div>
          <span className="text-drift-gray">Appointment</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-red-100 border border-red-500"></div>
          <span className="text-drift-gray">Unavailable</span>
        </div>
      </div>
    </div>
  )
}
