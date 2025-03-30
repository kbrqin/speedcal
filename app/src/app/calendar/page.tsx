"use client";
import CalendarMain from "@/components/calendar/calendar-main";
import EventFetchTest from "@/components/event-fetch-test";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import SidebarLeft from "@/components/calendar/sidebar-left";
import SidebarRight from "@/components/calendar/sidebar-right";

const CalendarPage = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  useEffect(() => {
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
      <div className="w-full flex flex-row items-start justify-center">
        <div className="flex-2">
          <SidebarLeft />
        </div>
        <div className="flex-9">
          <CalendarMain />
          <EventFetchTest />
        </div>
        <div className="flex-3">
          <SidebarRight />
        </div>
      </div>
    );
  }
};
export default CalendarPage;
