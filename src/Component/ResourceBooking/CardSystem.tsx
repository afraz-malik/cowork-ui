import React from "react";
import { useStripe, useElements, CardElement, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";

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
    client_secret: "pi_3KsjFwDEVQLSHbL20Fyd44KR_secret_2M4MY2wtJ2auaiuHYFuhD3WUz"
};
interface cardInfo{
    cardName:any;
    setCardName:any
}
const CardSystem = ({cardName, setCardName}:cardInfo) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: any) => {
        event.preventDefault();


        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        if (elements) {
            try {
                const cardElement = elements.getElement(CardElement);
                if (!cardElement) {
                    // Handle case where card element is not available
                    return;
                }

                const payload = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                });
            } catch (error) {
                console.error("Error creating payment method:", error);
            }
        }

    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="DemoWrapper">
                <div className="resourceInput">
                    <label>Name on Card</label>
                    <input className="form-control" value={cardName} onChange={(e)=>setCardName(e.target.value)} placeholder="Name on card" />
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
            </form>
        </div>
    )
}

export default CardSystem