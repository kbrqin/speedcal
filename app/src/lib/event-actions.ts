"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

async function googleCreateEvent(formData: FormData, sessionToken: string) {
  console.log("google create event");

  console.log("session", sessionToken);

  console.log("provider token", sessionToken);

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        summary: formData.get("event-name") as string,
        description: formData.get("event-description") as string,
        start: {
          dateTime: new Date(formData.get("start") as string).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(formData.get("end") as string).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }),
    }
  );
  // Convert the response to JSON
  const data = await response.json();

  console.log(data);

  // Return the eventId
  return data.id;
}
async function supabaseCreateEvent(formData: FormData, eventId: string) {
  const supabase = await createClient();

  console.log("supabase creating event");
  const user = await supabase.auth.getUser();

  const start = formData.get("start") as string;
  const end = formData.get("end") as string;
  const eventName = formData.get("event-name") as string;
  const eventDescription = formData.get("event-description") as string;

  const data = {
    name: eventName,
    description: eventDescription,
    start_time: start,
    end_time: end,
    profile_id: user.data.user?.id,
    google_event_id: eventId,
  };

  const { data: event, error } = await supabase
    .from("events_test")
    .insert(data);
  if (error) {
    console.log(error);
    redirect("/error");
  }
  console.log(event);

  revalidatePath("/", "layout");
  redirect("/");
}

export async function createEvent(formData: FormData, sessionToken: string) {
  const eventId = await googleCreateEvent(formData, sessionToken);
  await supabaseCreateEvent(formData, eventId);
}

export async function fetchEvents() {
  console.log("fetching events");
  const supabase = await createClient();
  console.log("client created");
  const user = supabase.auth.getUser();
  console.log("user", user);
  if (user !== null) {
    const { data: events, error } = await supabase
      .from("events_test")
      .select("*")
      .eq("profile_id", (await user).data.user?.id);
    if (error) {
      console.log(error);
      redirect("/error");
    } else {
      return events;
    }
  }
}
