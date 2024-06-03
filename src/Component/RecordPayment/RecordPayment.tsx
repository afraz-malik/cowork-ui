import React, { useState, forwardRef, useEffect } from 'react'
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import paymentIcon from "../../Assets/Images/icon/paymentIcon.png";
import memberIcon from "../../Assets/Images/icon/blank-profile.jpg";
import DatePicker from 'react-datepicker';
import calenderIcon from "../../Assets/Images/icon/calendar.png";
import send from "../../Assets/Images/icon/send.png"
import { invoiceUpdate, updatePayment } from '../../api/invoice';
import { singleJwtMember } from '../../api/member';
import { isAuthenticate } from '../../api/auth';
import { DESKIE_API as API } from '../../config';
import { v4 as uuidv4 } from 'uuid';
import { showNotifications } from '../../CommonFunction/toaster';

interface PaymentProps {
    handleClose: () => void;
    show: boolean;
    setShow: (type: boolean) => void;
    invoiceId?: string;
    invoiceDetail?: any;
}

const RecordPayment = ({ show, setShow, handleClose, invoiceId, invoiceDetail }: PaymentProps) => {
    const [dueDate, setDueDate] = useState<any>("");
    const [selectedTag, setSelectedTag] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [userImage, setUserImage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    let auth = isAuthenticate();


    const dueDateChange = (date: any) => {
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        setDueDate(selectedDate)
    }
    const CustomDatePickerInput: React.FC<any> = forwardRef(({ value, onClick }, ref) => (
        <button className="calenderBox requestInputForm" onClick={onClick}>
            {value}
            <img src={calenderIcon} alt="calender" />
        </button>
    ));
    const CustomDateFormatInput: React.FC<any> = forwardRef(({ value, onClick }, ref) => (
        <button className="calenderBox requestInputForm" onClick={onClick}>
            {value}
            <p>MM/DD/YYYY</p>
            <img src={calenderIcon} alt="calender" />
        </button>
    ));

    const handleSelectAssign = (eventKey: string | null) => {
        if (eventKey) {
            setSelectedTag(eventKey);
        }
    };

    const paymentAdd = () => {
        let paymentInfo = {
            "id": uuidv4(),
            "invoiceId": invoiceId,
            "userId": auth.user.id,
            "amount": amount,
            "paymentDate": dueDate,
            "method": selectedTag,
            "paymentNote": notes
        }
        invoiceUpdate(paymentInfo).then((data) => {
            if (data.statusCode !== 200) {
                showNotifications('error', data.message)
            }
            else {
                setShow(false)
                showNotifications('success', data.message)
            }

        })
    }




    useEffect(() => {
        singleJwtMember(auth.token).then((data) => {
            if (data.statusCode === 200) {
                if (data.data.data.member_image) {
                    setUserImage(data.data.data.member_image);
                }
                else {
                    setUserImage(data.data.data.avatar);
                }
                setFirstName(data.data.data.first_name);
                setLastName(data.data.data.last_name);
                setUserEmail(data.data.data.email);
            }
        })
    }, []);


    const handleTodayClick = () => {
        setDueDate(new Date());
    };

    const handleYesterdayClick = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setDueDate(yesterday);
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


    const paymentEdit = () => {
        let paymentInfo = {
            "amount": parseFloat(invoiceDetail.payment_value) + parseFloat(amount),
            "paymentDate": dueDate,
            "method": selectedTag,
            "paymentNote": notes,
            "invoiceId": invoiceDetail.id
        }
        updatePayment(invoiceDetail.payment_id, paymentInfo).then((data) => {
            if (data.statusCode !== 200) {
                showNotifications('error', data.message)
            }
            else {
                setShow(false)
                showNotifications('success', data.message)
            }
        })
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} centered size="lg">
                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={paymentIcon} alt="member" />
                                    <p>Record Payment</p>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="invoiceMemberInfo">
                                    <h1>Payment From</h1>
                                    <div className="memberInfos">
                                        {userImage && userImage.length ? <img className='logo' src={`${API}/${userImage}`} style={{ objectFit: "cover" }} alt="logo" />
                                            : <img className='logo' src={memberIcon} alt="bell" style={{ objectFit: "cover" }} />
                                        }
                                        <div>
                                            <p>{firstName} {lastName}</p>
                                            <span>{userEmail}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="memberInput rate mt-3">
                                    <span>$</span>
                                    <label>Amount</label>
                                    <input type="number" onChange={(e) => setAmount(e.target.value)} placeholder='Amount' className='form-control' />
                                    <button>USD</button>
                                </div>
                                <div className="calenderInput">
                                    <label>Payment Date</label>
                                    {dueDate && dueDate ?
                                        <div className='dueDateFormat'>
                                            <DatePicker selected={dueDate} placeholderText="Select a date" onChange={dueDateChange} dateFormat="MM/dd/yyyy" customInput={<CustomDatePickerInput />} />
                                        </div>
                                        : <div className='dueDateFormat'>
                                            <DatePicker placeholderText="Select a date" onChange={dueDateChange} dateFormat="MM/dd/yyyy" customInput={<CustomDateFormatInput />} renderCustomHeader={CustomHeader} />
                                        </div>
                                    }
                                </div>
                                <div className="invoiceInput">
                                    <label>Payment Method</label>
                                    <Dropdown onSelect={handleSelectAssign}>
                                        <Dropdown.Toggle variant="" className="custom-toggle">
                                            {selectedTag.length ? selectedTag : "Choose Payment Method"}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="Paypal">Paypal</Dropdown.Item>
                                            <Dropdown.Item eventKey="Visa Card">Visa Card</Dropdown.Item>
                                            <Dropdown.Item eventKey="Master Card">Master Card</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                                <div className="memberInput">
                                    <label>Note</label>
                                    <textarea placeholder='Enter a note...' onChange={(e) => setNotes(e.target.value)} className='form-control' />
                                </div>

                            </Col>
                            <Col md={12} className='d-flex justify-content-end'>
                                {invoiceDetail && invoiceDetail.payment_value ? <button className='invoiceBtn active' type='submit' onClick={paymentEdit}>Pay Now <img src={send} alt="send" /> </button>
                                    : <button className='invoiceBtn active' type='submit' onClick={paymentAdd}>Pay Now <img src={send} alt="send" /> </button>}

                            </Col>
                        </Row>
                    </Container>
                </div>
            </Modal>
        </>
    )
}

export default RecordPayment