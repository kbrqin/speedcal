"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const EventFetchTest = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  const [events, setEvents] = useState<any>(null);

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

  const fetchEvents = async () => {
    console.log(session.provider_token);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 6);
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${minDate.toISOString()}&timeMax=${maxDate.toISOString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.provider_token}`,
        },
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
        <p>
            <Button
                onClick={() => {
                fetchEvents();
                }}
            >
                Fetch Events
            </Button>
        </p>
      </div>
    );
  } else return <></>;
};

export default EventFetchTest;
