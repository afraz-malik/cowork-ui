import React, { useEffect, useState } from 'react'
import './MyHome.css'
import assetsIcon from '../../../Assets/Images/icon/assignmentIcon.svg'
import ticketIcon from '../../../Assets/Images/icon/ticketIcon.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpLong, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Table } from 'react-bootstrap'
import moment from 'moment'
import { getInvoicesList } from '../../../api/invoice'
import { DESKIE_API as API } from '../../../config'
import memberAvatar from '../../../Assets/Images/icon/memberAvatar.svg'
import spaceAvatar from '../../../Assets/Images/icon/spaceAvatar.png'
import invoiceIcon from '../../../Assets/Images/icon/receipt.png'
import arrowIcon from '../../../Assets/Images/icon/arrow-up-right.png'
import wifiIcon from '../../../Assets/Images/icon/wifi.svg'
import wifiQr from '../../../Assets/Images/icon/wifiScan.svg'
import spacesIcon from '../../../Assets/Images/icon/spacesImage.png'
import { singleJwtMember } from '../../../api/member'
import { isAuthenticate } from '../../../api/auth'
import { Link } from 'react-router-dom'

const MyHome = () => {
  let auth = isAuthenticate()
  const [invoiceList, setInvoiceList] = useState<any>([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  useEffect(() => {
    getInvoicesList(5, 1, 'all').then((data) => {
      setInvoiceList(data.invoices)
    })
    singleJwtMember(auth.token).then((data) => {
      if (data.statusCode === 200) {
        setFirstName(data.data.data.first_name)
        setLastName(data.data.data.last_name)
      }
    })
  }, [])

  return (
    <>
      <div className='mainContent' id='my-home'>
        <div className='memberHome'>
          {/* <h5>Welcome Back, <span>{firstName} {lastName}</span></h5> */}
          <div className='memberDashboard'>
            <div className='memberLeft'>
              <div className='assetsTicket'>
                <div className='ticketItem'>
                  <p>
                    <img src={assetsIcon} alt='assets' />
                    Book an Asset
                  </p>
                  <button>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className='ticketItem'>
                  <p>
                    <img src={ticketIcon} alt='ticket' />
                    Submit a Ticket
                  </p>
                  <button>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
              <div className='latestInvoice'>
                <div className='latestInvoiceHeading'>
                  <h5 style={{ borderBottom: '0' }}>
                    <img src={invoiceIcon} alt='assets' />
                    Latest Invoice
                  </h5>
                  <Link to='/my-invoice'>
                    See More <img src={arrowIcon} alt='arrow' />{' '}
                  </Link>
                </div>
                <div className='invoiceBillingList'>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>
                          ID <FontAwesomeIcon icon={faArrowUpLong} />
                        </th>
                        <th>
                          Member <FontAwesomeIcon icon={faArrowUpLong} />
                        </th>
                        <th>
                          Assignment <FontAwesomeIcon icon={faArrowUpLong} />
                        </th>
                        <th>
                          Date <FontAwesomeIcon icon={faArrowUpLong} />
                        </th>
                        <th>
                          Status <FontAwesomeIcon icon={faArrowUpLong} />
                        </th>
                        <th>
                          Amount <FontAwesomeIcon icon={faArrowUpLong} />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceList &&
                        invoiceList.map((invoice: any) => (
                          <tr>
                            <td>#INV{invoice.invoice_id}</td>
                            <td>
                              {invoice.member_image ? (
                                <img
                                  src={`${API}/${invoice.member_image}`}
                                  width='32px'
                                  height='32px'
                                  alt='avatar'
                                  style={{ borderRadius: '50%' }}
                                />
                              ) : (
                                <img
                                  className='default'
                                  src={memberAvatar}
                                  width='32px'
                                  height='32px'
                                  alt='avatar'
                                  style={{ borderRadius: '50%' }}
                                />
                              )}
                              &nbsp; &nbsp;
                              {invoice.member_first_name}{' '}
                              {invoice.member_last_name}
                            </td>
                            <td>
                              {invoice.space_image ? (
                                <img
                                  src={`${API}/${invoice.space_image}`}
                                  width='32px'
                                  height='32px'
                                  alt='avatar'
                                  style={{ borderRadius: '50%' }}
                                />
                              ) : (
                                <img
                                  src={spaceAvatar}
                                  width='32px'
                                  height='32px'
                                  alt='avatar'
                                  style={{ borderRadius: '50%' }}
                                />
                              )}
                              &nbsp; &nbsp;
                              {invoice.spaces_name}
                            </td>
                            <td>
                              {moment(invoice.renewal_date).format(
                                'MMMM DD, YYYY'
                              )}
                            </td>
                            <td className='status'>
                              <span className='unpaid'>Unpaid</span>
                              {/* {invoice.amount ? <span className='paid'>Paid</span>
                                         : <span className='unpaid'>Unpaid</span>} */}
                            </td>
                            <td>
                              {invoice.amount ? <>${invoice.amount}</> : 'N/A'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                  {/* <div className='paginationBox'>
                                <div className="tableNumber">
                                    <Dropdown className="paginationDropdown" onSelect={handleSelect}>
                                        <Dropdown.Toggle id="pageDropDown">
                                            {selectedValue}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu role="menu" aria-labelledby="pageDropDown">
                                            {numbers.map((number) => (
                                                <Dropdown.Item key={number} eventKey={number.toString()}>
                                                    {number}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <p>Showing 10 of 100 members</p>
                                </div>
                                <div className="paginationNumber">
                                    <button><FontAwesomeIcon icon={faArrowLeft} /> Previous</button>
                                    <button>1</button>
                                    <button>2</button>
                                    <button>3</button>
                                    <button>...</button>
                                    <button>8</button>
                                    <button>9</button>
                                    <button>10</button>
                                    <button>Next <FontAwesomeIcon icon={faArrowRight} /></button>
                                </div>
                            </div> */}
                </div>
              </div>
            </div>
            <div className='memberRight'>
              <div className='upcomingBook'>
                <h5>
                  <img src={assetsIcon} alt='assets' />
                  Upcoming Bookings
                </h5>
                <div className='bookingList p-3'>
                  <img src={spacesIcon} alt='member' />
                  <div className='spacesInfo'>
                    <h6>sadasd</h6>
                    <p>asa</p>
                  </div>
                </div>
              </div>
              <div className='wifiQr mt-3'>
                <h5>
                  <img src={wifiIcon} alt='assets' />
                  Wifi Access
                </h5>
                <div className='qr'>
                  <img src={wifiQr} alt='wifi' />
                  <p className='text-center'>
                    Scan <span>QR code</span> to log-in Wifi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyHome
