import React, { useState } from 'react';
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

interface tabMemberProps {
  tabChoose: (tab: string, select: string) => void;
  startTime:string;
  endTime:string;
  selectedDate:string;
  setStartTime:any;
  setEndTime:any;
  setSelectedDate:any;
}
const ResourceSchedule = ({ setStartTime,setEndTime,setSelectedDate,startTime,endTime,selectedDate,tabChoose }: tabMemberProps) => {
  const scheduleFunction = () => {
    tabChoose("billing", "schedule")
  }
  const backDetails = () => {
    tabChoose("", "")
  }
  


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

  const timeOptions = [
    { id: 1, label: '1 AM' },
    { id: 2, label: '2 AM' },
    { id: 3, label: '3 AM' },
    { id: 4, label: '4 AM' },
    { id: 5, label: '5 AM' },
    { id: 6, label: '6 AM' },
    { id: 7, label: '7 AM' },
    { id: 8, label: '8 AM' },
    { id: 9, label: '9 AM' },
    { id: 10, label: '10 AM' },
    { id: 11, label: '11 AM' },
    { id: 12, label: '12 PM' },
    { id: 13, label: '1 PM' },
    { id: 14, label: '2 PM' },
    { id: 15, label: '3 PM' },
    { id: 16, label: '4 PM' },
    { id: 17, label: '5 PM' },
    { id: 18, label: '6 PM' },
    { id: 19, label: '7 PM' },
    { id: 20, label: '8 PM' },
    { id: 21, label: '9 PM' },
    { id: 22, label: '10 PM' },
    { id: 23, label: '11 PM' },
    { id: 24, label: '12 AM' }
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
          <h6><img  src={calenderBlue} alt="calender" /> Scheduling</h6>
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
                      <Dropdown.Item eventKey={option.label} key={option.id}>
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
                      <Dropdown.Item eventKey={option.label} key={option.id}>
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
              <img  src={calenderIcon} alt="calender" />
                <p className='mb-0 mt-2'>{selectedDate}</p> 
              </div>
              <div>
              <img  src={clockDark} alt="calender" />
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