"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

export default function AppointmentCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Load events from localStorage when the component mounts
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents).map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })));
    }
  }, []);

  const handleSelect = ({ start, end }) => {
    const title = window.prompt('Título de la Cita:');
    if (title) {
      const newEvent = { id: Date.now(), title, start, end, description: '' };
      const newEvents = [...events, newEvent];
      setEvents(newEvents);
      // Save events to localStorage
      localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleEventEdit = (updatedEvent) => {
    const updatedEvents = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    setSelectedEvent(null);
  };

  const handleEventDelete = (eventId) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    setSelectedEvent(null);
  };

  return (
    <div className="relative h-[500px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventClick}
        selectable
        style={{ height: '100%' }}
      />
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEventEdit}
          onDelete={handleEventDelete}
        />
      )}
    </div>
  );
}

// New component for event details modal
function EventModal({ event, onClose, onEdit, onDelete }) {
  const [editedEvent, setEditedEvent] = useState(event);

  const handleSave = () => {
    onEdit(editedEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Detalles de la Cita</h2>
        <input
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={editedEvent.title}
          onChange={(e) => setEditedEvent({...editedEvent, title: e.target.value})}
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={editedEvent.description}
          onChange={(e) => setEditedEvent({...editedEvent, description: e.target.value})}
        />
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>Guardar</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => onDelete(event.id)}>Eliminar</button>
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}