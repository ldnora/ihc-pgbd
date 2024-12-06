"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Description } from "@radix-ui/react-dialog";

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDescription, setNewDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const eventInfoDialogRef = useRef<HTMLDialogElement | null>(null);
  const eventDialogRef = useRef<HTMLDialogElement | null>(null);


  useEffect(() => {
    // Load events from local storage when the component mounts
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    // Save events to local storage whenever they change
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = (event: EventApi) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      event.remove(); // Remove o evento do FullCalendar.
      eventInfoDialogRef.current.close(); // Fecha o diálogo de informações.
    }
  };
  

  const handleEditEvent = (event: React.SetStateAction<EventApi | null>) => {
    // Preenche os inputs do formulário com os valores do evento selecionado.
    setNewEventTitle(event.title);
    setNewDescription(event.extendedProps.description || "");
    setSelectedEvent(event); // Mantém o evento atual para salvar alterações.
    
    // Fecha o diálogo de informações e abre o diálogo de cadastro.
    eventInfoDialogRef.current.close();
    eventDialogRef.current.showModal(); // Reutiliza o diálogo de cadastro.
  };
  
  const handleSaveEditedEvent = () => {
    if (selectedEvent) {
      selectedEvent.setProp("title", newEventTitle);
      selectedEvent.setExtendedProp("description", newEventDescription);
      eventDialogRef.current.close(); // Fecha o diálogo de cadastro.
    }
  };
  

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
    setNewDescription("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar; // Get the calendar API instance.
      calendarApi.unselect(); // Unselect the date range.

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        description: newEventDescription,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
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
                    })}{" "}
                    {/* Format event start date */}
                  </label>
                </li>
              ))}
          </ul>
        </div>

        <div className="w-9/12 mt-8">
          <FullCalendar
            height={"85vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Initialize calendar with required plugins.
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }} // Set header toolbar options.
            initialView="dayGridMonth" // Initial view mode of the calendar.
            editable={true} // Allow events to be edited.
            selectable={true} // Allow dates to be selectable.
            selectMirror={true} // Mirror selections visually.
            dayMaxEvents={true} // Limit the number of events displayed per day.
            select={handleDateClick} // Handle date selection to create new events.
            eventClick={(info) => {
              setSelectedEvent(info.event);
              eventInfoDialogRef.current.showModal();
            }} // Handle clicking on events (e.g., to delete them).
            eventsSet={(events) => setCurrentEvents(events)} // Update state with current events whenever they change.
            initialEvents={
              typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("events") || "[]")
                : []
            } // Initial events loaded from local storage.
          />
        </div>
      </div>

      {/* Dialog for adding new events */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event Details</DialogTitle>
          </DialogHeader>
          <form className="space-x-5 mb-4" onSubmit={handleAddEvent}>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)} // Update new event title as the user types.
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
                Add
              </button>{" "}
              {/* Button to submit new event */}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <dialog ref={eventInfoDialogRef} className="rounded-md bg-white p-5 shadow-lg">
        {selectedEvent && (
          <div>
            <h2 className="text-xl font-bold mb-3">{selectedEvent.title}</h2>
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

            {/* Botões */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditEvent(selectedEvent)} // Função de edição
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(selectedEvent)} // Função de exclusão
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {/* Botão para fechar */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => eventInfoDialogRef.current.close()} // Fecha o diálogo
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default Calendar; // Export the Calendar component for use in other parts of the application.
