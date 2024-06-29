import React, { useState, useEffect } from 'react';
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import resourceIcon from "../../Assets/Images/icon/resourceIcon.svg";
import stepCheck from "../../Assets/Images/icon/stepCheck.png";
import stepDot from "../../Assets/Images/icon/stepDot.png";
import stepBlank from "../../Assets/Images/icon/stepBlank.png";
import ResourceDetails from './ResourceDetails';
import ResourceSchedule from './ResourceSchedule';
import ResourcePayment from './ResourcePayment';
import ResourceDone from './ResourceDone';
import { v4 as uuidv4 } from 'uuid';
import { singleJwtMember } from '../../api/member';
import { isAuthenticate } from '../../api/auth';
import { resourceBooking, resourceInvoice } from '../../api/resource';
import { getLastInvoice } from '../../api/invoice';

interface AddResourcePaymentProps {
    handlePaymentClose: () => void;
    paymentShow: boolean;
    setPaymentShow: (type: boolean) => void;
    resourceDetails?: any;
}
const ResourceBooking = ({ handlePaymentClose, paymentShow, setPaymentShow, resourceDetails }: AddResourcePaymentProps) => {
console.log('resourceDetails',resourceDetails);

    let auth = isAuthenticate();
    const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
    const [startTime, setStartTime] = useState('Choose');
    const [endTime, setEndTime] = useState('Choose');
    const [selectedDate, setSelectedDate] = useState("Choose");
    const [authValue, setAuthValue] = useState(false);
    console.log('authValue',authValue);
    
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
            book_date: selectedDate,
            start_time: startTime,
            end_time: endTime,
            created_by: auth.user.id,
            invoice_add: authValue
        }
        let resourceInv = {
            id: uuidv4(),
            invoiceId: invoiceId,
            transaction_id: uuidv4(),
            amount: resourceDetails.member_rate,
            card_name: cardName,
            street: street,
            city: city,
            state: state,
            zip_code: zip,
            created_by: auth.user.id,
            resource_id: resourceDetails.id,
            resource_book_id: uuidv4(),
            status: "paid",
        }

        if (authValue) {
            resourceBooking(resourceInfo).then((data) => {
                setPaymentShow(false)
            }) 
        }
        else{
            resourceInvoice(resourceInv).then((data) => {
                setPaymentShow(false)
            })
        }
       
        
        
    }



    return (
        <>
            <Modal show={paymentShow} onHide={handlePaymentClose} centered size="xl">

                <div className="addMemberForm">
                    <button className='closeModal' onClick={handlePaymentClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={resourceIcon} alt="member" />
                                    <p>New Booking</p>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="resourceBook tabResourcePanel">
                                    <div className='tabHeading'>
                                        <ul className="tablist">
                                            <li className="">
                                                <div className="arrowLine">
                                                    <div className="checkCircle">
                                                        {checkValueExist("details", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                                            <>{detailsTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="arrowHeading">
                                                    <h6>Details</h6>
                                                    <p>Resource info</p>
                                                </div>
                                            </li>
                                            <li className="">
                                                <div className="arrowLine">
                                                    <div className="checkCircle">
                                                        {checkValueExist("schedule", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                                            <>{scheduleTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="arrowHeading">
                                                    <h6>Schedule</h6>
                                                    <p>Date, time, etc</p>
                                                </div>
                                            </li>
                                            <li className="">
                                                <div className="arrowLine">
                                                    <div className="checkCircle">
                                                        {checkValueExist("billing", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                                            <>{billingTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="arrowHeading">
                                                    <h6>Payment</h6>
                                                    <p>Billing</p>
                                                </div>
                                            </li>
                                            <li className="">
                                                <div className="arrowLine">
                                                    <div className="checkCircle">
                                                        {checkValueExist("done", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                                            <> {finishTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                                        }

                                                    </div>
                                                </div>
                                                <div className="arrowHeading">
                                                    <h6>Done!</h6>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="paymentInfo">
                                        {detailsTab ? <ResourceDetails resourceDetail={resourceDetails} tabChoose={tabChoose} /> : ""}
                                        {scheduleTab ? <ResourceSchedule startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} selectedDate={selectedDate} setSelectedDate={setSelectedDate} tabChoose={tabChoose} /> : ""}
                                        {billingTab ? <ResourcePayment cardName={cardName} setCardName={setCardName} street={street} setStreet={setStreet} city={city} setCity={setCity} state={state} setState={setState} zip={zip} setZip={setZip} resourceDetail={resourceDetails} authValue={authValue} setAuthValue={setAuthValue} tabChoose={tabChoose} /> : ""}
                                        {finishTab ? <ResourceDone resourceBooked={resourceBooked} tabChoose={tabChoose} /> : ""}
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