"use server";
import { createClient } from "@/utils/supabase/server";
import { EnumCalendarType } from "./types";
import { redirect } from "next/navigation";

async function loadCalendars(sessionToken: string) {
  console.log("loading calendars");
  console.log(sessionToken);
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.json();

  console.log(data);
  return data.items;
}

async function supabaseImportCalendar(item: any) {
  console.log("supabase importing calendar");
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user?.id) {
    console.log("No authenticated user found.");
    return;
  }

  const profileId = user.data.user.id;

  // Check if the calendar already exists
  const { data: existingCalendar, error: fetchError } = await supabase
    .from("calendars")
    .select("id") // Only fetching the `id` to minimize data load
    .eq("google_calendar_id", item.id)
    .eq("profile_id", profileId)
    .single(); // Expecting at most one match

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error checking existing calendar:", fetchError);
    return;
  }

  if (existingCalendar) {
    console.log("Calendar already exists, skipping insertion:", existingCalendar);
    return;
  }

  // If calendar doesn't exist, insert it
  const calendar_data = {
    name: item.summary,
    profile_id: profileId,
    google_calendar_id: item.id,
    description: item.description,
    calendar_type: "event" as EnumCalendarType,
    is_primary: item.primary ?? false,
  };

  const { data: newCalendar, error: insertError } = await supabase
    .from("calendars")
    .insert(calendar_data)
    .select(); // Fetch inserted record for confirmation

  if (insertError) {
    console.error("Error inserting calendar:", insertError);
  } else {
    console.log("Calendar inserted successfully:", newCalendar);
  }
}

export async function importCalendars(sessionToken: string) {
  const items = await loadCalendars(sessionToken);
  for (const item of items) {
    await supabaseImportCalendar(item);
  }
}

export async function fetchCalendars() {
  const supabase = await createClient();
  console.log("client created");
  const user = supabase.auth.getUser();
  if (user !== null) {
    const { data: calendars, error } = await supabase
      .from("calendars")
      .select("*")
      .eq("profile_id", (await user).data.user?.id);
    if (error) {
      console.log(error);
      redirect("/error");
    } else {
      return calendars;
    }
  }
}
