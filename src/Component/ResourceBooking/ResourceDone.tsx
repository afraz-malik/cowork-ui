import React from 'react';
import checkCircle from "../../Assets/Images/icon/check-circle.svg"
import calenderIcon from "../../Assets/Images/icon/calendar.svg";
import clockDark from "../../Assets/Images/icon/clockDark.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


interface tabMemberProps {
  tabChoose: (tab: string, select: string) => void;
  resourceBooked:any
}
const ResourceDone = ({ tabChoose ,resourceBooked}: tabMemberProps) => {
  const navigate = useNavigate();
  const doneFunction = () => {
    return navigate("/resources")
  }
  const backPay = () => {
    tabChoose("billing", "schedule")
  }
  return (
    <>
      <div className="paymentFinish">
        <div className="paymentHeading">
          <img src={checkCircle} alt="checkCircle" />
          <p className='mt-3'>Booking Confirmed!</p>
        </div>
        <div className="resourcePayImg">
          <div className='imgLeft'>
            <img src={calenderIcon} alt="calenderIcon" />
            <p>asasas</p>
          </div>
          <div className="chooseTime">
            <div>
              <img src={calenderIcon} alt="calender" />
              <p className='mb-0 mt-2'>asas</p>
            </div>
            <div>
              <img src={clockDark} alt="calender" />
              <p className='mb-0 mt-2'>2 AM - 15 PM</p>
            </div>
          </div>
        </div>
        <div className="payResourceInfo">
          <div>
            <h6>Capacity</h6>
            <p className='mb-0 mt-3'>8 occupants</p>
          </div>
          <div>
            <h6>Capacity</h6>
            <p className='mb-0 mt-3'>8 occupants</p>
          </div>
          <div>
            <h6>Capacity</h6>
            <p className='mb-0 mt-3'>8 occupants</p>
          </div>
        </div>
      </div>
      <div className="resourcesBtn">
        <button className='cancel' onClick={backPay}><FontAwesomeIcon className='mr-2' icon={faArrowLeft} /> Back</button>
        <button className='continue' onClick={resourceBooked}>Done</button>
      </div>
    </>
  )
}

export default ResourceDone