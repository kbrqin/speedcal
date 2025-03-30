'use client';

import React, { useState } from "react";
import {
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
  addWeeks,
  subWeeks,
  setHours,
  setMinutes,
  isWithinInterval,
} from "date-fns";

interface Event {
  start: Date;
  end: Date;
  title: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartHour, setEventStartHour] = useState<number>(12);
  const [eventEndHour, setEventEndHour] = useState<number>(13);

  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToPrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleAddEvent = () => {
    if (selectedDate && eventTitle.trim() !== "" && eventStartHour < eventEndHour) {
      const eventStart = setMinutes(setHours(selectedDate, eventStartHour), 0);
      const eventEnd = setMinutes(setHours(selectedDate, eventEndHour), 0);
      setEvents([...events, { start: eventStart, end: eventEnd, title: eventTitle }]);
      setEventTitle("");
    }
  };

  return (
    <div className="p-4 w-full max-w-6xl border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPrevWeek} className="p-2 bg-gray-200 rounded">&#8592; Prev Week</button>
        <h2 className="text-xl font-bold">Week of {format(startDate, "PPP")}</h2>
        <button onClick={goToNextWeek} className="p-2 bg-gray-200 rounded">Next Week &#8594;</button>
      </div>
      <div className="grid grid-cols-8 border-t border-l">
        <div className="border-b border-r p-2 text-center font-semibold">Time</div>
        {days.map((day) => (
          <div key={day.toISOString()} className="border-b border-r p-2 text-center font-semibold">
            {format(day, "EEE d")}
          </div>
        ))}
        {hours.map((hour) => (
          <>
            <div key={hour} className="border-r p-2 text-center text-sm">
              {format(setHours(new Date(), hour), "h a")}
            </div>
            {days.map((day) => (
              <div
                key={`${day.toISOString()}-${hour}`}
                className="border-b border-r p-2 h-16 cursor-pointer hover:bg-gray-100 relative"
                onClick={() => handleDayClick(setHours(day, hour))}
              >
                {events
                  .filter((event) =>
                    isSameDay(event.start, day) &&
                    isWithinInterval(setHours(day, hour), { start: event.start, end: event.end })
                  )
                  .map((event, index) => (
                    <div key={index} className="bg-green-200 p-1 rounded absolute w-full">
                      {event.title} ({format(event.start, "h a")} - {format(event.end, "h a")})
                    </div>
                  ))}
              </div>
            ))}
          </>
        ))}
      </div>
      {selectedDate && (
        <div className="mt-4 p-4 border rounded shadow-md">
          <h3 className="text-lg font-semibold">Add Event on {format(selectedDate, "PPP")}</h3>
          <input
            type="text"
            className="border p-2 w-full mt-2"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <div className="flex space-x-2 mt-2">
            <select
              className="border p-2 w-1/2"
              value={eventStartHour}
              onChange={(e) => setEventStartHour(Number(e.target.value))}
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {format(setHours(new Date(), hour), "h a")}
                </option>
              ))}
            </select>
            <select
              className="border p-2 w-1/2"
              value={eventEndHour}
              onChange={(e) => setEventEndHour(Number(e.target.value))}
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {format(setHours(new Date(), hour), "h a")}
                </option>
              ))}
            </select>
          </div>
          <button
            className="mt-2 p-2 bg-green-500 text-white rounded w-full"
            onClick={handleAddEvent}
          >
            Add Event
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
