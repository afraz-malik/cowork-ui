import React from 'react';
import Layout from '../../Component/Layout/Layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import "./Calender.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import avatar from "../../Assets/Images/icon/Avatar.png";
import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import MonthView from './MonthView';

const Calender = () => {

    const events = [
        { title: 'event 1', name: 'saidul', date: '2024-02-18' },
        { title: 'event 2', name: 'saidul', date: '2024-02-22' },
        { title: 'event 3', name: 'saidul', date: '2024-02-20' },
        { title: 'event 4', name: 'saidul', date: '2024-02-20' }
    ];

    return (
        <>
            <Layout>
                <div className='mainContent'>
                    <div className='' style={{ position: 'relative', display: 'flex', background: 'white', height: 'calc(100vh - 139px)' }}>
                        <div className='eventList'>
                            <div className="addEvent">
                                <button> <FontAwesomeIcon icon={faPlus} /> Add Event</button>
                            </div>
                            <div className="monthView">
                                <MonthView/>
                            </div>
                            <div className="eventUpcoming">
                                <div className="eventHeading">
                                    <p>Upcoming Events</p>
                                    <button>See All</button>
                                </div>
                                <div className="eventDetails">
                                    <img src={avatar} alt="event" />
                                    <div className='eventInfo'>
                                        <p>Suite #102</p>
                                        <div className='eventCategory'>
                                            <button>Resource</button>
                                            <span> <FontAwesomeIcon icon={faCircle} /> Jan 27, 2024</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="eventDetails">
                                    <img src={avatar} alt="event" />
                                    <div className='eventInfo'>
                                        <p>Suite #102</p>
                                        <div className='eventCategory'>
                                            <button>Resource</button>
                                            <span> <FontAwesomeIcon icon={faCircle} /> Jan 27, 2024</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="eventFilters">
                                    <h1>Filters</h1>
                                    <div className="filterCheck">
                                        <ul>
                                            <li>
                                                <div> <span className='filterColor filterBlack'></span> <p>Tours</p></div>
                                                <label className="tableCheckBox filterCheckBox">
                                                    <div className="contactCheck">
                                                        <input type="checkbox" name="agreement" />
                                                        <span className="checkmark"></span></div>
                                                </label>
                                            </li>
                                            <li>
                                                <div> <span className='filterColor filterBlue'></span> <p>Asset</p></div>
                                                <label className="tableCheckBox filterCheckBox">
                                                    <div className="contactCheck">
                                                        <input type="checkbox" name="agreement" />
                                                        <span className="checkmark"></span></div>
                                                </label>
                                            </li>
                                            <li>
                                                <div> <span className='filterColor filterGreen'></span> <p>Resource</p></div>
                                                <label className="tableCheckBox filterCheckBox">
                                                    <div className="contactCheck">
                                                        <input type="checkbox" name="agreement" />
                                                        <span className="checkmark"></span></div>
                                                </label>
                                            </li>
                                            <li>
                                                <div> <span className='filterColor filterRed'></span> <p>Maintenance</p></div>
                                                <label className="tableCheckBox filterCheckBox">
                                                    <div className="contactCheck">
                                                        <input type="checkbox" name="agreement" />
                                                        <span className="checkmark"></span></div>
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fullCalenderBox" style={{ width: '80%' }}>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin]}
                                initialView="dayGridMonth"
                                weekends={true}
                                events={events}
                                headerToolbar={{
                                    left: 'today',
                                    center: 'prev,title,next',
                                    right: "dayGridDay,dayGridWeek,dayGridMonth"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Calender