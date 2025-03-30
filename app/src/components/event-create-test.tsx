"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const EventCreateTest = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [start, setStart] = useState<Date | null>(new Date);
  const [end, setEnd] = useState<Date | null>(new Date());
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventDescription, setEventDescription] = useState<string | null>(null);

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
        console.log(data);
        setSession(data.session);
        console.log(data.session);
      }
    };
    fetchSession();
  }, []);

  const createEvent = async () => {
    console.log(session.provider_token);
    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
        },
        body: JSON.stringify({
          summary: eventName,
          description: eventDescription,
          start: {
            dateTime: start?.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: end?.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
      }
    )
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  if (user !== null && session !== null) {

    return (
      <div className="flex flex-col gap-4">
        <p>event name</p>
        <input
          type="text"
          value={eventName ?? ""}
          onChange={(e) => setEventName(e.target.value)}
        />
        <p>event desc</p>
        <input
          type="text"
          value={eventDescription ?? ""}
          onChange={(e) => setEventDescription(e.target.value)}
        />
        <p>start</p>
        <input
          type="datetime-local"
          value={start ? start.toISOString().slice(0, 16) : ""}
          onChange={(e) =>
            setStart(e.target.value ? new Date(e.target.value) : null)
          }
        />
        <p>end</p>
        <input
          type="datetime-local"
          value={end ? end.toISOString().slice(0, 16) : ""}
          onChange={(e) =>
            setEnd(e.target.value ? new Date(e.target.value) : null)
          }
        />
        <Button type="button" onClick={() => createEvent()}>create event</Button>
      </div>
    );
  } else return <></>;
};

export default EventCreateTest;
