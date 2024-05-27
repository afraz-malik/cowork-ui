import React, { useState, useEffect } from 'react';
import "./BookTour.css"
import { singleProfile } from '../../api/settings';
import { DESKIE_API as API } from '../../config';
import logo from "../../Assets/Images/logo/logo.png";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import calenderIcon from "../../Assets/Images/icon/calendar-date.png";
import calenderActiveIcon from "../../Assets/Images/icon/calendar-date-active.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import PhoneInput from 'react-phone-input-2';
import { v4 as uuidv4 } from 'uuid';
import { showNotifications } from '../../CommonFunction/toaster';
import { tourAdd, tourTime } from '../../api/tour';
import confirmIcon from "../../Assets/Images/icon/check-circle.png"
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const BookTour = () => {
    const [profile, setProfile] = useState<any>();
    const [selectDate, setSelectDate] = useState("");
    const [selectDay, setSelectDay] = useState("");
    const [selectTime, setSelectTime] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [dateChoose, setDateChoose] = useState(true);
    const [tourInfo, setTourInfo] = useState(false);
    const [confirmBook, setConfirmBook] = useState(false);
    const [tourDate, setTourDate] = useState("");
    const [bookTourDate, setBookTourDate] = useState([]);

    const bookTimes = ["9 AM", "10 AM", "11 AM", "12 AM", "1 PM", "2 PM", "3 PM", "4 PM"];

    const isTimeBooked = (time: string, bookedTimes:any) => {
        return bookedTimes.includes(time) ? "booked" : "";
    };

    useEffect(() => {
        singleProfile().then((data) => {
            setProfile(data.data);
        })

    }, [])

    const handleSelect = (info: any) => {
        setTourDate(info.startStr);
        const selectedDate = info.start;
        const date = new Date(selectedDate);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setSelectDay(dayOfWeek);
        setSelectDate(formattedDate);
        tourTime(info.startStr).then((data) => {
            console.log('tour', data);
            setBookTourDate(data)
        })
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
    };

    const dateAdd = () => {
        setDateChoose(false)
        setTourInfo(true)
    }

    const saveTour = () => {
        let invoiceInfo = {
            "id": uuidv4(),
            "tour_day": selectDay,
            "tour_date": tourDate,
            "tour_time": selectTime,
            "name": name,
            "phone": phoneNumber,
            "email": email
        }
        tourAdd(invoiceInfo).then((data) => {
            if (data.statusCode !== 201) {
                showNotifications("error", data.message);
            }
            else {
                showNotifications("success", data.message);
                setTourInfo(false)
                setConfirmBook(true)
            }
        })
    }



    return (
        <section className='bookTour'>
            <ToastContainer />
            <div className="signUpBox">
                <div className="logo">
                    {profile && profile.company_logo_dark ?
                        <img src={`${API}/${profile.company_logo_dark}`} alt="logo" />
                        : <img src={logo} alt="logo" />
                    }
                </div>
                {dateChoose ? <>
                    <div className="bookCalender">
                        <h6>Book a tour!</h6>
                        <h5>Select a date and time</h5>
                        <div className="selectBook">
                            <div className="selectDate tourView">
                                <h6>Select Date</h6>
                                <FullCalendar
                                    plugins={[dayGridPlugin, interactionPlugin]}
                                    initialView="dayGridMonth"
                                    weekends={true}
                                    select={handleSelect}
                                    selectable={true}
                                    headerToolbar={{
                                        left: '',
                                        center: 'prev,title,next',
                                        right: ""
                                    }}
                                />
                            </div>
                            <div className="selectTime">
                                <h6>Select Time</h6>
                                {selectDay ? <div className="selectedDate">
                                    <img src={calenderActiveIcon} alt="calender" />
                                    <div className='dateTime'>
                                        <div>
                                            <p>{selectDay}</p>
                                            <p>{selectDate}</p>
                                        </div>
                                        <div>
                                            <p>{selectTime}</p>
                                        </div>
                                    </div>
                                </div> : <div className="chooseDate">
                                    <img src={calenderIcon} alt="calender" />
                                    <p>Pick a Date</p>
                                </div>}


                                <div className="pickTime">
                                    <h4>Pick a Time</h4>
                                    {bookTimes.map((time) => (
                                        <button
                                            key={time}
                                            onClick={()=> isTimeBooked(time, bookTourDate) === 'booked' ?   null : setSelectTime(time)  }
                                            className={`
                                            ${selectTime === time ? 'activeTime' : ""} 
                                            ${isTimeBooked(time, bookTourDate) ? 'booked' : ""}
                                          `}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                    {/* <button className={selectTime === "9 AM" ? 'activeTime' : ""} onClick={() => setSelectTime("9 AM")}>9 AM</button>
                                    <button className={selectTime === "10 AM" ? 'activeTime' : ""} onClick={() => setSelectTime("10 AM")}>10 AM</button>
                                    <button className={selectTime === "11 AM" ? 'activeTime' : ""} onClick={() => setSelectTime("11 AM")}>11 AM</button>
                                    <button className={selectTime === "12 AM" ? 'activeTime' : ""} onClick={() => setSelectTime("12 AM")}>12 AM</button>
                                    <button className={selectTime === "1 PM" ? 'activeTime' : ""} onClick={() => setSelectTime("1 PM")}>1 PM</button>
                                    <button className={selectTime === "2 PM" ? 'activeTime' : ""} onClick={() => setSelectTime("2 PM")}>2 PM</button>
                                    <button className={selectTime === "3 PM" ? 'activeTime' : ""} onClick={() => setSelectTime("3 PM")}>3 PM</button>
                                    <button className={selectTime === "4 PM" ? 'activeTime' : ""} onClick={() => setSelectTime("4 PM")}>4 PM</button>
                                */}
                                </div>
                            </div>
                        </div>
                        <div className="bookTourBtn">
                            <button className="back"><FontAwesomeIcon icon={faArrowLeft} /> Back</button>
                            <button className="next" onClick={dateAdd}>Next <FontAwesomeIcon icon={faArrowRight} /></button>
                        </div>
                    </div>
                </> : ""}
                {tourInfo ? <><div className="bookInfo">
                    <h6>Book a tour!</h6>
                    <h5>Select a date and time</h5>
                    <div className='selectTime'>
                        <div className="selectedDate">
                            <img src={calenderActiveIcon} alt="calender" />
                            <div className='dateTime'>
                                <div>
                                    <p>{selectDay}</p>
                                    <p>{selectDate}</p>
                                </div>
                                <div>
                                    <p>{selectTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="memberInput">
                        <label>Name</label>
                        <input type="text" onChange={(e) => setName(e.target.value)} placeholder='Enter your name' className='form-control' required />
                    </div>
                    <div className="numberInput">
                        <label>Phone Number</label>
                        <PhoneInput country={'us'} disableCountryCode={false} onChange={(value) => handlePhoneChange(value)} />
                    </div>
                    <div className="memberInput">
                        <label>Email</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder='Email' className='form-control' required />
                    </div>
                    <div className="bookTourBtn">
                        <button className="back"><FontAwesomeIcon icon={faArrowLeft} /> Back</button>
                        <button className="next" onClick={saveTour}>Next <FontAwesomeIcon icon={faArrowRight} /></button>
                    </div>
                </div></> : ""}

                {confirmBook ? <div className="bookInfo">
                    <div className='text-center mb-3'>
                        <img src={confirmIcon} alt="confirm" />
                    </div>
                    <h6>Booking Confirmed!</h6>
                    <div className='selectTime'>
                        <div className="selectedDate">
                            <img src={calenderActiveIcon} alt="calender" />
                            <div className='dateTime'>
                                <div>
                                    <p>{selectDay}</p>
                                    <p>{selectDate}</p>
                                </div>
                                <div>
                                    <p>{selectTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bookTourBtn">
                        <Link to="/" className="next">Back to website <FontAwesomeIcon icon={faArrowRight} /></Link>
                    </div>
                </div> : ""}


            </div>
        </section>
    )
}

export default BookTour