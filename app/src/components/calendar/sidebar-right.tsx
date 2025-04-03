import EventCreateTest from "../event-create-test";

interface SidebarRightProps {
  selectedDate: string | null;
  onClose: () => void;
}

const SidebarRight = ({ selectedDate, onClose }: SidebarRightProps) => {
  return (
    <div className="px-2 py-4 text-xs">
      {!selectedDate ? (
        <p>Select a date to create an event.</p>
      ) : (
        <EventCreateTest selectedDate={selectedDate} onClose={onClose} />
      )}
    </div>
  );
};

export default SidebarRight;
