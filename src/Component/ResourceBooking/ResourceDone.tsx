import React from 'react';
import checkCircle from "../../Assets/Images/icon/check-circle.svg"
import calenderIcon from "../../Assets/Images/icon/calendar.svg";
import clockDark from "../../Assets/Images/icon/clockDark.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { DESKIE_API as API } from '../../config';
import spaceIcon from "../../Assets/Images/icon/spaceAvatar.png";
import { formatResourceDate } from '../../CommonFunction/Function';


interface tabMemberProps {
  tabChoose: (tab: string, select: string) => void;
  resourceBooked:any;
  resourceDetail:any;
  selectedDate: string;
  startTime: string;
  endTime: string;
}
const ResourceDone = ({selectedDate, startTime,endTime, resourceDetail, tabChoose ,resourceBooked}: tabMemberProps) => {

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
            {resourceDetail.image ?
              <img src={`${API}/${resourceDetail.image}`} alt="avatar" style={{ objectFit: "cover" }} />
              : <img src={spaceIcon} width="100px" height="100px" alt="shop" />
            }
            <p>{resourceDetail.name}</p>
          </div>
          <div className="chooseTime">
            <div>
              <img src={calenderIcon} alt="calender" />
              <p className='mb-0 mt-2'>{formatResourceDate(selectedDate)}</p>
            </div>
            <div>
              <img src={clockDark} alt="calender" />
              <p className='mb-0 mt-2'>{startTime} - {endTime}</p>
            </div>
          </div>
        </div>
        <div className="payResourceInfo">
          <div>
            <h6>Capacity</h6>
            <p className='mb-0 mt-3'>{resourceDetail.capacity} occupants</p>
          </div>
          <div>
            <h6>Type</h6>
            <div className='resourceType' style={{borderLeft: "none", borderRight: "none", padding: "0px"}}>
                {resourceDetail.type === "meeting" ? <span className='meeting'>Meeting Space</span> : ""}
                {resourceDetail.type === "equipment" ? <span className='equipment'>Equipment</span> : ""}
                {resourceDetail.type === "workspace" ? <span className='workspace'>Workspace</span> : ""}
                {resourceDetail.type === "other" ? <span className='other'>Other</span> : ""}
              </div>
          </div>
          <div>
            <h6>Rate</h6>
            <p className='mb-0 mt-3'>{resourceDetail.member_rate}</p>
          </div>
        </div>
      </div>
      <div className="resourcesBtn">
        <button className='cancel' onClick={backPay}><FontAwesomeIcon className='mr-2' icon={faArrowLeft} /> Back</button>
        <button className='continue px-5' onClick={resourceBooked}>Done</button>
      </div>
    </>
  )
}

export default ResourceDone