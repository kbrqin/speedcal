"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchEvents } from "@/lib/event-actions";

const EventFetchTest = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      if (data !== null) {
        setEvents(data ?? []);
        console.log("Fetched events:", data);
      }
    };
    loadEvents();
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  // const [user, setUser] = useState<any>(null);
  // const [session, setSession] = useState<any>(null);

  // const [events, setEvents] = useState<any>(null);

  // console.log(events);
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     setUser(user);
  //   };
  //   fetchUser();
  //   const fetchSession = async () => {
  //     const { data, error } = await supabase.auth.getSession();
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log(data);
  //       setSession(data.session);
  //       console.log(data.session);
  //     }
  //   };
  //   fetchSession();
  // }, []);

  // const fetchEvents = async () => {
  //   console.log(session.provider_token);
  //   const minDate = new Date();
  //   minDate.setDate(minDate.getDate() - 1);
  //   const maxDate = new Date();
  //   maxDate.setDate(maxDate.getDate() + 6);
  //   await fetch(
  //     `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${minDate.toISOString()}&timeMax=${maxDate.toISOString()}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${session.provider_token}`,
  //       },
  //     }
  //   )
  //     .then((data) => {
  //       return data.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //     });
  // };

  // if (user !== null && session !== null) {

  // async function handleFetchEvents() {
  //   console.log("fetch events");
  //   const events = await fetchEvents();
  //   console.log(events);
  // }
  if (user !== null) {
    return (
      <div className="flex flex-col gap-4">
        {/* <p>
        <Button onClick={() => handleFetchEvents()}>Fetch Events</Button>
      </p> */}
        {/* {events.length > 0 ? "hi" : "no events"} */}
        {events.length > 0 ? (
          <div>
            <h2>Events:</h2>
            <ul>
              {events.map((event, index) => (
                <li key={index}>
                  <p>{index}</p>
                  <strong>{event.name}</strong>{" "}
                  {/* Adjust based on the structure of event */}
                  <p>{event.description}</p> {/* Example description */}
                  <p>{new Date(event.date).toLocaleString()}</p>{" "}
                  {/* Example date */}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No events available.</p>
        )}
      </div>
    );
  }
};

export default EventFetchTest;
