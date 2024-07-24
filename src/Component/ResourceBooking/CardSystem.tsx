import React from 'react'
import {
  useStripe,
  useElements,
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Link } from 'react-router-dom'
import { paymentHook, paymentProcess } from '../../api/payment'
import { DESKIE_API as API } from '../../config'
const stripePromise = loadStripe(
  'pk_test_51P9KbNJQ9vxye84s70DNy6fdoccgOgSd0NZMZYKfO5ynf0b1x1oxOC36kL2KLk1C1IqyqOgF0kyTEHOPpsB4VSPC00tVFVW30W'
)

const options = {
  style: {
    base: {
      fontSize: '15px',
      fontWeight: 400,
      color: 'rgba(54, 54, 55, 1)',
      letterSpacing: '0.025em',
      fontFamily: 'inter',
      '::placeholder': {
        color: 'rgba(116, 118, 121, 0.8)',
      },
    },
    invalid: {
      color: 'rgba(54, 54, 55, 1)',
    },
  },
}
interface cardInfo {
  cardName: any
  setCardName: any
}
const CardSystem = ({ cardName, setCardName }: cardInfo) => {
  const stripe = useStripe()
  // const stripe = loadStripe("pk_test_51P9KbNJQ9vxye84s70DNy6fdoccgOgSd0NZMZYKfO5ynf0b1x1oxOC36kL2KLk1C1IqyqOgF0kyTEHOPpsB4VSPC00tVFVW30W");
  const elements = useElements()

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet.')
      return
    }

    paymentProcess({ amount: 100 }).then(async (data) => {
      if (elements) {
        const cardElement = elements.getElement(CardNumberElement)
        if (cardElement) {
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            data.clientSecret,
            {
              payment_method: {
                card: cardElement,
              },
            }
          )
          if (error) {
            console.error('Payment failed', error)
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // const hookData = await paymentHook({ clientSecret: data.clientSecret });
            // console.log('Payment succeeded:', hookData);
            // Handle success here
          }
        }
      }
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className='DemoWrapper'>
        <div className='resourceInput'>
          <label>Name on Card</label>
          <input
            className='form-control'
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder='Name on card'
          />
        </div>
        <div className='cardNumber resourceCard mt-0'>
          <div className='cardInput'>
            <label>Card Number</label>
            <CardNumberElement options={options} />
          </div>
          <div className='cardInput expire'>
            <label>Expiration Date</label>
            <CardExpiryElement options={options} />
          </div>
          <div className='cardInput cvv'>
            <label>CVV</label>
            <CardCvcElement options={options} />
          </div>
        </div>
      </form>
    </div>
  )
}

export default CardSystem
