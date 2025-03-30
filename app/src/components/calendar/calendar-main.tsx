"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import styled from "@emotion/styled";
import { DateClickArg } from "@fullcalendar/interaction";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarMain = () => {
  const StyleWrapper = styled.div`
    .fc {
      font-family: var(--font-geist-sans);
      font-size: 16px;
      color: var(--geist-foreground);
      background-color: var(--geist-background);
      border: 1px solid var(--geist-border);
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    .fc-daygrid-day {
      background-color: var(--geist-background);
      border-radius: 8px;
      padding: 8px;
      margin: 4px;
      cursor: pointer;
    }
    .fc-daygrid-day:hover {
      background-color: var(--geist-hover);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transform: scale(1.02);
    }
    .fc-daygrid-day-number {
      font-weight: bold;
      color: var(--geist-foreground);
    }
    .fc-daygrid-event {
      background-color: var(--geist-event-background);
      color: var(--geist-event-foreground);
      border-radius: 4px;
      padding: 4px;
      margin: 2px;
      text-align: center;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    .fc-daygrid-event:hover {
      background-color: var(--geist-event-hover);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transform: scale(1.02);
    }
    .fc-toolbar-title {
      font-size: 20px;
      font-weight: bold;
      color: var(--geist-foreground);
      text-align: center;
      margin: 16px 0;
    }
    .fc-toolbar-chunk {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    button {
      margin: 0 !important;
    }

    .fc-header-toolbar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .fc-button {
      background-color: var(--geist-button-background);
      color: var(--geist-button-foreground);
      border: 1px solid var(--geist-button-border);
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 0 4px;
    }
    .fc-button:hover {
      background-color: var(--geist-button-hover);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transform: scale(1.02);
    }
    .fc-button:disabled {
      background-color: var(--geist-button-disabled);
      color: var(--geist-button-disabled-foreground);
      cursor: not-allowed;
      opacity: 0.5;
      box-shadow: none;
      transform: none;
    }
    .fc-timegrid-event {
      background-color: var(--geist-event-background);
      color: var(--geist-event-foreground);
      border-radius: 4px;
      padding: 4px;
      margin: 2px;
      text-align: center;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    .fc-timegrid-event:hover {
      background-color: var(--geist-event-hover);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transform: scale(1.02);
    }
  `;
  const handleDateClick = (arg: DateClickArg) => {
    // When a date is clicked
    console.log("Date clicked:", arg.dateStr);
  };
  return (
    <div className="container p-0 w-full">
      <StyleWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          dateClick={handleDateClick}
          editable={true}
        />
      </StyleWrapper>
    </div>
  );
};
export default CalendarMain;
