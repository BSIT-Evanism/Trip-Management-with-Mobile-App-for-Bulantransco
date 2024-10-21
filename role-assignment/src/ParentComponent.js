import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Ensure the CSS is also imported


const ParentComponent = () => {
  const [calendarAssignments, setCalendarAssignments] = useState([]);

  const clearCalendar = () => {
    setCalendarAssignments([]); // Clear the calendar's assignments
  };

  return (
    <div>
      <AssignmentContainer clearCalendar={clearCalendar} />
      <Calendar assignments={calendarAssignments} />
    </div>
  );
};

export default ParentComponent;
