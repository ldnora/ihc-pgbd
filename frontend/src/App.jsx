import React, { useState, useEffect } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createEventModalPlugin } from '@schedule-x/event-modal'

import '@schedule-x/theme-default/dist/index.css'

function CalendarApp() {
    const [events, setEvents] = useState([
        {
            id: '1',
            title: 'Evento 1',
            start: '2024-12-03 04:00',
            end: '2024-12-03 05:00',
        },
    ]);

    const eventsService = useState(() => createEventsServicePlugin())[0];

    const calendar = useCalendarApp({
        locale: 'pt-BR',
        isDark: true,
        firstDayOfWeek: 0,
        views: [
            createViewDay(),
            createViewWeek(),
            createViewMonthGrid(),
            createViewMonthAgenda(),
        ],
        events: events,
        plugins: [
            eventsService,
            createDragAndDropPlugin(),
            createResizePlugin(),
            createCurrentTimePlugin(),
            createEventModalPlugin(),
        ],
    });

    useEffect(() => {
        eventsService.getAll();
    }, [eventsService]);

    const handleDateSelect = ({ start, end }) => {
        const title = prompt('Digite o título do evento:');
        if (title) {
            const newEvent = { id: `${events.length + 1}`, title, start, end };
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
    };

    return (
        <div>
            <ScheduleXCalendar
                calendarApp={calendar}
                onDateRangeSelect={handleDateSelect} // Listener para clique e arraste
                selectable
            />
        </div>
    );
}

export default CalendarApp;
