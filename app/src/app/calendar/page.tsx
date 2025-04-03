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

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
      <div className="w-full h-screen flex flex-row items-start justify-center overflow-hidden">
        <div className="flex-2 border-r-1 border-gray-100 pr-1 h-full">
          <SidebarLeft />
        </div>
        <div className="flex-11 h-full overflow-y-scroll">
          <CalendarMain setSelectedDate={setSelectedDate} />
        </div>
        <div className="flex-3 border-l-1 border-gray-100 pl-1 h-full">
          <SidebarRight
            selectedDate={selectedDate}
            onClose={() => setSelectedDate(null)}
          />
        </div>
      </div>
    );
  }
};
export default CalendarPage;
