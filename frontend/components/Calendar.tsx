"use client";

import React, { useState, useEffect } from "react";
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState<boolean>(false);
  const [isEventInfoDialogOpen, setIsEventInfoDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDescription, setNewDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  useEffect(() => {
    // Save events to local storage whenever they change
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsNewEventDialogOpen(true);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        description: newEventDescription,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };

      calendarApi.addEvent(newEvent);
      setIsNewEventDialogOpen(false);
      setNewEventTitle("");
      setNewDescription("");
    }
  };

  const handleEditEvent = (event: EventApi) => {
    setNewEventTitle(event.title);
    setNewDescription(event.extendedProps.description || "");
    setSelectedEvent(event);
    setIsEventInfoDialogOpen(false);
    setIsNewEventDialogOpen(true);
  };

  const handleSaveEditedEvent = () => {
    if (selectedEvent) {
      selectedEvent.setProp("title", newEventTitle);
      selectedEvent.setExtendedProp("description", newEventDescription);
      setIsNewEventDialogOpen(false);
    }
  };

  const handleDeleteEvent = (event: EventApi) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      event.remove();
      setIsEventInfoDialogOpen(false);
    }
  };

  const closeAllDialogs = () => {
    setIsNewEventDialogOpen(false);
    setIsEventInfoDialogOpen(false);
    setNewEventTitle("");
    setNewDescription("");
    setSelectedEvent(null);
  };

  return (
    <div>
      <div className="flex w-full px-10 justify-start items-start gap-8">
        <div className="w-3/12">
          <div className="py-10 text-2xl font-extrabold px-7">
            Calendar Events
          </div>
          <ul className="space-y-4">
            {currentEvents.length <= 0 && (
              <div className="italic text-center text-gray-400">
                No Events Present
              </div>
            )}

            {currentEvents.length > 0 &&
              currentEvents.map((event: EventApi) => (
                <li
                  className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
                  key={event.id}
                >
                  {event.title}
                  <br />
                  <label className="text-slate-950">
                    {formatDate(event.start!, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </label>
                </li>
              ))}
          </ul>
        </div>

        <div className="w-9/12 mt-8">
          <FullCalendar
            height={"85vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={(info) => {
              setSelectedEvent(info.event);
              setIsEventInfoDialogOpen(true);
            }}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={
              typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("events") || "[]")
                : []
            }
          />
        </div>
      </div>

      {/* Dialog for adding or editing events */}
      <Dialog 
        open={isNewEventDialogOpen} 
        onOpenChange={(open) => {
          if (!open) closeAllDialogs(); // close the dialogs if you click on the 'x'
        }}
        modal
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event Details" : "Add New Event Details"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={selectedEvent ? handleSaveEditedEvent : handleAddEvent}>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
                className="border border-gray-200 p-3 rounded-md text-lg"
              />
              <input
                type="text"
                placeholder="Event Description"
                value={newEventDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="border border-gray-200 p-3 rounded-md text-lg w-full"
              />
              <button
                className="bg-green-500 text-white p-3 mt-5 rounded-md"
                type="submit"
              >
                {selectedEvent ? "Save Changes" : "Add Event"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for event info */}
      <Dialog open={isEventInfoDialogOpen} onOpenChange={setIsEventInfoDialogOpen}>
        <DialogContent>
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              <p className="text-gray-700 mb-3">
                {selectedEvent.extendedProps.description || "No description available."}
              </p>
              <p className="text-sm text-gray-500">
                Start: {selectedEvent.start.toLocaleString()}
              </p>
              {selectedEvent.end && (
                <p className="text-sm text-gray-500">
                  End: {selectedEvent.end.toLocaleString()}
                </p>
              )}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEditEvent(selectedEvent)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(selectedEvent)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
