import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {Elements , useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import { loadStripe } from '@stripe/stripe-js';
import PaymentCard from './PaymentCard';

const stripePromise = loadStripe(
    "pk_test_51IAFe8DEVQLSHbL2XRi6OOwhx3zOpXMWhs0XpBdh99RzfPDnOSTcavjTu0g9OlPQCQLf4sTU57uCggXpsSBS7bNT00bXuG3qiy"
);

interface tabMemberProps {
    tabChoose: (tab: string, select: string) => void;
}

const Billing = ({ tabChoose }: tabMemberProps) => {
 

    return (
        <>
            <div className="billingInfo">
                <h1>Billing Info</h1>
                <div className="memberInput memberSignUp">
                    <label>Name on Card</label>
                    <input type="text" name="firstName" placeholder="Name on Card" className="form-control" />
                </div>
                <div className="stripePayment">
                <Elements stripe={stripePromise}>
              <PaymentCard/>
                </Elements>
                   
                </div>
                <div className="tabPanelBtn">
                    <button className='back' onClick={() => tabChoose("password", "billing")}><FontAwesomeIcon icon={faArrowLeft} /> Back</button>
                    <button className='skip' onClick={() => tabChoose("agreement", "billing")}>Skip <FontAwesomeIcon icon={faArrowRight} /></button>
                    <button className='continue' onClick={() => tabChoose("agreement", "billing")}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
                </div>
            </div>
        </>
    )
}

export default Billing