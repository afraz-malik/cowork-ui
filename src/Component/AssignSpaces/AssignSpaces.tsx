import React, { useState, useEffect, forwardRef } from 'react'
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faXmark, faChevronDown, faSearch, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import assignmentIcon from "../../Assets/Images/icon/assignmentIcon.png";
import { v4 as uuidv4 } from 'uuid';
import { getSpacesList, memberAddSpaces } from '../../api/spaces';
import { DESKIE_API as API } from '../../config';
import calenderIcon from "../../Assets/Images/icon/calendar.svg";
import { showNotifications } from '../../CommonFunction/toaster';
import { singleMember } from './../../api/member';
import DatePicker from 'react-datepicker';
import { maskEmail } from '../../CommonFunction/Function';
import memberIcon from "../../Assets/Images/icon/memberAvatar.png";
import spaceIcon from "../../Assets/Images/icon/spaceAvatar.png";

interface AssignSpacesProps {
  handleAssignClose: () => void;
  assignShow: boolean;
  setAssignShow: (type: boolean) => void;
  memberId: string;
}

const AssignSpaces = ({ memberId, assignShow, setAssignShow, handleAssignClose }: AssignSpacesProps) => {

  const [authValue, setAuthValue] = useState(false);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [email, setEmail] = useState("");
  const [selectName, setSelectName] = useState("");
  const [selectEmail, setSelectEmail] = useState("");
  const [memberImage, setMemberImage] = useState("");
  const [spaceImage, setSpaceImage] = useState("");
  const [spacesList, setSpacesList] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [searchMembers, setSearchMembers] = useState('');
  const [spacesId, setSpacesId] = useState("");
  const [amount, setAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");

  const initialRenewalDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  };
  const [renewalDate, setRenewalDate] = useState<any>(initialRenewalDate());
  const [frequency, setFrequency] = useState("monthly");


  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setFrequency(eventKey);
      if (eventKey === "daily") {
        const rentForCurrentMonth = ((parseInt(amount) / 30) * 1).toFixed(2);
        setDiscountAmount(rentForCurrentMonth.toString());
        const today = new Date();
        const newRenewalDate = new Date(today);
        newRenewalDate.setDate(today.getDate() + 1);
        setRenewalDate(newRenewalDate);
      }
      else if (eventKey === "weekly") {
        const rentForCurrentMonth = ((parseInt(amount) / 30) * 7).toFixed(2);
        setDiscountAmount(rentForCurrentMonth.toString());
        const today = new Date();
        const newRenewalDate = new Date(today);
        newRenewalDate.setDate(today.getDate() + 7);
        setRenewalDate(newRenewalDate);
      }
      else {
        setDiscountAmount(amount);
        const today = new Date();
        const newRenewalDate = new Date(today);
        newRenewalDate.setDate(today.getDate() + 30);
        setRenewalDate(newRenewalDate);
      }
    }
  };

  useEffect(() => {
    getSpacesList(20, 1).then((data) => {
      if (data.statusCode !== 200) {

      }
      else {
        setSpacesList(data.spaces);
      }
    })
  }, [searchMembers]);

  const filteredSpaces = spacesList?.filter((member: any) =>
    member.name.toLowerCase().includes(searchMembers.toLowerCase())
  );


  useEffect(() => {
    singleMember(memberId).then((data) => {
      setName(data.data && data.data.first_name);
      setEmail(data.data && data.data.email);
      setSpaceImage(data.data && data.data.member_image);
    })
  }, [memberId]);

  const authClick = () => {
    setAuthValue(!authValue)
  }

  const selectMember = (spaces: any) => {
    setSelectName(spaces.name);
    setSpacesId(spaces.id);
    setRate(spaces.rate);
    setMemberImage(spaces.space_image);
    setAmount(spaces.rate);
    setDiscountAmount(spaces.rate);
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const daysRemaining = lastDayOfMonth.getDate() - today.getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const rentForCurrentMonth = ((parseInt(spaces.rate) / daysInMonth) * daysRemaining).toFixed(2);
    setDiscountAmount(rentForCurrentMonth.toString());
    setRenewalDate(lastDayOfMonth)
  };

  const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMembers(e.target.value);
  };

  const saveInvoice = () => {
    const company = localStorage.getItem("company");
    const userInfo = company ? JSON.parse(company) : null;
    let invoiceInfo = {
      "id": uuidv4(),
      "spaces_id": spacesId,
      "member_id": memberId,
      "amount": discountAmount ? discountAmount : amount,
      "renewal_date": renewalDate,
      "renewal_frequency": frequency,
      "user_email": userInfo.user.email
    }

    memberAddSpaces(invoiceInfo).then((data) => {
      if (data.statusCode !== 200) {
        showNotifications("error", data.message);
      }
      else {
        setAssignShow(false);
        setSelectName("");
        setSelectEmail("");
        setSpacesId("");
        setMemberImage("");
        showNotifications("success", data.message);
      }
    })
  }

  const CustomDatePickerInput: React.FC<any> = forwardRef(({ value, onClick }, ref) => (
    <button className="calenderBox requestInputForm" onClick={onClick}>
      {value}
      <img src={calenderIcon} alt="calender" />
    </button>
  ));

  const dueDateChange = (date: any) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    setRenewalDate(selectedDate)
  }

  const calculateRent = () => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysRemaining = lastDayOfMonth.getDate() - today.getDate();
    const rentForCurrentMonth = ((parseInt(amount) / 30) * daysRemaining).toFixed(2);
    setDiscountAmount(rentForCurrentMonth.toString());
    setRenewalDate(lastDayOfMonth)
  }


  
  const handleTodayClick = () => {
    setRenewalDate(new Date());
};

const handleYesterdayClick = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setRenewalDate(yesterday);
};

const CustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }: any) => (
    <div>
        <div className='calenderHeading'>
            <button className='arrowLeft' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}><FontAwesomeIcon icon={faChevronLeft} /></button>
            <span className='calenderDate'>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button className='arrowRight' onClick={increaseMonth} disabled={nextMonthButtonDisabled}><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>
        <div className='calenderBtn'>
            <button onClick={handleYesterdayClick}>Yesterday</button>
            <button onClick={handleTodayClick}>Today</button>
        </div>
    </div>
);

  return (
    <>
      <Modal show={assignShow} onHide={handleAssignClose} centered size="lg" className='assignModal'>
        <div className="addMemberForm">
          <button className='closeModal' onClick={handleAssignClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Container>
            <Row>
              <Col md={12}>
                <div className='addMemberHeading'>
                  <img src={assignmentIcon} alt="member" />
                  <p>Create Assignment</p>
                </div>
              </Col>
              <Col md={12}>
                <div className="memberSpaces">
                  <div className="memberInfos assignBox">

                    <div className="dropdown">
                      <div onClick={(e) => { setIsActive(!isActive); }} className="dropdown-btn" >
                        {/* {selected} */}
                        <div className='d-flex tableImage'>
                          {selectName.length ? <>
                            {memberImage ? <img src={`${API}/${memberImage}`} alt="avatar" style={{ objectFit: "cover" }} />
                              : <img src={spaceIcon} alt="avatar" />}
                            <div>
                              <p>{selectName.length > 20 ? selectName.substring(0, 20) + '...' : selectName}</p>
                              <span>${rate}</span>
                            </div>
                          </> : <>
                            <div><p>Select Spaces</p></div>
                          </>}

                        </div>
                        <span><FontAwesomeIcon icon={faChevronDown} /></span>
                        {/* <span className={isActive ? "fas fa-caret-up" : "fas fa-caret-down"} /> */}
                      </div>
                      <div className="dropdown-content" style={{ display: isActive ? "block" : "none" }}>
                        <div className='assignInput'>
                          <FontAwesomeIcon icon={faSearch} />
                          <input type="text" placeholder='Search member' onChange={handleMemberChange} className='form-control' />
                        </div>
                        {filteredSpaces.map((data: any, index) =>
                          <div onClick={(e) => { setIsActive(!isActive); selectMember(data) }} className="item tableImage" >
                            {data.space_image ? <img src={`${API}/${data.space_image}`} alt="avatar" style={{ objectFit: "cover" }} />
                              : <img src={spaceIcon} alt="avatar" />}
                           <p>{data.name.length > 17 ? data.name.slice(0, 17) + "..." : data.name}</p>
                          </div>)}
                      </div>
                    </div>
                  </div>
                  <div className='arrowIcon'>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                  <div className="memberInfos assignBox tableImage">
                    {spaceImage ? <img src={`${API}/${spaceImage}`} alt="avatar" style={{ objectFit: "cover" }} />
                      : <img src={memberIcon} alt="avatar" />}
                    <div><p>{name}</p><span>{maskEmail(email)}</span></div>
                  </div>
                </div>
              </Col>
              <Col md={12}>
                <div className="assignName">
                  <div className="generateInvoice">
                    <h5>Generate Invoice?</h5>
                    <div className="authToggle">
                      {authValue === true ?
                        <label className="switch">
                          <input type="checkbox" onClick={authClick} defaultChecked />
                          <span className="slider round"></span>
                        </label> :
                        <label className="switch">
                          <input type="checkbox" onClick={authClick} />
                          <span className="slider round"></span>
                        </label>}
                    </div>
                  </div>
                  {authValue ? <>
                    <div className="generateInvoice">
                      <h6>Amount Owed Today</h6>
                      <div className="memberInput amount">
                        <span>$</span>
                        <input type="text" placeholder='Rate' value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} className='form-control' />
                        <button className='calculate'>(Automatically Prorated)</button>
                      </div>
                    </div>
                  </> : <></>}
                  <div className='invoiceSave'>
                    <button type='submit' onClick={saveInvoice}>Save</button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Modal>
    </>
  )
}

export default AssignSpaces