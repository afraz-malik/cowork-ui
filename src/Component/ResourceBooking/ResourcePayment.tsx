import React, { useState } from 'react';
import creditCard from "../../Assets/Images/icon/credit_card.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface tabMemberProps {
  tabChoose: (tab: string, select: string) => void;
  authValue:boolean;
  setAuthValue:any;
  resourceDetail:any
}
const ResourcePayment = ({ tabChoose ,authValue, setAuthValue,resourceDetail}: tabMemberProps) => {

  const authClick = () => {
    setAuthValue(!authValue)
  }
  const paymentFunction = () => {
    tabChoose("done", "billing")
  }
  const backSchedule = () => {
    tabChoose("schedule", "billing")
  }

  return (
    <>
      <div className='resourcePay'>
        <div className="resourcePayHeading">
          <h6><img src={creditCard} alt="credit" />  Payment</h6>
        </div>
         <div className="resourcePrice">
          <div>
            <p>Duration: 1 {resourceDetail.member_time}</p>
            <p>${resourceDetail.member_rate}</p>
          </div>
          <div>
            <p>Total</p>
            <p>${resourceDetail.member_rate}</p>
          </div>
        </div>
        <div className="resourceInvoice">
          <h5>Add to my next invoice</h5>
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
        {/* <div className="resourcePayment">
          <h6>Billing Details</h6>
          <div className='d-flex justify-content-between'>
          <div className="memberInput">
            <label>Street Address</label>
            <input type="text" placeholder='Street Address' className='form-control' />
          </div>
          <div className="memberInput">
            <label>City</label>
            <input type="text" placeholder='City' className='form-control' />
          </div>
          </div>
          <div className='d-flex justify-content-between'>
          <div className="memberInput">
            <label>State / Province</label>
            <input type="text" placeholder='State / Province' className='form-control' />
          </div>
          <div className="memberInput">
            <label>Zip Code</label>
            <input type="text" placeholder='Zip Code' className='form-control' />
          </div>
          </div>
        </div> */}
      </div>
      <div className="resourcesBtn">
        <button className='cancel' onClick={backSchedule}>Cancel</button>
        <button className='continue' onClick={paymentFunction}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
      </div>
    </>
  )
}

export default ResourcePayment