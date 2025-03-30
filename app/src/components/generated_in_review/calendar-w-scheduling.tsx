'use client';

import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
  addWeeks,
  subWeeks,
} from "date-fns";

interface Event {
  date: Date;
  title: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventTitle, setEventTitle] = useState("");

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const goToNextMonth = () => setCurrentDate(addDays(endOfMonth(currentDate), 1));
  const goToPrevMonth = () => setCurrentDate(addDays(startOfMonth(currentDate), -1));

  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToPrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleAddEvent = () => {
    if (selectedDate && eventTitle.trim() !== "") {
      setEvents([...events, { date: selectedDate, title: eventTitle }]);
      setEventTitle("");
    }
  };

  return (
    <div className="p-4 w-full max-w-4xl border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPrevMonth} className="p-2 bg-gray-200 rounded">&#8592; Prev Month</button>
        <h2 className="text-xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={goToNextMonth} className="p-2 bg-gray-200 rounded">Next Month &#8594;</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold">{day}</div>
        ))}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`p-4 text-center border rounded cursor-pointer ${
              isSameDay(day, new Date()) ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => handleDayClick(day)}
          >
            <div>{format(day, "d")}</div>
            <div className="text-xs text-gray-600">
              {events
                .filter((event) => isSameDay(event.date, day))
                .map((event, index) => (
                  <div key={index} className="bg-green-200 p-1 rounded mt-1">
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
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
          <button
            className="mt-2 p-2 bg-green-500 text-white rounded"
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
