import React, { useState, useEffect, forwardRef } from 'react'
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faXmark, faChevronDown, faSearch, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import assignmentIcon from "../../Assets/Images/icon/assignmentIcon1.svg";
import "./AssignMember.css";
import { memberAddSpaces, singleSpaces } from '../../api/spaces';
import { DESKIE_API as API } from '../../config';
import { getMemberList } from '../../api/member';
import { showNotifications } from '../../CommonFunction/toaster';
import DatePicker from 'react-datepicker';
import calenderIcon from "../../Assets/Images/icon/calendar.png";
import memberIcon from "../../Assets/Images/icon/memberAvatar.svg";
import spaceIcon from "../../Assets/Images/icon/spaceAvatar.png";
import { v4 as uuidv4 } from 'uuid';

interface AssignMemberProps {
  handleAssignClose: () => void;
  assignShow: boolean;
  setAssignShow: (type: boolean) => void;
  spaceId: string;
}


const AssignMember = ({ spaceId, assignShow, setAssignShow, handleAssignClose }: AssignMemberProps) => {

  const [authValue, setAuthValue] = useState(false);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [selectName, setSelectName] = useState("");
  const [selectEmail, setSelectEmail] = useState("");
  const [memberImage, setMemberImage] = useState("");
  const [spaceImage, setSpaceImage] = useState("");
  const [member, setMember] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [searchMembers, setSearchMembers] = useState('');
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const initialRenewalDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  };
  const [renewalDate, setRenewalDate] = useState<any>(initialRenewalDate());
  const [frequency, setFrequency] = useState("monthly");
  const [discountAmount, setDiscountAmount] = useState("");

  useEffect(() => {
    getMemberList(20, 1).then((data) => {

      if (data.statusCode !== 200) {

      }
      else {
        setMember(data.members);
      }
    })
  }, [searchMembers]);

  const filteredMembers = member?.filter((member: any) =>
    member.first_name.toLowerCase().includes(searchMembers.toLowerCase()) ||
    member.last_name.toLowerCase().includes(searchMembers.toLowerCase()) ||
    member.email.toLowerCase().includes(searchMembers.toLowerCase())
  );

  useEffect(() => {
    singleSpaces(spaceId).then((data) => {
      setName(data.data && data.data.name);
      setRate(data.data && data.data.rate);
      setAmount(data.data && data.data.rate);
      setDiscountAmount(data.data && data.data.rate);
      setSpaceImage(data.data && data.data.space_image);
      const today = new Date();
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      const daysRemaining = lastDayOfMonth.getDate() - today.getDate();
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const rentForCurrentMonth = ((parseInt(data.data && data.data.rate) / daysInMonth) * daysRemaining).toFixed(2);
      setDiscountAmount(rentForCurrentMonth.toString());
      setRenewalDate(lastDayOfMonth)
    })
  }, [spaceId]);

  const authClick = () => {
    setAuthValue(!authValue)
  }

  const selectMember = (member: any) => {
    setSelectName(`${member.first_name} ${member.last_name}`);
    setSelectEmail(member.email)
    setMemberId(member.id)
    setMemberImage(member.member_image)
  };

  const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMembers(e.target.value);
  };

  const saveInvoice = () => {
    const company = localStorage.getItem("company");
    const userInfo = company ? JSON.parse(company) : null;
    let invoiceInfo = {
      "id": uuidv4(),
      "spaces_id": spaceId,
      "member_id": memberId,
      "amount": discountAmount ? discountAmount : amount,
      "renewal_date": renewalDate,
      "renewal_frequency": frequency,
      "user_email": userInfo.user.email,
       "invoice_type": "invoice"
    }

    memberAddSpaces(invoiceInfo).then((data) => {
      if (data.statusCode !== 200) {
        showNotifications("error", data.message);
      }
      else {
        setAssignShow(false);
        setSelectName("");
        setSelectEmail("");
        setMemberId("");
        setMemberImage("");
        showNotifications("success", data.message);
      }
    })
  }

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
      <Modal show={assignShow} onHide={handleAssignClose} centered size="lg" className='assignModal' id="assignMember">
        <div className="addMemberForm">
          <button className='closeModal' onClick={handleAssignClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Container className='px-0'>
            <Row>
              <Col md={12}>
                <div className='addMemberHeading'>
                  <img src={assignmentIcon} alt="member" />
                  <p>Assign</p>
                </div>
              </Col>
              <Col md={12}>
                <div className="memberSpaces">
                  <div className="memberInfos assignBox">
                    <div className="dropdown">
                      <div onClick={(e) => { setIsActive(!isActive); }} className="dropdown-btn" >
                        <div className='d-flex tableImage'>
                          {selectEmail.length ? <>
                            {memberImage ? <img src={`${API}/${memberImage}`} alt="avatar" style={{ objectFit: "cover" }} />
                              : <img className='default' src={memberIcon} alt="avatar" />}
                            <div>
                              <p>{selectName.length > 20 ? selectName.substring(0, 20) + '...' : selectName}</p>
                              <span>{selectEmail.length > 20 ? selectEmail.substring(0, 20) + '...' : selectEmail}</span>
                            </div>
                          </> : <>
                            <div><p>Select Member</p></div>
                          </>}
                        </div>
                        <span><FontAwesomeIcon icon={faChevronDown} /></span>
                      </div>
                      <div className="dropdown-content" style={{ display: isActive ? "block" : "none" }}>
                        <div className='assignInput px-2'>
                          <FontAwesomeIcon icon={faSearch} />
                          <input type="text" placeholder='Search member' onChange={handleMemberChange} className='form-control' />
                        </div>
                        <div className='member-container'>
                          {filteredMembers.map((data: any, index) =>
                            <div onClick={(e) => { setIsActive(!isActive); selectMember(data) }} className="item tableImage my-2">
                              {data.member_image ? <img src={`${API}/${data.member_image}`} alt="avatar" style={{ objectFit: "cover" }} />
                                : <img className='default' src={memberIcon} alt="avatar" />}
                              <p>{`${(data.first_name + ' ' + data.last_name).slice(0, 17)}${(data.first_name + ' ' + data.last_name).length > 17 ? '...' : ''}`}</p>
                            </div>)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='arrowIcon mx-4'>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                  <div className="memberInfos assignBox tableImage">
                    {spaceImage ? <img src={`${API}/${spaceImage}`} alt="avatar" style={{ objectFit: "cover" }} />
                      : <img src={spaceIcon} alt="avatar" />}
                    <div><p>{name}</p><span>${rate}</span></div>
                  </div>
                </div>
              </Col>
              <Col md={12}>
                <div className="assignName">
                  <div className="generateInvoice my-0 d-flex align-items-center">
                    <h5 className='mb-0'>Generate Invoice Today?</h5>
                    <div className="authToggle mt-0">
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
                    <div className="generateInvoice mt-4 mb-0">
                      <h6>Amount Owed Today</h6>
                      <div className="memberInput amount">
                        <span>$</span>
                        <input type="text" placeholder='Rate' value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} className='form-control' />
                        <button className='calculate'>(Automatically Prorated)</button>
                      </div>
                    </div>
                  </> : <></>}
                </div>
                <div className='invoiceSave mt-4'>
                  <button type='submit' onClick={saveInvoice}>Save</button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Modal>
    </>
  )
}

export default AssignMember