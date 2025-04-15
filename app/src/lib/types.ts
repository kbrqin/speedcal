export enum EnumCalendarType {
  event = "event",
  task = "task",
}
export interface EventType {
  id: string;
  name: string;
  description: string;
  start: string;
  end: string;
  calendar_id: string;
}
