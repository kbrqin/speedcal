"use client";

import EventCreateTest from "@/components/event-create-test";
import EventFetchTest from "@/components/event-fetch-test";
import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
import CalendarSmall from "@/components/generated_in_review/calendar-small";
import Image from "next/image";
import CalendarMain from "@/components/calendar/calendar-main";
import { useEffect, useState } from "react";
import { fetchEvents } from "@/lib/event-actions";
import { redirect } from "next/dist/server/api-utils";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { EnumCalendarType } from "@/lib/types";
import { create } from "domain";
import { importCalendars } from "@/lib/calendar-actions";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
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

  async function handleImportCalendars() {
    if (session !== null) {
      console.log("importing calendars.....");
      const response = await importCalendars(session.provider_token);
      console.log(response);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <UserGreetText />
        <Button onClick={handleImportCalendars}>
          Load Calendars
        </Button>
        {/* <EventCreateTest /> */}
        {/* <CalendarSmall /> */}
        {/* <CalendarMain /> */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <LoginButton />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
