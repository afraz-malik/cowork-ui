import React, { forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons'
import DatePicker from 'react-datepicker'
import calenderIcon from '../../Assets/Images/icon/calendar.svg'

interface DateProps {
  dueDateChange: any
  setDueDate: any
  dueDate: any
}

const DateCalender = ({ dueDate, setDueDate, dueDateChange }: DateProps) => {
  const handleTodayClick = () => {
    setDueDate(new Date())
  }

  const handleYesterdayClick = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    setDueDate(yesterday)
  }

  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => (
    <div>
      <div className='calenderHeading'>
        <button
          className='arrowLeft'
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className='calenderDate'>
          {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button
          className='arrowRight'
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className='calenderBtn'>
        <button onClick={handleYesterdayClick}>Yesterday</button>
        <button onClick={handleTodayClick}>Today</button>
      </div>
    </div>
  )

  const CustomDatePickerInput: React.FC<any> = forwardRef(
    ({ value, onClick }, ref) => (
      <button className='calenderBox requestInputForm' onClick={onClick}>
        {value}
        <img src={calenderIcon} alt='calender' />
      </button>
    )
  )

  return (
    <>
      <DatePicker
        selected={dueDate}
        placeholderText='Select a date'
        onChange={dueDateChange}
        dateFormat='MM/dd/yyyy'
        customInput={<CustomDatePickerInput />}
        renderCustomHeader={CustomHeader}
      />
    </>
  )
}

export default DateCalender
