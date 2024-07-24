import React, { useEffect, useState } from 'react'
import Layout from '../../Component/Layout/Layout'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import './Calender.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import avatar from '../../Assets/Images/icon/Avatar.png'
import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons'
import MonthView from './MonthView'
import { getTaskList } from '../../api/task'
import moment from 'moment'
import { DESKIE_API as API } from '../../config'
import memberBlank from '../../Assets/Images/icon/memberAvatar.svg'
import { getTourList } from '../../api/tour'
interface Task {
  title: string
  filter: string
  date: string
  classNames: string
}
const Calender = () => {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState([])

  useEffect(() => {
    getTaskList('ALL', 'ASC').then((data) => {
      const currentDate = new Date().toISOString().split('T')[0]
      const upcoming = data.filter((task: any) => task.dueDate >= currentDate)
      const sortedUpcoming: any = upcoming
        .sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        .slice(0, 2)
      setUpcomingTasks(sortedUpcoming)
    })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskData = await getTaskList('ALL', 'ASC')
        const tourData = await getTourList()

        const transformedTasks = taskData
          .filter((x: any) => x.status !== 'DONE')
          .map((task: any) => {
            let title = task.title
            if (title.length > 9) {
              title = title.slice(0, 9) + '...'
            }
            return {
              title: title,
              filter: 'task',
              classNames: ['task-background'],
              date: new Date(task.dueDate).toISOString().split('T')[0],
            }
          })

        const transformedTours = tourData.map((tour: any) => {
          let title = tour.name
          if (title.length > 9) {
            title = title.slice(0, 9) + '...'
          }
          return {
            title: title,
            filter: 'tour',
            classNames: ['tour-background'],
            date: new Date(tour.tour_date).toISOString().split('T')[0],
          }
        })

        const mergedList = [...transformedTasks, ...transformedTours]

        setTaskList(mergedList)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Layout>
        <div className='mainContent' id='calendar'>
          <div
            className='calendar'
            style={{
              position: 'relative',
              display: 'flex',
              background: 'white',
              height: 'calc(100vh - 139px)',
            }}
          >
            <div className='eventList justify-content-between d-flex flex-column'>
              {/* <div className="addEvent">
                                <button> <FontAwesomeIcon icon={faPlus} /> Add Event</button>
                            </div> */}
              {/* <div className="monthView" style={{height: 'inherit'}}>
                                <MonthView />
                            </div> */}
              <div className='p-4'>
                <div className='eventHeading pb-3'>
                  <p>Upcoming Events</p>
                  <button>See All</button>
                </div>
                {upcomingTasks &&
                  upcomingTasks.map((event: any) => (
                    <div className='eventDetails bg-white'>
                      {event.task_image ? (
                        <img src={`${API}/${event.task_image}`} alt='event' />
                      ) : (
                        <img
                          className='default'
                          src={memberBlank}
                          alt='event'
                        />
                      )}
                      <div className='eventInfo w-100'>
                        <div className='eventCategory justify-content-between'>
                          <p>
                            {event.title.length > 15
                              ? event.title.slice(0, 15) + '...'
                              : event.title}
                          </p>
                          <button>Task</button>
                        </div>
                        <div className='eventCategory'>
                          <span>
                            {moment(event.dueDate).format('MMM D, YYYY')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className='eventUpcoming pb-0'>
                <div className='eventFilters my-0'>
                  <h1>Filters</h1>
                  <div className='filterCheck mt-3'>
                    <ul className='mb-0'>
                      <li>
                        <div>
                          {' '}
                          <span className='filterColor filterBlack'></span>{' '}
                          <p>Tours</p>
                        </div>
                        <label className='tableCheckBox filterCheckBox'>
                          <div className='contactCheck'>
                            <input type='checkbox' name='agreement' />
                            <span className='checkmark'></span>
                          </div>
                        </label>
                      </li>
                      <li>
                        <div>
                          {' '}
                          <span className='filterColor filterBlue'></span>{' '}
                          <p>Asset</p>
                        </div>
                        <label className='tableCheckBox filterCheckBox'>
                          <div className='contactCheck'>
                            <input type='checkbox' name='agreement' />
                            <span className='checkmark'></span>
                          </div>
                        </label>
                      </li>
                      <li>
                        <div>
                          {' '}
                          <span className='filterColor filterGreen'></span>{' '}
                          <p>Resource</p>
                        </div>
                        <label className='tableCheckBox filterCheckBox'>
                          <div className='contactCheck'>
                            <input type='checkbox' name='agreement' />
                            <span className='checkmark'></span>
                          </div>
                        </label>
                      </li>
                      <li>
                        <div>
                          {' '}
                          <span className='filterColor filterRed'></span>{' '}
                          <p>Maintenance</p>
                        </div>
                        <label className='tableCheckBox filterCheckBox'>
                          <div className='contactCheck'>
                            <input type='checkbox' name='agreement' />
                            <span className='checkmark'></span>
                          </div>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='fullCalenderBox' style={{ width: '80%' }}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView='dayGridMonth'
                weekends={true}
                events={taskList}
                headerToolbar={{
                  left: 'today',
                  center: 'prev,title,next',
                  right: 'dayGridDay,dayGridWeek,dayGridMonth',
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
