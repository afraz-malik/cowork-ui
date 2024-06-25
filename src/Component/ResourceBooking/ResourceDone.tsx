import React from 'react';
import checkCircle from "../../Assets/Images/icon/check-circle.svg"
import calenderIcon from "../../Assets/Images/icon/calendar.svg";
import clockDark from "../../Assets/Images/icon/clockDark.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
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
          <p>Booking Confirmed!</p>
        </div>
        <div className="resourcePayImg">
          <div className='imgLeft'>
            <img src={calenderIcon} alt="calenderIcon" />
            <p>asasas</p>
          </div>
          <div className="chooseTime">
            <div>
              <img src={calenderIcon} alt="calender" />
              <p>asas</p>
            </div>
            <div>
              <img src={clockDark} alt="calender" />
              <p>2 AM - 15 PM</p>
            </div>
          </div>
        </div>
        <div className="payResourceInfo">
          <div>
            <h6>Capacity</h6>
            <p>8 occupants</p>
          </div>
          <div>
            <h6>Capacity</h6>
            <p>8 occupants</p>
          </div>
          <div>
            <h6>Capacity</h6>
            <p>8 occupants</p>
          </div>
        </div>
      </div>
      <div className="resourcesBtn">
        <button className='cancel' onClick={backPay}>Cancel</button>
        <button className='continue' onClick={resourceBooked}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
      </div>
    </>
  )
}

export default ResourceDone