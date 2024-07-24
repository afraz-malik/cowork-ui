import React, { useState } from 'react'
import Layout from '../../Component/Layout/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faChevronDown,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import './InvoiceDetails.css'
import avatar from '../../Assets/Images/icon/Avatar.png'
import download from '../../Assets/Images/icon/download-02.svg'
import recordFile from '../../Assets/Images/icon/record.svg'
import emailFile from '../../Assets/Images/icon/mail-01.svg'
import voidFile from '../../Assets/Images/icon/void.svg'
import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  invoiceItems,
  invoiceUpdate,
  invoicesResource,
  singleInvoice,
} from '../../api/invoice'
import moment from 'moment'
import { DESKIE_API as API } from '../../config'
import { usePDF } from 'react-to-pdf'
import { Dropdown } from 'react-bootstrap'
import RecordPayment from '../../Component/RecordPayment/RecordPayment'
import spacesImage from '../../Assets/Images/icon/spaceAvatar.png'
import memberImage from '../../Assets/Images/icon/memberAvatar.svg'
import { paymentVoid } from './../../api/invoice'
import { showNotifications } from '../../CommonFunction/toaster'
import { v4 as uuidv4 } from 'uuid'
import { isAuthenticate } from '../../api/auth'
import { ToastContainer } from 'react-toastify'
import { invoiceFormatTimes } from '../../CommonFunction/Function'
import BillPayment from '../Billing/BillPayment'

const InvoiceDetails = () => {
  const { id } = useParams()
  const location = useLocation()
  const [urlTag, sttUrlTag] = useState('')
  const [invoiceDetail, setInvoiceDetail] = useState<any>({})
  const [resourceDetail, setResourceDetail] = useState<any>([])
  const [itemTotalPrice, setItemTotalPrice] = useState(0)
  const [show, setShow] = useState(false)
  const [count, setCount] = useState(0)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [resourceList, setResourceList] = useState([])
  const { toPDF, targetRef } = usePDF({
    filename: `${invoiceDetail && invoiceDetail.invoice_id}.pdf`,
  })
  let auth = isAuthenticate()

  const [paymentShow, setPaymentShow] = useState(false)
  const handlePaymentClose = () => setPaymentShow(false)
  useEffect(() => {
    if (id) {
      singleInvoice(id).then((data) => {
        setInvoiceDetail(data.data)
        invoicesResource(data.data.member_id).then((data) => {
          setResourceList(data)
        })
      })
      invoiceItems(id).then((data) => {
        setResourceDetail(data.item_list)
        setItemTotalPrice(data.total_amount)
      })
    }

    const pathname = location.pathname
    const invoiceDetails = pathname.split('/')[1]
    sttUrlTag(invoiceDetails)
  }, [show, id, count])

  const paymentView = () => {
    setShow(true)
  }

  const voidUpdate = () => {
    const paymentInfo = {
      void: 'void',
    }
    let voidInfo = {
      id: uuidv4(),
      invoiceId: id,
      userId: auth.user.id,
      amount: 0.0,
      paymentDate: '',
      method: '',
      paymentNote: '',
      status: 'void',
    }
    if (id) {
      paymentVoid(id, paymentInfo).then((data) => {
        if (data.statusCode !== 200) {
          showNotifications('error', data.message)
        } else {
          setCount(count + 1)
          showNotifications('success', data.message)
        }
      })
    }
  }

  return (
    <div id='invoice-detail'>

      <>
        <ToastContainer />
        <div className='mainContent'>
          <div className='invoiceHeading'>
            <nav aria-label='breadcrumb'>
              <ol className='breadcrumb m-0 ms-2'>
                <li className='breadcrumb-item px-0'>Finances</li>
                <li className='breadcrumb-item'>
                  <Link
                    to={`/${
                      urlTag === 'my-invoice-details' ? 'my-invoice' : 'billing'
                    }`}
                  >
                    Billing
                  </Link>
                </li>
                <li className='breadcrumb-item active' aria-current='page'>
                  Invoice #INV{invoiceDetail && invoiceDetail.invoice_id}
                </li>
              </ol>
            </nav>
          </div>
          <div className='createInvoice d-flex'>
            <div className='topLine'>
              <div className='tableHeading'>
                <h6 className='d-flex'>
                  <Link
                    className='backDashboard'
                    to={`/${
                      urlTag === 'my-invoice-details' ? 'my-invoice' : 'billing'
                    }`}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </Link>
                  Invoice: #INV{invoiceDetail && invoiceDetail.invoice_id}
                </h6>
              </div>
              <div className='invoiceDropdown'>
                {auth.user.userRole === 'admin' ? (
                  <Dropdown>
                    <Dropdown.Toggle>
                      <FontAwesomeIcon icon={faPlus} /> Actions{' '}
                      <FontAwesomeIcon icon={faChevronDown} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <div className='invoiceActions'>
                        <button onClick={() => paymentView()}>
                          <img src={recordFile} alt='record' /> Record Manual
                          Payment
                        </button>
                        <button>
                          <img src={emailFile} alt='record' /> Send Reminder
                        </button>
                        <button onClick={() => voidUpdate()}>
                          <img src={voidFile} alt='record' /> Void
                        </button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <button onClick={() => setPaymentShow(true)}>Pay Now</button>
                )}
              </div>
            </div>
          </div>
          <div className='invoiceInformation d-flex'>
            <div className='invoiceView' ref={targetRef}>
              <div className='invoiceDetail'>
                <div className='invoiceTop'>
                  <div className='invoiceId'>
                    <h1>
                      Invoice :{' '}
                      <span>
                        #INV{invoiceDetail && invoiceDetail.invoice_id}
                      </span>
                    </h1>
                  </div>
                  <div className='invoiceDate'>
                    <p>
                      Issued:{' '}
                      <span>
                        {invoiceDetail &&
                          moment(invoiceDetail.created_at).format(
                            'MMMM D, YYYY'
                          )}
                      </span>
                    </p>
                    <p>
                      Due:{' '}
                      <span>
                        {invoiceDetail &&
                          moment(invoiceDetail.dueDate).format('MMMM D, YYYY')}
                      </span>
                    </p>
                  </div>
                </div>
                <div className='invoiceInfo justify-content-start d-flex'>
                  <div className='invoiceId col-2 px-0'>
                    <p>Invoice ID</p>
                    <h6 className='mb-0'>
                      #{invoiceDetail && invoiceDetail.invoice_id}
                    </h6>
                  </div>
                  <div className='invoiceId col-3'>
                    <p>Status</p>
                    <h6 className='status mb-0'>
                      {invoiceDetail && invoiceDetail.status ? (
                        <span className='void'>{invoiceDetail.status}</span>
                      ) : (
                        <>
                          {invoiceDetail &&
                          parseFloat(invoiceDetail.total_payment_amount) >=
                            itemTotalPrice ? (
                            <span className='paid'>Paid</span>
                          ) : (
                            <span className='unpaid'>Unpaid</span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className='invoiceId col-3'>
                    <p>Payment Date</p>
                    <h6 className='mb-0'>
                      {invoiceDetail && invoiceDetail.payment_date ? (
                        <>
                          {moment(invoiceDetail.payment_date).format(
                            'MMMM D, YYYY'
                          )}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </h6>
                  </div>
                  <div className='invoiceId col-4 border-0'>
                    <p>Payment Method</p>
                    <h6 className='mb-0'>
                      {invoiceDetail && invoiceDetail.payment_method ? (
                        <>{invoiceDetail.payment_method}</>
                      ) : (
                        'N/A'
                      )}
                    </h6>
                  </div>
                </div>
                <div className='invoiceItem'>
                  <div className='itemHeading'>
                    <p>Item</p>
                    <p>Amount</p>
                  </div>
                  {invoiceDetail &&
                  invoiceDetail.renewal_frequency === 'monthly' ? (
                    <>
                      {resourceDetail &&
                        resourceDetail.map((resource: any, i: number) => (
                          <div key={`item` + i} className='itemList'>
                            <div className='itemName'>
                              {resource && resource.resource_image ? (
                                <img
                                  src={`${API}/${
                                    resource && resource.resource_image
                                  }`}
                                  alt='avatar'
                                />
                              ) : (
                                <img src={spacesImage} alt='avatar' />
                              )}{' '}
                              {resource && resource.resource_name
                                ? resource.resource_name
                                : 'N/A'}
                            </div>
                            <div className='itemPrice align-content-center'>
                              {resource && resource.amount ? (
                                <>${resource.amount}</>
                              ) : (
                                'N/A'
                              )}
                            </div>
                          </div>
                        ))}{' '}
                    </>
                  ) : (
                    ''
                  )}

                  {invoiceDetail &&
                  invoiceDetail.renewal_frequency === 'resource' ? (
                    <>
                      <div className='itemList'>
                        {resourceDetail &&
                          resourceDetail.map((resource: any, j: number) => (
                            <div key={`itemName` + j} className='itemName'>
                              {resource && resource.resource_image ? (
                                <img
                                  src={`${API}/${
                                    resource && resource.resource_image
                                  }`}
                                  alt='avatar'
                                />
                              ) : (
                                <img src={spacesImage} alt='avatar' />
                              )}{' '}
                              {resource && resource.resource_name
                                ? resource.resource_name
                                : 'N/A'}
                            </div>
                          ))}
                        <div className='itemPrice align-content-center'>
                          {invoiceDetail && invoiceDetail.amount ? (
                            <>${invoiceDetail.amount}</>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </div>{' '}
                    </>
                  ) : (
                    ''
                  )}

                  <div className='itemTotal'>
                    <p>
                      Total{' '}
                      <span>
                        {itemTotalPrice && itemTotalPrice ? (
                          <>${itemTotalPrice}</>
                        ) : (
                          'N/A'
                        )}
                      </span>
                    </p>
                  </div>
                  <div className='itemTotal'>
                    <p className='d-flex'>
                      Remaining Balance{' '}
                      <span>
                        {itemTotalPrice && itemTotalPrice ? (
                          <p
                            className={(invoiceDetail &&
                            parseFloat(
                              (
                                itemTotalPrice -
                                invoiceDetail.total_payment_amount
                              ).toFixed(2)
                            ) === 0
                              ? 'amountPaid'
                              : 'amountUnpaid'
                            ).toString()}
                          >
                            $
                            {parseFloat(
                              (
                                itemTotalPrice -
                                invoiceDetail.total_payment_amount
                              ).toFixed(2)
                            ).toString()}
                          </p>
                        ) : (
                          'N/A'
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='rightInvoice'>
              <div className='invoiceMember'>
                <h1>Member Info</h1>
                <div className='memberDetails'>
                  {invoiceDetail && invoiceDetail.member_image ? (
                    <img
                      src={`${API}/${invoiceDetail.member_image}`}
                      width='40px'
                      height='40px'
                      alt='avatar'
                      style={{ borderRadius: '50%' }}
                    />
                  ) : (
                    <img
                      className='default'
                      src={memberImage}
                      width='40px'
                      height='40px'
                      alt='avatar'
                      style={{ borderRadius: '50%' }}
                    />
                  )}

                  <div>
                    <p>{invoiceDetail && invoiceDetail.user_name}</p>
                    <span>{invoiceDetail && invoiceDetail.email}</span>
                  </div>
                </div>
              </div>
              <div className='invoiceDownload'>
                <p>Download Invoice</p>
                <button
                  className='mt-1 d-flex justify-content-center align-items-center'
                  onClick={() => toPDF()}
                >
                  <img
                    style={{ marginRight: '16px' }}
                    src={download}
                    alt='download'
                  />{' '}
                  Download PDF
                </button>
              </div>
              <div className='invoicePoint invoiceDownload'>
                <p>Invoice History</p>
                <ul className='list-ic vertical'>
                  {invoiceDetail && invoiceDetail.updated_date ? (
                    <li>
                      <span className='blue'></span>
                      <Link to='#'>
                        {invoiceDetail &&
                        invoiceDetail.payment_status === 'paid'
                          ? 'Invoice paid'
                          : 'Partial paid'}{' '}
                        <b>
                          {invoiceDetail &&
                            invoiceFormatTimes(invoiceDetail.updated_date)}
                        </b>
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}

                  {/* <li>

                                    <span></span>
                                    <Link to="#">Invoice Edited <b>26 Apr 2024, 11:50 AM</b></Link>
                                </li>
                                <li>
                                    <span></span>
                                    <Link to="#">Invoice Reminder Sent <b>26 Apr 2024, 11:50 AM</b></Link>
                                </li> */}

                  {invoiceDetail && invoiceDetail.invoice_view ? (
                    <li>
                      <span></span>
                      <Link to='#'>
                        Invoice Viewed{' '}
                        <b>
                          {invoiceDetail &&
                            invoiceFormatTimes(invoiceDetail.invoice_view)}
                        </b>
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}

                  <li>
                    <span></span>
                    <Link to='#'>
                      Invoice Sent{' '}
                      <b>
                        {invoiceDetail &&
                          invoiceFormatTimes(invoiceDetail.created_at)}
                      </b>
                    </Link>
                  </li>
                  <li>
                    <span></span>
                    <Link to='#'>
                      Invoice Generated{' '}
                      <b>
                        {invoiceDetail &&
                          invoiceFormatTimes(invoiceDetail.created_at)}
                      </b>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className='invoiceNotes'>
                <h1>Note</h1>
                <p className='mb-0'>
                  {invoiceDetail && invoiceDetail.notes ? (
                    <>{invoiceDetail.notes}</>
                  ) : (
                    'There are no notes for this invoice.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <RecordPayment
          invoiceId={id}
          show={show}
          setShow={setShow}
          handleClose={handleClose}
          invoiceDetail={invoiceDetail}
        />
        <BillPayment
          invoiceId={id}
          invoiceDetail={invoiceDetail}
          paymentShow={paymentShow}
          setPaymentShow={setPaymentShow}
          handlePaymentClose={handlePaymentClose}
        />
      </>

    </div>
  )
}

export default InvoiceDetails
