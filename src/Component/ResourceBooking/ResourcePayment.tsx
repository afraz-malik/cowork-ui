import React, { useState } from 'react';
import creditCard from "../../Assets/Images/icon/credit_card.svg";
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardSystem from './CardSystem';
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import { findTimeGap } from '../../CommonFunction/Function';
const stripePromise = loadStripe(
  "pk_test_51IAFe8DEVQLSHbL2XRi6OOwhx3zOpXMWhs0XpBdh99RzfPDnOSTcavjTu0g9OlPQCQLf4sTU57uCggXpsSBS7bNT00bXuG3qiy"
);

interface tabMemberProps {
  tabChoose: (tab: string, select: string) => void;
  authValue: boolean;
  setAuthValue: any;
  resourceDetail: any;
  cardName: string;
  setCardName: any;
  street: string;
  setStreet: any;
  city: string;
  setCity: any;
  state: string;
  setState: any;
  zip: string;
  setZip: any;
  startTime: string;
  endTime: string;
}
const ResourcePayment = ({ cardName, startTime, endTime, setCardName, street, setStreet, city, setCity, state, setState, zip, setZip, tabChoose, authValue, setAuthValue, resourceDetail }: tabMemberProps) => {
  const [instantPay, setInstantPay] = useState(true);

  const authClick = () => {
    setAuthValue(!authValue)
  }
  const paymentFunction = () => {
    if (authValue) {
      tabChoose("done", "billing")
    }
    else {
      setInstantPay(false)
    }
  }
  const payInvoice = () => {
    tabChoose("done", "billing")
  }
  const backSchedule = () => {
    tabChoose("schedule", "billing")
  }



 




  return (
    <>
      <div className='resourcePay'>
        <div className="resourcePayHeading">
          <h6 style={{marginBottom: '32px'}}><img src={creditCard} className='mr-2' alt="credit" />  Payment</h6>
        </div>

        {instantPay ? <>
          <div className="resourcePrice">
            <div>
              <p>Duration: {startTime ? findTimeGap(startTime, endTime) : ""} {resourceDetail.member_time}</p>
              <p>${resourceDetail.member_rate}</p>
            </div>
            <div>
              <p>Total</p>
              <p>${(startTime ? findTimeGap(startTime, endTime) : 0) * parseInt(resourceDetail.member_rate)}</p>
            </div>
          </div>
          <div className="resourceInvoice mt-4">
            <h5>Add to my next invoice</h5>
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
        </> :
          <div className="resourcePayment">
            <div className="cardPayment">
              <h6 className='mb-2'>Payment Details</h6>
              <Elements stripe={stripePromise}>
                <CardSystem cardName={cardName} setCardName={setCardName} />
              </Elements>
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
          </div>}

      </div>
      {instantPay ? <>
        <div className="resourcesBtn">
          <button className='cancel' onClick={backSchedule}><FontAwesomeIcon className='mr-2' icon={faArrowLeft} /> Back</button>
          <button className='continue' onClick={paymentFunction}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
        </div>
      </> : <div className="resourcesBtn">
          <button className='cancel' onClick={backSchedule}><FontAwesomeIcon className='mr-2' icon={faArrowLeft} /> Back</button>
          <button className='continue' onClick={payInvoice}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
      </div>}
    </>
  )
}

export default ResourcePayment