import React,{useEffect,useState} from 'react';
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
import { getTaskList } from '../../api/task';
import moment from 'moment';
import { DESKIE_API as API } from '../../config';
import memberBlank from "../../Assets/Images/icon/memberAvatar.png";

const Calender = () => {
    const [taskList, setTaskList] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
console.log('upcomingTasks',upcomingTasks);

    useEffect(() => {
        getTaskList("ALL").then((data) => {
            const transformedTasks = data.map((task:any) => ({
                title: task.title,
                status: task.status,
                date: new Date(task.dueDate).toISOString().split('T')[0] // Convert dueDate to date format
            }));
            setTaskList(transformedTasks);
            const currentDate = new Date().toISOString().split('T')[0];
            const upcoming = data.filter((task:any) => task.dueDate >= currentDate);
            const sortedUpcoming:any = upcoming.sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 2);
            setUpcomingTasks(sortedUpcoming);
        });
    }, [])
   

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
                                {upcomingTasks && upcomingTasks.map((event:any)=><div className="eventDetails">
                                {event.task_image ? <img src={`${API}/${event.task_image}`} alt="event" />
                                : <img src={memberBlank} alt="event" />} 
                                    <div className='eventInfo'>
                                        <p>{event.title}</p>
                                        <div className='eventCategory'>
                                            <button>Task</button>
                                            <span> <FontAwesomeIcon icon={faCircle} /> {moment(event.dueDate).format('MMM D, YYYY')}</span>
                                        </div>
                                    </div>
                                </div>)}
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
                                events={taskList}
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