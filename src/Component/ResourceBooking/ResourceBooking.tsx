import React, { useState, useEffect } from 'react';
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import resourceIcon from "../../Assets/Images/icon/booking.svg";
import stepCheck from "../../Assets/Images/icon/stepCheck.svg";
import stepDot from "../../Assets/Images/icon/stepDot.svg";
import stepBlank from "../../Assets/Images/icon/stepBlank.svg";
import ResourceDetails from './ResourceDetails';
import ResourceSchedule from './ResourceSchedule';
import ResourcePayment from './ResourcePayment';
import ResourceDone from './ResourceDone';
import { v4 as uuidv4 } from 'uuid';
import { singleJwtMember } from '../../api/member';
import { isAuthenticate } from '../../api/auth';
import { resourceBooking, resourceInvoice } from '../../api/resource';
import { getLastInvoice, invoiceAmountUpdate, invoiceUpdate } from '../../api/invoice';
import { memberAddSpaces } from '../../api/spaces';
import { showNotifications } from '../../CommonFunction/toaster';
import { findTimeGap } from '../../CommonFunction/Function';

interface AddResourcePaymentProps {
    handlePaymentClose: () => void;
    paymentShow: boolean;
    setPaymentShow: (type: boolean) => void;
    resourceDetails?: any;
}
const ResourceBooking = ({ handlePaymentClose, paymentShow, setPaymentShow, resourceDetails }: AddResourcePaymentProps) => {
  
    let auth = isAuthenticate();
    const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
    const [startTime, setStartTime] = useState('Choose');
    const [endTime, setEndTime] = useState('Choose');
    const [selectedDate, setSelectedDate] = useState<any>(new Date());
    const [authValue, setAuthValue] = useState(false);
    const [detailsTab, setDetailsTab] = useState(true);
    const [scheduleTab, setScheduleTab] = useState(false);
    const [billingTab, setBillingTab] = useState(false);
    const [finishTab, setFinishTab] = useState(false);
    const [cardName, setCardName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [invoiceId, setInvoiceId] = useState("");

    useEffect(() => {
        getLastInvoice().then((data) => {
            setInvoiceId(`00${data.data}`)
        })

    }, []);

    const tabChoose = (tab: string, selectTab: string) => {

        setSelectedTabs(prevTabs => {
            const tabExists = prevTabs.includes(selectTab);
            if (tabExists) {
                return prevTabs;
            } else {
                return [...prevTabs, selectTab];
            }
        });

        switch (tab) {
            case 'details':
                setDetailsTab(true);
                setScheduleTab(false);
                setBillingTab(false);
                setFinishTab(false);
                break;
            case 'schedule':
                setDetailsTab(false);
                setScheduleTab(true);
                setBillingTab(false);
                setFinishTab(false);
                break;
            case 'billing':
                setDetailsTab(false);
                setScheduleTab(false);
                setBillingTab(true);
                setFinishTab(false);
                break;
            case 'done':
                setDetailsTab(false);
                setScheduleTab(false);
                setBillingTab(false);
                setFinishTab(true);
                break;
            default:
                setDetailsTab(true);
                setScheduleTab(false);
                setBillingTab(false);
                setFinishTab(false);
        }
    }
    // check tab duplicate
    function checkValueExist(value: string, valuesArray: string[]) {
        return valuesArray.includes(value);
    }


    const resourceBooked = () => {
        let resourceInfo = {
            id: uuidv4(),
            resource_id: resourceDetails.id,
            amount: findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate),
            book_date: selectedDate,
            start_time: startTime,
            end_time: endTime,
            created_by: auth.user.id,
            invoice_add: authValue
        }
        let invoiceResource = {
            "id": uuidv4(),
            "spaces_id": resourceDetails.id,
            "member_id": auth.user.id,
            "amount": findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate),
            "renewal_date": selectedDate,
            "renewal_frequency": "resource",
            "user_email": auth.user.email,
            "invoice_type": "resource"
        }
        let invoiceMonthly = {
            "id": uuidv4(),
            "spaces_id": resourceDetails.id,
            "member_id": auth.user.id,
            "amount": findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate),
            "renewal_date": selectedDate,
            "renewal_frequency": "monthly",
            "user_email": auth.user.email,
            "invoice_type": "resource"
        }
        let paymentInfo = {
            "id": uuidv4(),
            "invoiceId": uuidv4(),
            "userId": auth.user.id,
            "amount": findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate),
            "paymentDate": new Date(),
            "method": "card",
            "paymentNote": "",
            "status": "paid",
            "invoiceAmount": findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate)
        }
        let totalAmount = {
            "amount": resourceDetails.member_rate,
        }
      
        if (authValue) {
            memberAddSpaces(invoiceMonthly).then((data) => {
                if (data.statusCode !== 200) {
                    showNotifications("error", data.message);
                }
                else {
                    invoiceAmountUpdate(auth.user.id, totalAmount).then((data) => {
                        setPaymentShow(false)
                  })
                    resourceBooking(resourceInfo).then((data) => {
                        showNotifications("success", data.message);
                        setPaymentShow(false)
                    })
                }
            })
        }
        else {
            memberAddSpaces(invoiceResource).then((data) => {
                if (data.statusCode !== 200) {
                    showNotifications("error", data.message);
                }
                else {
                    resourceBooking(resourceInfo).then((data) => {
                        showNotifications("success", data.message);
                        setPaymentShow(false)
                    })
                    invoiceUpdate(paymentInfo).then((data) => {
                       console.log('pay',data);
                       
                    })
                }
            })
        }
    }



    return (
        <>
            <Modal show={paymentShow} onHide={handlePaymentClose} centered size="xl" id="newBooking">
                <ToastContainer />
                <div className="addMemberForm">
                    <button className='closeModal' onClick={handlePaymentClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading mb-0'>
                                    <img src={resourceIcon} alt="member" />
                                    <p>New Booking</p>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="resourceBook tabResourcePanel">
                                    <div className='tabHeading'>
                                        <ul className="tablist">
                                            <li className="mt-0">
                                                <div className="arrowLine">
                                                    <div className={`checkCircle ${checkValueExist("details", selectedTabs) && 'checked'}`}>
                                                        {checkValueExist("details", selectedTabs) ? <img className='checked' src={stepCheck} alt='stepCheck' /> :
                                                            <>{detailsTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="arrowHeading">
                                                    <h6 className={detailsTab ? 'selected' : ''}>Details</h6>
                                                    <p className={detailsTab ? 'selected' : ''}>Resource info</p>
                                                </div>
                                            </li>
                                            <li className="">
                                                <div className="arrowLine">
                                                    <div className={`checkCircle ${checkValueExist("schedule", selectedTabs) && 'checked'}`}>
                                                        {checkValueExist("schedule", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                                            <>{scheduleTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="arrowHeading">
                                                    <h6 className={scheduleTab ? 'selected' : ''}>Schedule</h6>
                                                    <p className={scheduleTab ? 'selected' : ''}>Date, time, etc</p>
                                                </div>
                                            </li>
                                            <li className="">
                                                <div className="arrowLine">
                                                    <div className={`checkCircle ${checkValueExist("billing", selectedTabs) && 'checked'}`}>
                                                        {checkValueExist("billing", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                                            <>{billingTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="arrowHeading">
                                                    <h6 className={billingTab ? 'selected' : ''}>Payment</h6>
                                                    <p className={billingTab ? 'selected' : ''}>Billing</p>
                                                </div>
                                            </li>
                                            <li className="">
                                                <div className="arrowLine">
                                                    <div className={`checkCircle done ${checkValueExist("done", selectedTabs) && 'checked'}`}>
                                                        {checkValueExist("done", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                                            <> {finishTab ? <img src={stepCheck} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                                        }

                                                    </div>
                                                </div>
                                                <div className="arrowHeading">
                                                    <h6 className={finishTab ? 'selected' : ''}>Done!</h6>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="paymentInfo">
                                        {detailsTab ? <ResourceDetails resourceDetail={resourceDetails} tabChoose={tabChoose} /> : ""}
                                        {scheduleTab ? <ResourceSchedule startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} selectedDate={selectedDate} setSelectedDate={setSelectedDate} tabChoose={tabChoose} /> : ""}
                                        {billingTab ? <ResourcePayment  startTime={startTime} endTime={endTime}  cardName={cardName} setCardName={setCardName} street={street} setStreet={setStreet} city={city} setCity={setCity} state={state} setState={setState} zip={zip} setZip={setZip} resourceDetail={resourceDetails} authValue={authValue} setAuthValue={setAuthValue} tabChoose={tabChoose} /> : ""}
                                        {finishTab ? <ResourceDone selectedDate={selectedDate} startTime={startTime} endTime={endTime} resourceDetail={resourceDetails} resourceBooked={resourceBooked} tabChoose={tabChoose} /> : ""}
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

export default ResourceBooking