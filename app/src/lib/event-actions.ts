"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

async function googleCreateEvent(formData: FormData, sessionToken: string) {
  console.log("google create event");

  console.log("session", sessionToken);

  console.log("provider token", sessionToken);

  const calendarId = formData.get("calendar-id") as string;

  console.log("calendarId", calendarId);

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
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
  const data = await response.json();

  console.log(data);
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

  const calendarId = formData.get("calendar-id") as string;

  const tableName =
    calendarId ===
    "0e36db86e405f1de20cc7a09347eda289f0c7f85504a401f6328537649319855@group.calendar.google.com"
      ? "tasks"
      : "events_test";

  const { data: event, error } = await supabase.from(tableName).insert(data);
  if (error) {
    console.log(error);
    redirect("/error");
  }
  console.log(event);

  revalidatePath("/calendar", "layout");
  redirect("/calendar");
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

export async function fetchEventCalendarID(eventId: string) {
  const supabase = await createClient();
  console.log("client created");
  const user = supabase.auth.getUser();
  console.log("user", user);
  if (user !== null) {
    const { data: eventData, error } = await supabase
      .from("events_test")
      .select("calendar_id")
      .eq("id", eventId);
    if (error) {
      console.log(error);
      redirect("/error");
    }
    const { data: calendarIds, error: calendarError } = await supabase
      .from("calendars")
      .select("google_calendar_id")
      .eq("calendar_id", eventData[0]?.calendar_id);
    return calendarIds ? calendarIds[0].google_calendar_id : null;
  }
}

export async function deleteEvent(eventId: string, sessionToken: string) {
  const supabase = await createClient();
  console.log("deleting event");
  const user = await supabase.auth.getUser();
  const { data: eventData, error: taskError } = await supabase
    .from("events_test")
    .select("google_event_id, calendar_id")
    .eq("id", eventId)
    .single();

  const { data: calendarData, error: calendarError } = await supabase
    .from("calendars")
    .select("google_calendar_id")
    .eq("id", eventData?.calendar_id)
    .single();

  console.log("google calendar deleting event");

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarData?.google_calendar_id}/events/${eventData?.google_event_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.text();
  console.log(data);

  if (!response.ok) {
    return;
  }
  console.log("supabase deleting event");

  const { data: event, error: deleteError } = await supabase
    .from("events_test")
    .delete()
    .eq("id", eventId);
  if (deleteError) {
    console.log(deleteError);
  } else {
    console.log("event deleted", event);
  }

  revalidatePath("/calendar", "layout");
  redirect("/calendar");
}

export async function deleteTask(eventId: string, sessionToken: string) {
  // TODO: can probably DRY this
  const supabase = await createClient();
  console.log("deleting task");
  const user = await supabase.auth.getUser();

  const { data: taskData, error: taskError } = await supabase
    .from("tasks")
    .select("google_event_id, calendar_id")
    .eq("id", eventId)
    .single();

  const { data: calendarData, error: calendarError } = await supabase
    .from("calendars")
    .select("google_calendar_id")
    .eq("id", taskData?.calendar_id)
    .single();

  console.log("google calendar deleting task");

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarData?.google_calendar_id}/events/${taskData?.google_event_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.text();
  console.log(data);

  if (!response.ok) {
    return;
  }
  console.log("supabase deleting task");

  console.log("eventId", eventId);

  const { data: event, error: deleteError } = await supabase
    .from("tasks")
    .delete()
    .eq("id", eventId);
  if (deleteError) {
    console.log(deleteError);
  } else {
    console.log("task deleted", event);
  }

  revalidatePath("/calendar", "layout");
  redirect("/calendar");
}

export async function fetchTasks() {
  console.log("fetching tasks");
  const supabase = await createClient();
  console.log("client created");
  const user = supabase.auth.getUser();
  console.log("user", user);
  if (user !== null) {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("profile_id", (await user).data.user?.id);
    if (error) {
      console.log(error);
      redirect("/error");
    } else {
      return tasks;
    }
  }
}

export async function updateTaskCompleted(taskId: string) {
  const supabase = await createClient();
  console.log("supabase updating task");

  console.log("task id", taskId);

  const { data: taskToUpdate, error: fetchError } = await supabase
    .from("tasks")
    .select("is_complete")
    .eq("id", taskId)
    .single();

  console.log(taskToUpdate);

  const { data: task, error } = await supabase
    .from("tasks")
    .update({ is_complete: !taskToUpdate?.is_complete })
    .eq("id", taskId);
  if (error) {
    console.log(error);
    redirect("/error");
  } else {
    console.log("task updated", task);
  }
  revalidatePath("/calendar", "layout");
  redirect("/calendar");
}

export async function fetchCalendars() {
  console.log("fetching calendars");
  const supabase = await createClient();
  console.log("client created");
  const user = supabase.auth.getUser();
  console.log("user", user);
  if (user !== null) {
    const { data: calendars, error } = await supabase
      .from("calendars_test")
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
