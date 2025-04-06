"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styled from "@emotion/styled";
import { DateClickArg } from "@fullcalendar/interaction";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import {
  fetchEvents,
  fetchTasks,
  deleteEvent,
  deleteTask,
  updateTaskCompleted,
} from "@/lib/event-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const supabase = createClient();
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    eventId: string | null;
    calendar: string | null;
  }>({ visible: false, x: 0, y: 0, eventId: null, calendar: null });

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      if (data !== null) {
        setEvents(data ?? []);
      }
    };
    loadEvents();

    const loadTasks = async () => {
      const data = await fetchTasks();
      if (data !== null) {
        setTasks(data ?? []);
      }
    };
    loadTasks();

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
    };
    fetchUser();

    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setSession(data.session);
        console.log(data.session);
      }
    };
    fetchSession();
  }, []);

  // TODO: consolidate down useEffects
  useEffect(() => {
    if (events.length > 0) {
      setEventsList(
        events.map((event) => ({
          id: event.id,
          title: event.name || "untitled event",
          start: event.start_time,
          end: event.end_time,
          allDay: false,
          color: event.color,
          extendedProps: {
            calendar: "events_test", // Set your custom properties here
          },
        }))
      );
    }
    if (tasks.length > 0) {
      setTasksList(
        tasks.map((task) => ({
          id: task.id,
          title: task.name || "untitled task",
          start: task.start_time,
          end: task.end_time,
          allDay: false,
          color: task.color,
          extendedProps: {
            calendar: "tasks", // Set your custom properties here
            is_complete: task.is_complete,
          },
        }))
      );
    }
  }, [events, tasks]);

  useEffect(() => {
    const closeMenu = () =>
      setContextMenu({
        visible: false,
        x: 0,
        y: 0,
        eventId: null,
        calendar: null,
      });
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [contextMenu]);

  const handleDeleteEvent = async () => {
    console.log("Deleting event with ID:", contextMenu.eventId);
    if (
      contextMenu.calendar === "events_test" &&
      contextMenu.eventId &&
      session !== null
    ) {
      const response = await deleteEvent(
        contextMenu.eventId,
        session.provider_token
      );
      console.log(response);
    } else if (contextMenu.calendar === "tasks" && contextMenu.eventId) {
      const response = await deleteTask(
        contextMenu.eventId,
        session.provider_token
      );
      console.log(response);
    }
  };

  async function handleCheckboxChange(taskId: string, isChecked: boolean) {
    // TODO: update the task in supabase
    console.log(
      `Task ${taskId} marked as ${isChecked ? "complete" : "incomplete"}`
    );

    setTasksList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              extendedProps: {
                ...task.extendedProps,
                is_complete: isChecked,
              },
            }
          : task
      )
    );
    const response = await updateTaskCompleted(taskId);
    console.log(response);
  }
  return (
    <div className="container p-0 w-full h-full flex flex-col">
      <StyleWrapper>
        {/* TODO: implement event update, event drag and drop, event resize */}
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
          events={[...eventsList, ...tasksList]}
          views={{
            dayGridMonth: {
              dayMaxEvents: 3,
            },
          }}
          contentHeight="auto"
          eventContent={(info) => {
            const eventColor =
              info.event.backgroundColor ||
              info.event.backgroundColor ||
              "#ffffff";

            if (info.event.extendedProps.calendar === "tasks") {
              const isChecked = info.event.extendedProps.is_complete || false;

              return (
                <div
                  className="flex items-center px-1 py-0.5 rounded text-xs w-full"
                  style={{ backgroundColor: eventColor }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleCheckboxChange(info.event.id, e.target.checked)
                    }
                    style={{ marginRight: "8px" }}
                  />
                  <span>{info.event.title}</span>
                </div>
              );
            }

            return (
              <div
                className="flex items-center px-1 py-0.5 rounded text-xs w-full gap-1"
                style={{ backgroundColor: eventColor }}
              >
                <span>
                  {info.event.start
                    ? (() => {
                        const date = new Date(info.event.start);
                        const hours = date.getHours();
                        const isAM = hours < 12;
                        const hour12 = hours % 12 || 12;
                        return `${hour12}${isAM ? "a" : "p"}`;
                      })()
                    : ""}
                </span>
                <span>{info.event.title}</span>
              </div>
            );
          }}
          eventDidMount={(info) => {
            info.el.addEventListener("contextmenu", (e) => {
              e.preventDefault();
              setContextMenu({
                visible: true,
                x: e.pageX,
                y: e.pageY,
                eventId: info.event.id,
                calendar: info.event.extendedProps.calendar,
              });
            });
          }}
          // eventClick={handleEventClick}
          // eventDrop={handleEventDrop}
          // eventResize={handleEventResize}
        />
      </StyleWrapper>

      {contextMenu.visible && (
        <div
          style={{
            position: "absolute",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 9999,
          }}
          onClick={() => setContextMenu({ ...contextMenu, visible: false })}
        >
          <DropdownMenu
            open={true}
            onOpenChange={(open) =>
              !open && setContextMenu({ ...contextMenu, visible: false })
            }
          >
            <DropdownMenuTrigger asChild>
              <div />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteEvent}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default CalendarMain;
