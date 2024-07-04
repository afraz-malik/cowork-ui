import React, { useEffect } from 'react';
import { faArrowRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
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

  useEffect(() => {
    const nowDate = new Date();
    const formattedDate = format(nowDate, "yyyy-MM-dd HH:mm:ss.SSS");
    setSelectedDate(formattedDate);
  }, [])
  

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
          <h6><img  src={calenderBlue} alt="calender" /> Scheduling</h6>
        </div>
        <div className="resourceSchedule mt-3">
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
            <div className="timeChoose mt-4">
              <h6>Start and End Time</h6>
              <div className='timeDropdown'>
                <Dropdown onSelect={handleStartSelect}>
                  <Dropdown.Toggle>
                    <button className='filterBtn'>{startTime} <FontAwesomeIcon icon={faChevronDown} /></button>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {timeOptions.map((option) => (
                      <Dropdown.Item eventKey={option.label} key={option.value}>
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
                      <Dropdown.Item eventKey={option.label} key={option.value}>
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <div className="rightSchedule">
            <div className="chooseTime">
              <div>
              <img  src={calenderIcon} alt="calender" />
              {selectedDate.length ?  <p>{formatResourceDate(selectedDate)}</p>  
              :  <p>Choose</p> }
               
              </div>
              <div>
              <img  src={clockDark} alt="calender" />
                <p>{startTime} - {endTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="resourcesBtn">
        <button className='cancel' onClick={backDetails}>Cancel</button>
        <button className='continue' onClick={scheduleFunction}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
      </div>
    </>
  )
}

export default ResourceSchedule