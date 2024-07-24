import React, { useState, useEffect } from 'react'
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faChevronDown,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import resourceIcon from '../../Assets/Images/icon/booking.svg'
import stepCheck from '../../Assets/Images/icon/stepCheck.svg'
import stepDot from '../../Assets/Images/icon/stepDot.svg'
import stepBlank from '../../Assets/Images/icon/stepBlank.svg'
import ResourceDetails from './ResourceDetails'
import ResourceSchedule from './ResourceSchedule'
import ResourcePayment from './ResourcePayment'
import ResourceDone from './ResourceDone'
import { v4 as uuidv4 } from 'uuid'
import { singleJwtMember } from '../../api/member'
import { isAuthenticate } from '../../api/auth'
import { resourceBooking, resourceInvoice } from '../../api/resource'
import {
  getLastInvoice,
  invoiceAmountUpdate,
  invoiceUpdate,
} from '../../api/invoice'
import { memberAddSpaces } from '../../api/spaces'
import { showNotifications } from '../../CommonFunction/toaster'
import { findTimeGap } from '../../CommonFunction/Function'
import { paymentProcess } from '../../api/payment'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import creditCard from '../../Assets/Images/icon/credit_card.svg'
const stripePromise = loadStripe(
  'pk_test_51P9KbNJQ9vxye84s70DNy6fdoccgOgSd0NZMZYKfO5ynf0b1x1oxOC36kL2KLk1C1IqyqOgF0kyTEHOPpsB4VSPC00tVFVW30W'
)

interface AddResourcePaymentProps {
  handlePaymentClose: () => void
  paymentShow: boolean
  setPaymentShow: (type: boolean) => void
  resourceDetails?: any
}

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

// payment

interface tabPaymentProps {
  tabChoose: (tab: string, select: string) => void
  resourceBooked: any
  resourceDetail: any
  selectedDate: string
  startTime: string
  endTime: string
  setPaymentShow: any
  authValue: any
}

const CardPaymentOption = ({
  authValue,
  setPaymentShow,
  selectedDate,
  startTime,
  endTime,
  resourceDetail,
  tabChoose,
  resourceBooked,
}: tabPaymentProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [cardName, setCardName] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')

  let auth = isAuthenticate()

  const amountValue =
    findTimeGap(startTime, endTime) * parseInt(resourceDetail.member_rate)

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet.')
      return
    }
    paymentProcess({ amount: 100 }).then(async (data) => {
      if (elements) {
        const cardElement = elements.getElement(CardNumberElement)
        console.log('cardElement', cardElement)
        console.log('CardNumberElement', CardNumberElement)

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
            showNotifications('error', 'Wrong Information')
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            let resourceInfo = {
              id: uuidv4(),
              resource_id: resourceDetail.id,
              amount:
                findTimeGap(startTime, endTime) *
                parseInt(resourceDetail.member_rate),
              book_date: selectedDate,
              start_time: startTime,
              end_time: endTime,
              created_by: auth.user.id,
              invoice_add: authValue,
            }

            resourceBooking(resourceInfo).then((data) => {
              showNotifications('success', data.message)
              setPaymentShow(false)
            })
            // invoiceUpdate(paymentInfo).then((data) => {
            //     console.log('pay', data);
            // })
            const invId = uuidv4()
            let paymentConfirm = {
              id: uuidv4(),
              invoiceId: invId,
              invoiceNumber: data.invoice_id,
              userId: auth.user.id,
              amount: `${findTimeGap(startTime, endTime) * parseInt(resourceDetail.member_rate)}`,
              paymentDate: new Date(),
              method: 'Visa',
              paymentNote: '',
              status: '',
            }
            invoiceUpdate(paymentConfirm).then((data) => {
              console.log('pay', data)
            })
          }
        }
      }
    })
  }

  const payInvoice = () => {
    tabChoose('done', 'billing')
  }
  const backSchedule = () => {
    tabChoose('schedule', 'billing')
  }
  const [payView, setPayView] = useState(false)
  const payResource = () => {
    setPayView(true)
  }

  return (
    <>
      <div className=''>
        {payView ? (
          ''
        ) : (
          <>
            <form onSubmit={handleSubmit} className='DemoWrapper'>
              <div className='cardPayment'>
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
              </div>
              <h6 className='mb-2 mt-4'>Billing Details</h6>
              <div className='d-flex justify-content-between'>
                <div className='memberInput'>
                  <label>Street Address</label>
                  <input
                    type='text'
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder='Street Address'
                    className='form-control'
                  />
                </div>
                <div className='memberInput'>
                  <label>City</label>
                  <input
                    type='text'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder='City'
                    className='form-control'
                  />
                </div>
              </div>
              <div className='d-flex justify-content-between'>
                <div className='memberInput'>
                  <label>State / Province</label>
                  <input
                    type='text'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder='State / Province'
                    className='form-control'
                  />
                </div>
                <div className='memberInput'>
                  <label>Zip Code</label>
                  <input
                    type='text'
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder='Zip Code'
                    className='form-control'
                  />
                </div>
              </div>
              <div className='resourcesBtn'>
                <button className='cancel' onClick={backSchedule}>
                  <FontAwesomeIcon className='mr-2' icon={faArrowLeft} /> Back
                </button>
                <button type='submit' className='continue'>
                  Continue <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>{' '}
    </>
  )
}
const ResourceBooking = ({
  handlePaymentClose,
  paymentShow,
  setPaymentShow,
  resourceDetails,
}: AddResourcePaymentProps) => {
  let auth = isAuthenticate()
  const [selectedTabs, setSelectedTabs] = useState<string[]>([])
  const [startTime, setStartTime] = useState('Choose')
  const [endTime, setEndTime] = useState('Choose')
  const [selectedDate, setSelectedDate] = useState<any>(new Date())
  const [authValue, setAuthValue] = useState(false)
  const [detailsTab, setDetailsTab] = useState(true)
  const [scheduleTab, setScheduleTab] = useState(false)
  const [billingTab, setBillingTab] = useState(false)
  const [finishTab, setFinishTab] = useState(false)
  const [cardName, setCardName] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [invoiceId, setInvoiceId] = useState('')

  useEffect(() => {
    getLastInvoice().then((data) => {
      setInvoiceId(`00${data.data}`)
    })
  }, [])

  const tabChoose = (tab: string, selectTab: string) => {
    setSelectedTabs((prevTabs) => {
      const tabExists = prevTabs.includes(selectTab)
      if (tabExists) {
        return prevTabs
      } else {
        return [...prevTabs, selectTab]
      }
    })

    switch (tab) {
      case 'details':
        setDetailsTab(true)
        setScheduleTab(false)
        setBillingTab(false)
        setFinishTab(false)
        break
      case 'schedule':
        setDetailsTab(false)
        setScheduleTab(true)
        setBillingTab(false)
        setFinishTab(false)
        break
      case 'billing':
        setDetailsTab(false)
        setScheduleTab(false)
        setBillingTab(true)
        setFinishTab(false)
        break
      case 'done':
        setDetailsTab(false)
        setScheduleTab(false)
        setBillingTab(false)
        setFinishTab(true)
        break
      default:
        setDetailsTab(true)
        setScheduleTab(false)
        setBillingTab(false)
        setFinishTab(false)
    }
  }
  // check tab duplicate
  function checkValueExist(value: string, valuesArray: string[]) {
    return valuesArray.includes(value)
  }

  const resourceBooked = () => {
    let resourceInfo = {
      id: uuidv4(),
      resource_id: resourceDetails.id,
      amount:
        findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate),
      book_date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      created_by: auth.user.id,
      invoice_add: authValue,
    }
    const invId = uuidv4()
    let invoiceResource = {
      id: invId,
      spaces_id: resourceDetails.id,
      member_id: auth.user.id,
      amount:
        findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate),
      renewal_date: selectedDate,
      renewal_frequency: 'resource',
      user_email: auth.user.email,
      invoice_type: 'resource',
    }
    let invoiceMonthly = {
      id: uuidv4(),
      spaces_id: resourceDetails.id,
      member_id: auth.user.id,
      amount:
        findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate),
      renewal_date: selectedDate,
      renewal_frequency: 'monthly',
      user_email: auth.user.email,
      invoice_type: 'resource',
    }
    let paymentInfo = {
      id: uuidv4(),
      invoiceId: uuidv4(),
      userId: auth.user.id,
      amount:
        findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate),
      paymentDate: new Date(),
      method: 'card',
      paymentNote: '',
      status: 'paid',
      invoiceAmount:
        findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate),
    }
    let totalAmount = {
      amount:
        findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate),
    }

    if (authValue) {
      memberAddSpaces(invoiceMonthly).then((data) => {
        if (data.statusCode !== 200) {
          showNotifications('error', data.message)
        } else {
          invoiceAmountUpdate(auth.user.id, totalAmount).then((data) => {
            setPaymentShow(false)
          })
          resourceBooking(resourceInfo).then((data) => {
            showNotifications('success', data.message)
            setPaymentShow(false)
          })
        }
      })
    } else {
      memberAddSpaces(invoiceResource).then((data) => {
        if (data.statusCode !== 200) {
          showNotifications('error', data.message)
        } else {
          resourceBooking(resourceInfo).then((data) => {
            showNotifications('success', data.message)
            setPaymentShow(false)
          })
          // invoiceUpdate(paymentInfo).then((data) => {
          //     console.log('pay', data);
          // })

          let paymentConfirm = {
            id: uuidv4(),
            invoiceId: invId,
            invoiceNumber: data.invoice_id,
            userId: auth.user.id,
            amount: `${findTimeGap(startTime, endTime) * parseInt(resourceDetails.member_rate)}`,
            paymentDate: new Date(),
            method: 'Visa',
            paymentNote: '',
            status: '',
          }
          invoiceUpdate(paymentConfirm).then((data) => {
            console.log('pay', data)
          })
        }
      })
    }
  }

  const [instantPay, setInstantPay] = useState(true)

  const authClick = () => {
    setAuthValue(!authValue)
  }
  const paymentFunction = () => {
    if (authValue) {
      tabChoose('done', 'billing')
    } else {
      setInstantPay(false)
    }
  }
  const payInvoice = () => {
    tabChoose('done', 'billing')
  }
  const backSchedule = () => {
    tabChoose('schedule', 'billing')
  }

  return (
    <>
      <Modal
        show={paymentShow}
        onHide={handlePaymentClose}
        centered
        size='xl'
        id='newBooking'
      >
        <ToastContainer />
        <div className='addMemberForm'>
          <button className='closeModal' onClick={handlePaymentClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Container>
            <Row>
              <Col md={12}>
                <div className='addMemberHeading mb-0'>
                  <img src={resourceIcon} alt='member' />
                  <p>New Booking</p>
                </div>
              </Col>
              <Col md={12}>
                <div className='resourceBook tabResourcePanel'>
                  <div className='tabHeading'>
                    <ul className='tablist'>
                      <li className='mt-0'>
                        <div className='arrowLine'>
                          <div
                            className={`checkCircle ${checkValueExist('details', selectedTabs) && 'checked'}`}
                          >
                            {checkValueExist('details', selectedTabs) ? (
                              <img
                                className='checked'
                                src={stepCheck}
                                alt='stepCheck'
                              />
                            ) : (
                              <>
                                {detailsTab ? (
                                  <img src={stepDot} alt='stepCheck' />
                                ) : (
                                  <img src={stepBlank} alt='stepCheck' />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className='arrowHeading'>
                          <h6 className={detailsTab ? 'selected' : ''}>
                            Details
                          </h6>
                          <p className={detailsTab ? 'selected' : ''}>
                            Resource info
                          </p>
                        </div>
                      </li>
                      <li className=''>
                        <div className='arrowLine'>
                          <div
                            className={`checkCircle ${checkValueExist('schedule', selectedTabs) && 'checked'}`}
                          >
                            {checkValueExist('schedule', selectedTabs) ? (
                              <img src={stepCheck} alt='stepCheck' />
                            ) : (
                              <>
                                {scheduleTab ? (
                                  <img src={stepDot} alt='stepCheck' />
                                ) : (
                                  <img src={stepBlank} alt='stepCheck' />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className='arrowHeading'>
                          <h6 className={scheduleTab ? 'selected' : ''}>
                            Schedule
                          </h6>
                          <p className={scheduleTab ? 'selected' : ''}>
                            Date, time, etc
                          </p>
                        </div>
                      </li>
                      <li className=''>
                        <div className='arrowLine'>
                          <div
                            className={`checkCircle ${checkValueExist('billing', selectedTabs) && 'checked'}`}
                          >
                            {checkValueExist('billing', selectedTabs) ? (
                              <img src={stepCheck} alt='stepCheck' />
                            ) : (
                              <>
                                {billingTab ? (
                                  <img src={stepDot} alt='stepCheck' />
                                ) : (
                                  <img src={stepBlank} alt='stepCheck' />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className='arrowHeading'>
                          <h6 className={billingTab ? 'selected' : ''}>
                            Payment
                          </h6>
                          <p className={billingTab ? 'selected' : ''}>
                            Billing
                          </p>
                        </div>
                      </li>
                      <li className=''>
                        <div className='arrowLine'>
                          <div
                            className={`checkCircle done ${checkValueExist('done', selectedTabs) && 'checked'}`}
                          >
                            {checkValueExist('done', selectedTabs) ? (
                              <img src={stepCheck} alt='stepCheck' />
                            ) : (
                              <>
                                {' '}
                                {finishTab ? (
                                  <img src={stepCheck} alt='stepCheck' />
                                ) : (
                                  <img src={stepBlank} alt='stepCheck' />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className='arrowHeading'>
                          <h6 className={finishTab ? 'selected' : ''}>Done!</h6>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className='paymentInfo'>
                    {detailsTab ? (
                      <ResourceDetails
                        resourceDetail={resourceDetails}
                        tabChoose={tabChoose}
                      />
                    ) : (
                      ''
                    )}
                    {scheduleTab ? (
                      <ResourceSchedule
                        resourceDetail={resourceDetails}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        endTime={endTime}
                        setEndTime={setEndTime}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        tabChoose={tabChoose}
                      />
                    ) : (
                      ''
                    )}
                    {billingTab ? (
                      <>
                        <div className='resourcePay'>
                          <div className='resourcePayHeading'>
                            <h6 style={{ marginBottom: '32px' }}>
                              <img
                                src={creditCard}
                                className='mr-2'
                                alt='credit'
                              />{' '}
                              Payment
                            </h6>
                          </div>

                          {instantPay ? (
                            <>
                              <div className='resourcePrice'>
                                <div>
                                  <p>
                                    Duration:{' '}
                                    {startTime
                                      ? findTimeGap(startTime, endTime)
                                      : ''}{' '}
                                    {resourceDetails.member_time}
                                  </p>
                                  <p>${resourceDetails.member_rate}</p>
                                </div>
                                <div>
                                  <p>Total</p>
                                  <p>
                                    $
                                    {(startTime
                                      ? findTimeGap(startTime, endTime)
                                      : 0) *
                                      parseInt(resourceDetails.member_rate)}
                                  </p>
                                </div>
                              </div>
                              <div className='resourceInvoice mt-4'>
                                <h5>Add to my next invoice</h5>
                                <div className='authToggle mt-0'>
                                  {authValue === true ? (
                                    <label className='switch'>
                                      <input
                                        type='checkbox'
                                        onClick={authClick}
                                        defaultChecked
                                      />
                                      <span className='slider round'></span>
                                    </label>
                                  ) : (
                                    <label className='switch'>
                                      <input
                                        type='checkbox'
                                        onClick={authClick}
                                      />
                                      <span className='slider round'></span>
                                    </label>
                                  )}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className='resourcePayment'>
                              <div className='cardPayment'>
                                <Elements stripe={stripePromise}>
                                  <CardPaymentOption
                                    authValue={authValue}
                                    setPaymentShow={setPaymentShow}
                                    selectedDate={selectedDate}
                                    startTime={startTime}
                                    endTime={endTime}
                                    resourceDetail={resourceDetails}
                                    resourceBooked={resourceBooked}
                                    tabChoose={tabChoose}
                                  />
                                </Elements>
                              </div>
                            </div>
                          )}
                        </div>
                        {instantPay ? (
                          <>
                            <div className='resourcesBtn'>
                              <button className='cancel' onClick={backSchedule}>
                                <FontAwesomeIcon
                                  className='mr-2'
                                  icon={faArrowLeft}
                                />{' '}
                                Back
                              </button>
                              <button
                                className='continue'
                                onClick={paymentFunction}
                              >
                                Continue <FontAwesomeIcon icon={faArrowRight} />
                              </button>
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                      </>
                    ) : (
                      ''
                    )}
                    {finishTab ? (
                      <ResourceDone
                        selectedDate={selectedDate}
                        startTime={startTime}
                        endTime={endTime}
                        resourceDetail={resourceDetails}
                        resourceBooked={resourceBooked}
                        tabChoose={tabChoose}
                      />
                    ) : (
                      ''
                    )}
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
