"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { fetchCalendars } from "@/lib/calendar-actions";
import LoginButton from "../LoginLogoutButton";
import CalendarSmall from "../generated_in_review/calendar-small";
import { Button } from "@/components/ui/button";
import { importCalendars } from "@/lib/calendar-actions";

const SidebarLeft = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [calendars, setCalendars] = useState<any[]>([]);

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
    const loadCalendars = async () => {
      const data = await fetchCalendars();
      if (data !== null) {
        setCalendars(data ?? []);
        console.log("Fetched calendars:", data);
      }
    };
    loadCalendars();
  }, []);

  async function handleImportCalendars() {
    if (session !== null) {
      console.log("importing calendars.....");
      await importCalendars(session.provider_token);
    }
  }

  return (
    <div className="flex flex-col gap-4 px-2 py-4">
      <LoginButton />

      <CalendarSmall />

      <div className="text-sm">
        {calendars.length > 0 ? (
          <div>
            <h2 className="font-semibold">Calendars:</h2>
            <ul>
              {calendars.map((calendar, index) => (
                <li key={calendar.id}>
                  <p>{calendar.name}</p>{" "}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No calendars available.</p>
        )}
      </div>
      <Button size="sm" variant="outline" onClick={handleImportCalendars}>
        Load Calendars
      </Button>
    </div>
  );
};
export default SidebarLeft;
