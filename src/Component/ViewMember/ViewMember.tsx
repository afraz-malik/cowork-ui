import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { singleMember, memberSpaces, memberInvoice } from '../../api/member'
import { DESKIE_API as API } from '../../config'
import memberBlank from '../../Assets/Images/icon/memberAvatar.svg'
import spacesBlank from '../../Assets/Images/icon/spaceAvatar.png'
import more from '../../Assets/Images/icon/dots-vertical.svg'
import { Link, useParams } from 'react-router-dom'
import Layout from '../Layout/Layout'
import penIcon from '../../Assets/Images/icon/pencil-01.svg'
import EditMember from './EditMember'
import memberAvatar from '../../Assets/Images/icon/memberLargeIcon.png'
import spacesIcon from '../../Assets/Images/icon/spaceAvatar.png'
import PhoneInput from 'react-phone-input-2'

const ViewMember = () => {
  const { id } = useParams()
  const [memberDetails, setMemberDetails] = useState<any>({})
  const [spacesList, setSpacesList] = useState<any>([])
  const [invoiceList, setInvoiceList] = useState<any>([])

  const [memberId, setMemberId] = useState('')
  const [updateShow, setUpdateShow] = useState(false)
  const handleUpdateClose = () => setUpdateShow(false)

  useEffect(() => {
    if (id) {
      singleMember(id).then((data) => {
        setMemberDetails(data.data && data.data)
      })
      memberSpaces(id, 10, 1).then((data) => {
        setSpacesList(data.spaces && data.spaces)
      })
      memberInvoice(id, 10, 1).then((data) => {
        setInvoiceList(data.invoice && data.invoice)
      })
    }
  }, [])

  // member update view
  const memberUpdate = (memberId: string) => {
    setMemberId(memberId)
    setUpdateShow(true)
  }

  return (
    <div id='view-member'>
      <Layout>
        <div className='mainContent'>
          <div className='invoiceHeading'>
            <nav aria-label='breadcrumb'>
              <ol className='breadcrumb m-0 ms-2'>
                <li className='breadcrumb-item'>
                  <Link to='/member'>Members</Link>
                </li>
                <li className='breadcrumb-item active' aria-current='page'>
                  {memberDetails.first_name} {memberDetails.last_name}
                </li>
              </ol>
            </nav>
          </div>
          <div className='membersDetails'>
            <div className='topLine'>
              <div className='tableHeading'>
                <div className='memberName'>
                  <Link to='/member' className='backDashboard'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </Link>
                  {memberDetails.member_image ? (
                    <>
                      <img
                        src={`${API}/${memberDetails.member_image}`}
                        alt='avatar'
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={memberAvatar}
                        alt='avatar'
                        style={{ borderRadius: '50%' }}
                      />
                    </>
                  )}
                  <div>
                    <h6 className='mb-1'>
                      {memberDetails.first_name} {memberDetails.last_name}
                    </h6>
                    <p>Member</p>
                  </div>
                </div>
              </div>
              <div className='editBtn'>
                {memberDetails.account_active === 1 ? (
                  ''
                ) : (
                  <span className='invite'>Invitation Pending</span>
                )}

                <button
                  className='edit py-2'
                  onClick={() => memberUpdate(memberDetails.id)}
                >
                  <img src={penIcon} alt='edit' /> Edit Member
                </button>

                <button
                  className='edit disableBtn'
                  //   onClick={() => memberUpdate(memberDetails.id)}
                >
                  Disable Member
                </button>

                <button
                  className='edit py-2'
                  onClick={() => memberUpdate(memberDetails.id)}
                >
                  <img src={penIcon} alt='edit' /> Edit Member
                </button>
              </div>
            </div>
            <div className='memberInfo'>
              <div className='memberInfoBox'>
                <h6>Phone Number</h6>
                <p className='memberPhone'>
                  <PhoneInput
                    country={'us'}
                    inputProps={{ readOnly: true }}
                    disableCountryCode={false}
                    value={memberDetails.phone_number}
                  />
                </p>
              </div>
              <div
                className='memberInfoBox'
                style={{
                  borderLeft: '1px solid  rgba(234, 236, 240, 1)',
                  borderRight: '1px solid  rgba(234, 236, 240, 1)',
                }}
              >
                <h6>Email Address</h6>
                <p>{memberDetails.email}</p>
              </div>
              <div className='memberInfoBox'>
                <h6>Account Signup Date</h6>
                <p>
                  {moment(memberDetails.created_at).format('MMMM DD, YYYY')}
                </p>
              </div>
              <div className='memberInfoBox'>
                <h6>Business Name</h6>
                <p>{memberDetails.business_name}</p>
              </div>
              <div
                className='memberInfoBox'
                style={{
                  borderLeft: '1px solid  rgba(234, 236, 240, 1)',
                  borderRight: '1px solid  rgba(234, 236, 240, 1)',
                }}
              >
                <h6>Business Phone</h6>
                <p className='memberPhone'>
                  <PhoneInput
                    country={'us'}
                    inputProps={{ readOnly: true }}
                    disableCountryCode={false}
                    value={memberDetails.business_phone}
                  />
                </p>
              </div>
              <div className='memberInfoBox'>
                <h6>Business Email</h6>
                <p>{memberDetails.business_email}</p>
              </div>
            </div>
            <div className='memberInvoice'>
              <div className='invoiceLeft'>
                <div className='memberNotes'>
                  <h6>Notes</h6>
                  <p className='mb-0'>
                    {memberDetails.notes
                      ? memberDetails.notes
                      : 'You haven’t added any notes for this user.'}
                  </p>
                </div>
                <div className='memberAssign mt-4'>
                  <h6 className='mb-3'>
                    {memberDetails.first_name}’s Active Assignments
                  </h6>
                  {spacesList && spacesList.length ? (
                    spacesList &&
                    spacesList.map((spaces: any) => (
                      <div className='invoiceHeading'>
                        <div className='invoiceName'>
                          <p>
                            {spaces.spaces_image ? (
                              <img
                                src={`${API}/${spaces.spaces_image}`}
                                alt='member'
                              />
                            ) : (
                              <img src={spacesIcon} alt='spaces' />
                            )}{' '}
                            <span>{spaces.spaces_name}</span>{' '}
                          </p>
                          <div className='deskType'>
                            {spaces.spaces_tag === 'private' ? (
                              <span className='private'>Private Office</span>
                            ) : (
                              ''
                            )}
                            {spaces.spaces_tag === 'dedicated' ? (
                              <span className='dedicated'>Dedicated Desk</span>
                            ) : (
                              ''
                            )}
                            {spaces.spaces_tag === 'flex' ? (
                              <span className='flex'>Flex</span>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>

                        <div className='invoicePrice billingAction'>
                          <p>
                            ${spaces.amount}{' '}
                            <span>
                              /
                              {spaces.renewal_frequency === 'monthly'
                                ? 'mo'
                                : 'we'}
                            </span>{' '}
                          </p>
                          <button className='btn download'>
                            <img src={more} alt='download' />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='mb-0'>No active assignments.</p>
                  )}
                </div>
                <div className='invoiceHistory mt-4'>
                  <div className='mb-3 d-flex justify-content-between'>
                    <h6 className='mb-0'>
                      {memberDetails.first_name}’s Invoice History
                    </h6>
                    <p className='mb-0 balance'>Balance: ${'0.00'}</p>
                  </div>
                  {invoiceList && invoiceList.length ? (
                    <div className='invoiceMemberList'>
                      {invoiceList &&
                        invoiceList.map((invoice: any) => (
                          <div className='invoiceBox'>
                            <div className='invoiceHeading'>
                              <div className='invoiceName'>
                                <h6>
                                  {invoice.spaces_name
                                    ? invoice.spaces_name
                                    : 'N/A'}
                                </h6>
                                <p>
                                  {' '}
                                  {invoice.member_image ? (
                                    <img
                                      src={`${API}/${invoice.member_image}`}
                                      alt='member'
                                    />
                                  ) : (
                                    <img
                                      className='default'
                                      src={memberBlank}
                                      alt='member'
                                    />
                                  )}{' '}
                                  <span>{invoice.member_name}</span>{' '}
                                </p>
                              </div>
                              <div className='invoicePrice billingAction'>
                                <p>
                                  ${invoice.amount}{' '}
                                  <span>
                                    /
                                    {invoice.renewal_frequency === 'monthly'
                                      ? 'mo'
                                      : 'we'}
                                  </span>{' '}
                                </p>
                                <button className='btn download'>
                                  <img src={more} alt='download' />
                                </button>
                              </div>
                            </div>
                            <div className='invoiceDetails'>
                              <div className='assign'>
                                <h6>Assignment</h6>
                                <p>
                                  {' '}
                                  {invoice.spaces_image ? (
                                    <img
                                      src={`${API}/${invoice.spaces_image}`}
                                      alt='member'
                                    />
                                  ) : (
                                    <img src={spacesBlank} alt='member' />
                                  )}{' '}
                                  <span>
                                    {invoice.spaces_name
                                      ? invoice.spaces_name
                                      : 'N/A'}
                                  </span>{' '}
                                </p>
                              </div>
                              <div className='assign'>
                                <h6>Due Date</h6>
                                <p>
                                  {invoice.invoice_date ? (
                                    <>
                                      {moment(invoice.invoice_date).format(
                                        'MMMM DD, YYYY'
                                      )}
                                    </>
                                  ) : (
                                    'N/A'
                                  )}
                                </p>
                              </div>
                              <div className='assign'>
                                <h6>Status</h6>
                                <p className='status'>
                                  {invoice.invoice_status === 'paid' ? (
                                    <span className='paid'>Paid</span>
                                  ) : invoice.invoice_status === 'void' ? (
                                    <span className='unpaid'>Void</span>
                                  ) : (
                                    <span className='unpaid'>Unpaid</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className='mb-0'>No invoice history.</p>
                  )}
                </div>
              </div>
              <div className='invoiceRight'>
                <div className='memberBooking'>
                  <h6 className='mb-3'>
                    {memberDetails.first_name}’s Upcoming Bookings
                  </h6>
                  <p className='mb-0'>No upcoming bookings.</p>
                  {/* <div className="bookingList">
                                        <img src={`${API}/${memberDetails.member_image}`} alt="member" />
                                        <div className="spacesInfo">
                                            <h6>{memberDetails.member_image}</h6>
                                            <p>asa</p>
                                        </div>
                                    </div>
                                    <div className="bookingList">
                                        <img src={`${API}/${memberDetails.member_image}`} alt="member" />
                                        <div className="spacesInfo">
                                            <h6>{memberDetails.member_image}</h6>
                                            <p>asa</p>
                                        </div>
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <EditMember
          memberId={memberId}
          updateShow={updateShow}
          setUpdateShow={setUpdateShow}
          handleUpdateClose={handleUpdateClose}
        />
      </Layout>
    </div>
  )
}

export default ViewMember
