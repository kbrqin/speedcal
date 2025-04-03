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

  if (user !== null) {
    return (
      <div className="flex flex-col gap-4">
        {events.length > 0 ? (
          <div>
            <h2>Events:</h2>
            <ul>
              {events.map((event, index) => (
                <li key={index}>
                  <p>{index}</p>
                  <strong>{event.name}</strong>{" "}
                  <p>{event.description}</p> {/* Example description */}
                  <p>{new Date(event.date).toLocaleString()}</p>{" "}
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
