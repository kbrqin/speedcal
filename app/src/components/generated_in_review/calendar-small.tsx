"use client";

import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
} from "date-fns";

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

  const goToNextMonth = () =>
    setCurrentDate(addDays(endOfMonth(currentDate), 1));
  const goToPrevMonth = () =>
    setCurrentDate(addDays(startOfMonth(currentDate), -1));

  return (
    <div className="w-full flex flex-col p-0 text-xs">
      <div className="flex justify-between items-center mb-2">
        <button onClick={goToPrevMonth} className="p-0.5 rounded">
          &#8592;
        </button>
        <h2 className="text-sm font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button onClick={goToNextMonth} className="p-0.5 rounded">
          &#8594;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 gap-x-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`p-0.5 text-center border-none rounded ${
              isSameDay(day, today) ? "bg-gray-800 text-white" : ""
            }`}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarSmall;
