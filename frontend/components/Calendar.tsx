"use client";

import React, { useState, useEffect } from "react";
import {
  formatDate,
  DateSelectArg,
  EventApi,
  EventDropArg,
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

import eventoService from '../services/eventoService';

interface CalendarEvent {
  id: string | number;
  title: string;
  description?: string;
  start: string;
  end: string;
  extendedProps?: {
    description?: string;
  };
}

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([]);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState<boolean>(false);
  const [isEventInfoDialogOpen, setIsEventInfoDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDescription, setNewDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await eventoService.getAllEventos();
        const formattedEvents = events.map((event: any) => ({
          id: event.evento_id,
          title: event.nome,
          description: event.descricao,
          start: event.data_inicio,
          end: event.data_fim,
          extendedProps: {
            description: event.descricao
          }
        }));
        setCurrentEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []); // Dependência vazia para executar apenas na montagem

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsNewEventDialogOpen(true);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        categoria_id: null,
        nome: newEventTitle,
        descricao: newEventDescription || "",
        data_inicio: selectedDate.start.toISOString(),
        data_fim: selectedDate.end?.toISOString() || selectedDate.start.toISOString(),
      };

      try {
        const createdEvent = await eventoService.criarEvento(newEvent);
        setCurrentEvents((prev) => [...prev, {
          id: createdEvent.data.evento_id,
          title: createdEvent.data.nome,
          description: createdEvent.data.descricao,
          start: createdEvent.data.data_inicio,
          end: createdEvent.data.data_fim
        }]);
        setIsNewEventDialogOpen(false);
        setNewEventTitle("");
        setNewDescription("");
      } catch (error) {
        console.error("Erro ao criar evento:", error);
      }
    }
  };

  const handleEditEvent = (event: EventApi) => {
    setNewEventTitle(event.title);
    setNewDescription(event.extendedProps.description || "");
    setSelectedEvent(event);
    setIsEventInfoDialogOpen(false);
    setIsNewEventDialogOpen(true);
  };

  const handleSaveEditedEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEvent) {
      const updatedEvent = {
        id: selectedEvent.id,
        title: newEventTitle || selectedEvent.title,
        description: newEventDescription || null,
      };

      try {
        await eventoService.atualizarTituloDescricaoEvento(
          updatedEvent.id,
          updatedEvent.title,
          updatedEvent.description
        );

        setCurrentEvents((prevEvents) => {
          // Criamos um novo array sem o evento deletado
          const updatedEvents = prevEvents.filter(
            (currentEvent) => String(currentEvent.id) !== String(updatedEvent.id)
          );
          return updatedEvents;
        });

        closeAllDialogs();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteEvent = async (event: EventApi) => {
    if (window.confirm("Tem certeza de que deseja excluir este evento?")) {
      try {
        // Primeiro, vamos deletar do backend
        await eventoService.deletarEvento(event.id);

        // Depois, atualizamos o estado local usando o setCurrentEvents
        setCurrentEvents((prevEvents) => {
          // Criamos um novo array sem o evento deletado
          const updatedEvents = prevEvents.filter(
            (currentEvent) => String(currentEvent.id) !== String(event.id)
          );
          return updatedEvents;
        });

        // Fechamos o modal
        setIsEventInfoDialogOpen(false);

        alert("Evento excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
        alert("Erro ao excluir evento. Tente novamente.");
      }
    }
  };

  const handleEventDrop = async (info: EventDropArg) => {
    const { event } = info;

    const updatedEvent = {
      id: event.id,
      start: event.start?.toISOString(),
      end: event.end?.toISOString(),
    };

    try {
      await eventoService.atualizarHorarioEvento(
        updatedEvent.id,
        updatedEvent.start,
        updatedEvent.end
      );

      setCurrentEvents((prevEvents) => {
        // Criamos um novo array sem o evento deletado
        const updatedEvents = prevEvents.filter(
          (currentEvent) => String(currentEvent.id) !== String(event.id)
        );
        return updatedEvents;
      });
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      alert("Erro ao atualizar evento. Tente novamente.");

      info.revert();
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
            Calendário de eventos
          </div>
          <ul className="space-y-4">
            {currentEvents.length <= 0 && (
              <div className="italic text-center text-gray-400">
                No Events Present
              </div>
            )}

            {currentEvents.length > 0 &&
              currentEvents.map((event: any) => (
                <li
                  className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
                  key={event.id}
                >
                  {event.title}
                  <br />
                  <label className="text-slate-950">
                    {formatDate(event.start, {
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
            locale={'pt-br'}
            timeZone={'America/Sao_Paulo'}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={(info) => {
              setSelectedEvent(info.event);
              setIsEventInfoDialogOpen(true);
            }}
            events={currentEvents}
            eventDrop={handleEventDrop}
            eventResize={handleEventDrop}
            key={currentEvents.length} // Força re-renderização quando eventos mudam
            forceEventDuration={true}
            eventContent={(eventInfo) => {
              return (
                <div>
                  <p>{eventInfo.event.title}</p>
                  {eventInfo.event.extendedProps.description && (
                    <small>{eventInfo.event.extendedProps.description}</small>
                  )}
                </div>
              );
            }}
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