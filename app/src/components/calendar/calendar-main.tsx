"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styled from "@emotion/styled";
import { DateClickArg } from "@fullcalendar/interaction";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { fetchEvents } from "@/lib/event-actions";

interface CalendarProps {
  setSelectedDate: (date: string | null) => void;
}

const CalendarMain = ({ setSelectedDate }: CalendarProps) => {
  const StyleWrapper = styled.div`
    .fc {
      font-family: var(--font-geist-sans);
      font-size: 14px;
      color: var(--geist-foreground);
      background-color: var(--geist-background);
      border: 1px solid var(--geist-border);
      border-radius: 8px;
      padding: 20px 0;
      transition: all 0.3s ease;
      height: 100%;
      overflow-y: auto;
    }

    .fc-button {
      background-color: transparent;
      color: var(--geist-button-color);
      border: 1px solid var(--geist-border);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .fc-button:hover {
      background-color: var(--secondary);
      color: var(--geist-button-hover-color);
    }

    .fc-button:active {
      background-color: var(--geist-button-active-background);
      color: var(--geist-button-active-color);
      border-color: var(--geist-button-active-border);
    }

    .fc-button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3);
    }

    .fc-daygrid-day {
      cursor: pointer;
    }

    .fc-toolbar-title {
      font-size: 20px;
      font-weight: 600;
    }

    .fc-today-button {
      background: var(--geist-button-background) !important;
      color: var(--geist-button-color) !important;
      border: 1px solid rgba(0, 0, 0, 0.2) !important;
    }

    .fc-toolbar {
      padding: 0 8px;
      margin-left: 4px;
    }

    .fc-col-header-cell-cushion {
      font-weight: 500;
      font-size: 14px;
    }
    
    .fc-event-title {
      font-weight: 500;
      font-size: 12px;
    }
  `;

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
  };

  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const [eventsList, setEventsList] = useState<any[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      if (data !== null) {
        setEvents(data ?? []);
      }
    };
    loadEvents();

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      setEventsList(
        events.map((event) => ({
          id: event.id,
          title: event.name || "Untitled Event",
          start: event.start_time,
          end: event.end_time,
          allDay: false,
        }))
      );
    }
  }, [events]);

  return (
    <div className="container p-0 w-full h-full flex flex-col">
      <StyleWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "title",
            center: "",
            right: "dayGridMonth,timeGridWeek,timeGridDay today prev,next",
          }}
          buttonText={{
            today: "Today",
            dayGridMonth: "Month",
            timeGridWeek: "Week",
            timeGridDay: "Day",
          }}
          aspectRatio={1.5}
          dateClick={handleDateClick}
          editable={true}
          events={eventsList}
          views={{
            dayGridMonth: {
              dayMaxEvents: 3,
            },
          }}
          contentHeight="auto"
        />
      </StyleWrapper>
    </div>
  );
};

export default CalendarMain;
