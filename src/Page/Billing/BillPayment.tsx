import React, { useState } from "react";
import creditCard from "../../Assets/Images/icon/credit_card.svg";
import { paymentHook, paymentProcess } from "../../api/payment";
import { DESKIE_API as API } from '../../config';
import { Modal } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { CardNumberElement, CardExpiryElement, CardCvcElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { invoiceUpdate } from "../../api/invoice";
import { showNotifications } from "../../CommonFunction/toaster";
import { isAuthenticate } from "../../api/auth";
const stripePromise = loadStripe("pk_test_51P9KbNJQ9vxye84s70DNy6fdoccgOgSd0NZMZYKfO5ynf0b1x1oxOC36kL2KLk1C1IqyqOgF0kyTEHOPpsB4VSPC00tVFVW30W");


interface AddPaymentProps {
    handlePaymentClose: () => void;
    paymentShow: boolean;
    setPaymentShow: (type: boolean) => void;
    invoiceId: any;
    invoiceDetail: any;
}

const options = {
    style: {
        base: {
            fontSize: "15px",
            fontWeight: 400,
            color: "rgba(54, 54, 55, 1)",
            letterSpacing: "0.025em",
            fontFamily: "inter",
            "::placeholder": {
                color: "rgba(116, 118, 121, 0.8)"
            }
        },
        invalid: {
            color: "rgba(54, 54, 55, 1)"
        }
    },
};

const CardPaymentOption = ({ invoiceId, setPaymentShow, invoiceDetail }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardName, setCardName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [amountValue, setAmountValue] = useState(0);
    let auth = isAuthenticate();


    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error('Stripe.js has not loaded yet.');
            return;
        }
       


        paymentProcess({ amount: amountValue*100 }).then(async (data) => {
            if (elements) {
                const cardElement = elements.getElement(CardNumberElement);
                console.log('cardElement', cardElement);
console.log('CardNumberElement',CardNumberElement);

                if (cardElement) {
                    const { paymentIntent, error } = await stripe.confirmCardPayment(data.clientSecret, {
                        payment_method: {
                            card: cardElement
                        },
                    });
                    if (error) {
                        showNotifications('error', "Wrong information")
                    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                        // const hookData = await paymentHook({ clientSecret: data.clientSecret });
                        console.log('Payment succeeded:');
                        let paymentInfo: any = {
                            "id": uuidv4(),
                            "invoiceId": invoiceId,
                            "invoiceNumber": invoiceDetail.invoice_id,
                            "userId": auth.user.id,
                            "amount": amountValue,
                            "paymentDate": new Date(),
                            "method": "card",
                            "paymentNote": "",
                            "status": "",
                            "card_name": cardName,
                            "city": city,
                            "street": street,
                            "state": state,
                            "zip_code": zip,
                            "stripe_id": data.clientSecret
                        }
                        invoiceUpdate(paymentInfo).then((data) => {
                            if (data.statusCode !== 200) {
                                showNotifications('error', data.message)
                            }
                            else {
                                 setPaymentShow(false)
                                showNotifications('success', data.message)
                            }
                        })
                    }
                }

            }
        })



    };


    return (
        <><div className="resourcePayHeading">
            <h6 style={{ marginBottom: '32px' }}><img src={creditCard} className='mr-2' alt="credit" />  Payment</h6>
        </div>
            <div className="resourcePayment">
                <form onSubmit={handleSubmit} className="DemoWrapper">
                    <div className="cardPayment">
                        <h6 className='mb-2'>Payment Details</h6>
                            <div className="cardNameAmount">
                                <div className="resourceInput">
                                    <label>Name on Card</label>
                                    <input className="form-control" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" />
                                </div>
                                <div className="resourceInput">
                                    <label>Amount</label>
                                    <input className="form-control" type="number" value={amountValue} onChange={(e) => setAmountValue(parseInt(e.target.value))} placeholder="Name on card" />
                                </div>
                            </div>
                            <div className="cardNumber resourceCard mt-0">
                                <div className="cardInput">
                                    <label>Card Number</label>
                                    <CardNumberElement options={options} />
                                </div>
                                <div className="cardInput expire">
                                    <label>Expiration Date</label>
                                    <CardExpiryElement options={options} />
                                </div>
                                <div className="cardInput cvv">
                                    <label>CVV</label>
                                    <CardCvcElement options={options} />
                                </div>
                            </div>
                    </div>
                    <h6 className='mb-2 mt-4'>Billing Details</h6>
                    <div className='d-flex justify-content-between'>
                        <div className="memberInput">
                            <label>Street Address</label>
                            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder='Street Address' className='form-control' />
                        </div>
                        <div className="memberInput">
                            <label>City</label>
                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder='City' className='form-control' />
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className="memberInput">
                            <label>State / Province</label>
                            <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder='State / Province' className='form-control' />
                        </div>
                        <div className="memberInput">
                            <label>Zip Code</label>
                            <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} placeholder='Zip Code' className='form-control' />
                        </div>
                    </div>
                    <div className="memberAddBtn">
                        <button type='submit' className='save'>Save</button>
                    </div>
                </form>
            </div > </>
    )
}


const BillPayment = ({ invoiceId, paymentShow, setPaymentShow, handlePaymentClose, invoiceDetail }: AddPaymentProps) => {



    return (
        <Modal show={paymentShow} onHide={handlePaymentClose} centered size="lg" id="newBooking">

            <div className="addMemberForm">
                <button className='closeModal' onClick={handlePaymentClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <div className='resourcePay'>
                    <Elements stripe={stripePromise}>
                        <CardPaymentOption invoiceId={invoiceId} setPaymentShow={setPaymentShow} invoiceDetail={invoiceDetail} />
                    </Elements>
                </div>
            </div>
        </Modal>
    )
}

export default BillPayment