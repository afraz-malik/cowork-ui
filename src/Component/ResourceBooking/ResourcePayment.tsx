import React, { useState } from 'react';

import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardSystem from './CardSystem';
import { CardNumberElement, CardExpiryElement, CardCvcElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import { findTimeGap } from '../../CommonFunction/Function';
const stripePromise = loadStripe("pk_test_51P9KbNJQ9vxye84s70DNy6fdoccgOgSd0NZMZYKfO5ynf0b1x1oxOC36kL2KLk1C1IqyqOgF0kyTEHOPpsB4VSPC00tVFVW30W");

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
  CardPaymentOption:any;
  callStripe:any;
}


const ResourcePayment = ({CardPaymentOption,callStripe, cardName, startTime, endTime, setCardName, street, setStreet, city, setCity, state, setState, zip, setZip, tabChoose, authValue, setAuthValue, resourceDetail }: tabMemberProps) => {
 


  return (
    <>
      
    </>
  )
}

export default ResourcePayment