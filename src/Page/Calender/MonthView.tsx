import React from 'react'
import FullCalendar from '@fullcalendar/react'
import monthGridPlugin from '@fullcalendar/daygrid'
const MonthView = () => {
  return (
    <>
      <FullCalendar
        plugins={[monthGridPlugin]}
        initialView='dayGridMonth'
        weekends={true}
        events=''
        headerToolbar={{
          left: '',
          center: 'prev,title,next',
          right: '',
        }}
      />
    </>
  )
}

export default MonthView
