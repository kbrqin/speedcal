"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createEvent } from "@/lib/event-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { create } from "domain";

const EventCreateTest = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [start, setStart] = useState<Date | null>(new Date());
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

  async function handleSubmit(formData: FormData) {
    if (session !== null) {
      console.log("submitting");
      const response = await createEvent(formData, session.provider_token);
      console.log(response);
    }
  }

  // const createEvent = async () => {
  //   console.log("supabase create event");

  //   console.log(session.provider_token);
  //   await fetch(
  //     "https://www.googleapis.com/calendar/v3/calendars/primary/events",
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${session.provider_token}`,
  //       },
  //       body: JSON.stringify({
  //         summary: eventName,
  //         description: eventDescription,
  //         start: {
  //           dateTime: start?.toISOString(),
  //           timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //         },
  //         end: {
  //           dateTime: end?.toISOString(),
  //           timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //         },
  //       }),
  //     }
  //   )
  //     .then((data) => {
  //       return data.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //     });
  // };

  if (user !== null && session !== null) {
    return (
      <Card>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Label>event name</Label>
            <Input
              type="text"
              name="event-name"
              value={eventName ?? ""}
              onChange={(e) => {
                setEventName(e.target.value);
                console.log(e.target.value);
              }}
            />
            <Label>event desc</Label>
            <Input
              type="text"
              name="event-description"
              value={eventDescription ?? ""}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <Label>start</Label>
            <Input
              type="datetime-local"
              name="start"
              value={start ? start.toISOString().slice(0, 16) : ""}
              onChange={(e) =>
                setStart(e.target.value ? new Date(e.target.value) : null)
              }
            />
            <Label>end</Label>
            <Input
              type="datetime-local"
              name="end"
              value={end ? end.toISOString().slice(0, 16) : ""}
              onChange={(e) =>
                setEnd(e.target.value ? new Date(e.target.value) : null)
              }
            />
            <Button type="submit" formAction={handleSubmit}>
              create event
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  } else return <><div>xxxxx</div></>;
};

export default EventCreateTest;
