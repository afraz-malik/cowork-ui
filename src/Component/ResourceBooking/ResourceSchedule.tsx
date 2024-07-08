import React, { useState, useEffect } from 'react';
import { faArrowRight, faChevronDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FullCalendar from '@fullcalendar/react';
import monthGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dropdown } from 'react-bootstrap';
import calenderIcon from "../../Assets/Images/icon/calendar.svg";
import clockIcon from "../../Assets/Images/icon/clock.svg";
import calenderBlue from "../../Assets/Images/icon/clockBlue.svg";
import clockDark from "../../Assets/Images/icon/clockDark.svg";
import { format, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';
import { formatResourceDate } from '../../CommonFunction/Function';
import { resourceBookTime } from '../../api/resource';

interface tabMemberProps {
  tabChoose: (tab: string, select: string) => void;
  startTime: string;
  endTime: string;
  selectedDate: string;
  setStartTime: any;
  setEndTime: any;
  setSelectedDate: any;
}
const ResourceSchedule = ({ setStartTime, setEndTime, setSelectedDate, startTime, endTime, selectedDate, tabChoose }: tabMemberProps) => {
  const scheduleFunction = () => {
    tabChoose("billing", "schedule")
  }
  const backDetails = () => {
    tabChoose("", "")
  }

  const [bookingTime, setBookingTime] = useState([]);
  const [booked, setBooked] = useState<any>([]);


  const handleDateClick = (info: any) => {
    const nowDate = new Date()
    const combinedDate = setMilliseconds(
      setSeconds(
        setMinutes(
          setHours(info.date, nowDate.getHours()),
          nowDate.getMinutes()
        ),
        nowDate.getSeconds()
      ),
      nowDate.getMilliseconds()
    );
    const formattedDate = format(combinedDate, "yyyy-MM-dd HH:mm:ss.SSS");
    setSelectedDate(formattedDate);
  };

  function getBookingTimes(bookingTime: any, selectedDated: any) {
    const selectedDateObj = new Date(selectedDated);
    const selectedDateStr = selectedDateObj.toISOString().split('T')[0];
    let availableTimes = [];
    for (const booking of bookingTime) {
      const bookDateStr = new Date(booking.book_date).toISOString().split('T')[0];
      if (bookDateStr === selectedDateStr) {
        const startTimeValue = timeOptions.find(option => option.label === booking.start_time)?.value;
        const endTimeValue = timeOptions.find(option => option.label === booking.end_time)?.value;
        if (startTimeValue && endTimeValue) {
          if (startTimeValue <= endTimeValue) {
            for (let i = startTimeValue; i <= endTimeValue; i++) {
              availableTimes.push(i);
            }
          } else {
            for (let i = startTimeValue; i <= 24; i++) {
              availableTimes.push(i);
            }
            for (let i = 1; i <= endTimeValue; i++) {
              availableTimes.push(i);
            }
          }
        }
      }
    }
    availableTimes = Array.from(new Set(availableTimes)).sort((a, b) => a - b);
    return availableTimes.length > 0 ? availableTimes : null;
  }

  useEffect(() => {
    const nowDate = new Date();
    const formattedDate = format(nowDate, "yyyy-MM-dd HH:mm:ss.SSS");
    setSelectedDate(formattedDate);
    resourceBookTime().then((data) => {
      setBookingTime(data.data)
    })


  }, [])

  useEffect(() => {

    const availableTimes = getBookingTimes(bookingTime, selectedDate);
    if (availableTimes) {
      setBooked(availableTimes);
    } else {
      setBooked([]);
    }
  }, [selectedDate, bookingTime])


  const timeOptions = [
    { value: 1, label: '1 AM' },
    { value: 2, label: '2 AM' },
    { value: 3, label: '3 AM' },
    { value: 4, label: '4 AM' },
    { value: 5, label: '5 AM' },
    { value: 6, label: '6 AM' },
    { value: 7, label: '7 AM' },
    { value: 8, label: '8 AM' },
    { value: 9, label: '9 AM' },
    { value: 10, label: '10 AM' },
    { value: 11, label: '11 AM' },
    { value: 12, label: '12 PM' },
    { value: 13, label: '1 PM' },
    { value: 14, label: '2 PM' },
    { value: 15, label: '3 PM' },
    { value: 16, label: '4 PM' },
    { value: 17, label: '5 PM' },
    { value: 18, label: '6 PM' },
    { value: 19, label: '7 PM' },
    { value: 20, label: '8 PM' },
    { value: 21, label: '9 PM' },
    { value: 22, label: '10 PM' },
    { value: 23, label: '11 PM' },
    { value: 24, label: '12 AM' }
  ];

  const handleStartSelect = (eventKey: any) => {
    setStartTime(eventKey);
  };

  const handleEndSelect = (eventKey: any) => {
    setEndTime(eventKey);
  };



  return (
    <>
      <div className="paymentDetails">
        <div className="detailsHeading">
          <h6><img src={calenderBlue} alt="calender" /> Scheduling</h6>
        </div>
        <div className="resourceSchedule">
          <div className='leftSchedule'>
            <div className=" monthView">
              <FullCalendar
                plugins={[monthGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                headerToolbar={{
                  left: '',
                  center: 'prev,title,next',
                  right: ""
                }}
                selectable={true}
                dateClick={handleDateClick}
              />
            </div>
            <div className="timeChoose mt-4 pt-2">
              <h6 className='my-2'>Start and End Time</h6>
              <div className='timeDropdown'>
                <Dropdown onSelect={handleStartSelect}>
                  <Dropdown.Toggle>
                    <button className='filterBtn'>{startTime} <FontAwesomeIcon icon={faChevronDown} /></button>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {timeOptions.map((option) => (
                      <Dropdown.Item eventKey={option.label} key={option.value} disabled={booked.includes(option.value)}>
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <span><FontAwesomeIcon icon={faArrowRight} /></span>
                <Dropdown onSelect={handleEndSelect}>
                  <Dropdown.Toggle>
                    <button className='filterBtn'>{endTime} <FontAwesomeIcon icon={faChevronDown} /></button>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {timeOptions.map((option) => (
                      <Dropdown.Item eventKey={option.label} key={option.value} disabled={booked.includes(option.value)}>
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <div className='vertical-bar'></div>
          <div className="rightSchedule">
            <div className="chooseTime">
              <div>
                <img src={calenderIcon} alt="calender" />
                {selectedDate.length ? <p className='mb-0 mt-2'>{formatResourceDate(selectedDate)}</p>
                  : <p className='mb-0 mt-2'>Choose</p>}
              </div>
              <div>
                <img src={clockDark} alt="calender" />
                <p className='mb-0 mt-2'>{startTime} - {endTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="resourcesBtn">
        <button className='cancel' onClick={backDetails}><FontAwesomeIcon className='mr-2' icon={faArrowLeft} /> Back</button>
        <button className='continue' onClick={scheduleFunction}>Continue <FontAwesomeIcon className='ml-2' icon={faArrowRight} /></button>
      </div>
    </>
  )
}

export default ResourceSchedule