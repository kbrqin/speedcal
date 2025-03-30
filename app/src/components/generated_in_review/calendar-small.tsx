'use client';

import React, { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, getDay, isSameDay } from "date-fns";

const CalendarSmall = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const today = new Date();

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

  return (
    <div className="p-4 w-96 border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <button onClick={goToPrevMonth} className="p-1 bg-gray-200 rounded">&#8592;</button>
        <h2 className="text-lg font-bold">{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={goToNextMonth} className="p-1 bg-gray-200 rounded">&#8594;</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold">{day}</div>
        ))}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`p-2 text-center border rounded ${isSameDay(day, today) ? 'bg-blue-500 text-white' : ''}`}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarSmall;
