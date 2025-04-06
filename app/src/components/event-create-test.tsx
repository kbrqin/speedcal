"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createEvent } from "@/lib/event-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchCalendars } from "@/lib/calendar-actions";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventCreateTestProps {
  selectedDate: string | null;
  onClose: () => void;
}

const EventCreateTest = ({ selectedDate, onClose }: EventCreateTestProps) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventDescription, setEventDescription] = useState<string | null>(null);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string | undefined>(
    undefined
  );
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log(error);
      } else {
        setSession(data.session);
      }
    };
    fetchSession();

    const loadCalendars = async () => {
      const data = await fetchCalendars();
      if (data !== null) {
        setCalendars(data ?? []);
        console.log("Fetched calendars:", data);
      }
    };
    loadCalendars();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-").map(Number);

      const startDate = new Date(year, month - 1, day, 9, 0, 0, 0);
      setStart(startDate);

      const endDate = new Date(startDate);
      endDate.setHours(10);
      setEnd(endDate);
    }
  }, [selectedDate]);

  async function handleSubmit(formData: FormData) {
    if (session !== null) {
      console.log("submitting");
      const response = await createEvent(formData, session.provider_token);
      console.log(response);
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "";

    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  if (!user || !session) {
    return <div>Loading...</div>;
  }

  return (
    <form className="flex flex-col gap-2 w-full text-xs">
      <Input
        className="w-full text-xs"
        type="text"
        name="event-name"
        value={eventName ?? ""}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="Event Name"
      />

      <Input
        className="w-full text-xs"
        type="text"
        name="event-description"
        value={eventDescription ?? ""}
        onChange={(e) => setEventDescription(e.target.value)}
        placeholder="Description"
      />

      <Label className="text-xs">
        Start
        <Input
          className="w-full text-xs"
          type="datetime-local"
          name="start"
          value={formatDate(start)}
          onChange={(e) =>
            setStart(e.target.value ? new Date(e.target.value) : null)
          }
        />
      </Label>

      <Label className="text-xs">
        End
        <Input
          className="w-full text-xs"
          type="datetime-local"
          name="end"
          value={formatDate(end)}
          onChange={(e) =>
            setEnd(e.target.value ? new Date(e.target.value) : null)
          }
        />
      </Label>

      <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
        <SelectTrigger className="w-full text-xs">
          <SelectValue placeholder="Calendar" />
        </SelectTrigger>
        {calendars.length > 0 ? (
          <SelectContent className="w-full text-xs">
            {calendars.map((calendar) => (
              <SelectItem
                key={calendar.google_calendar_id}
                value={calendar.google_calendar_id}
              >
                {calendar.name}
              </SelectItem>
            ))}
          </SelectContent>
        ) : (
          <p></p>
        )}
      </Select>
      <input
        type="hidden"
        name="calendar-id"
        value={selectedCalendar ?? "primary"}
      />

      <Button
        className="w-full text-xs"
        variant="default"
        type="submit"
        formAction={handleSubmit}
      >
        Create Event
      </Button>
    </form>
  );
};

export default EventCreateTest;
