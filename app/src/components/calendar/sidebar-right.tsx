import EventCreateTest from "../event-create-test";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface SidebarRightProps {
  selectedDate: string | null;
  selectedEvent: any | null;
  onClose: () => void;
}

const SidebarRight = ({
  selectedDate,
  selectedEvent,
  onClose,
}: SidebarRightProps) => {
  return (
    <div className="px-2 py-4 text-xs flex flex-col justify-between h-full">
      <div>
        {!(selectedDate || selectedEvent) ? (
          <p>Select a date to create an event.</p>
        ) : (
          <EventCreateTest
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
            onClose={onClose}
          />
        )}
      </div>
      <div className="flex flex-row justify-end">
        <Button variant="outline" className="mr-2 text-gray-500 h-12 w-16">
          <PlusIcon className="h-12 w-12" />
        </Button>
      </div>
    </div>
  );
};

export default SidebarRight;
