import React, { useState, forwardRef, useRef, useEffect } from 'react'
import './CreateInvoice.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faChevronDown,
  faPlus,
  faSearch,
  faArrowRight,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons'
import { Col, Container, Dropdown, Row } from 'react-bootstrap'
import Layout from '../../Component/Layout/Layout'
import DatePicker from 'react-datepicker'
import calenderIcon from '../../Assets/Images/icon/calendar.png'
import { v4 as uuidv4 } from 'uuid'
import { getLastInvoice, invoiceAdd } from '../../api/invoice'
import { showNotifications } from '../../CommonFunction/toaster'
import { useForm } from 'react-hook-form'
import { getMemberList } from '../../api/member'
import { ToastContainer } from 'react-toastify'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getSpacesList } from '../../api/spaces'
import { DESKIE_API as API } from '../../config'
import memberIcon from '../../Assets/Images/icon/memberAvatar.png'
import spaceIcon from '../../Assets/Images/icon/spaceAvatar.png'
import refresh from '../../Assets/Images/icon/refresh.png'
import { CustomHeader } from '../../CommonFunction/Function'
import DateCalender from '../../Component/DateCalender/DateCalender'

const CreateInvoice = () => {
  const navigate = useNavigate()
  const [dueDate, setDueDate] = useState<any>('')
  const [memberId, setMemberId] = useState<string>('')
  const [spacesId, setSpacesId] = useState<string>('')
  const [memberList, setMemberList] = useState([])
  const [spacesList, setSpacesList] = useState([])
  const location = useLocation()
  const pathArray = location.pathname.split('/')
  const urlParams = pathArray[pathArray.length - 1]
  const [isActive, setIsActive] = useState(false)
  const [searchMembers, setSearchMembers] = useState('')
  const [searchSpaces, setSearchSpaces] = useState('')
  const [selectEmail, setSelectEmail] = useState('')
  const [memberImage, setMemberImage] = useState('')
  const [selectName, setSelectName] = useState('')
  const [spaceActive, setSpaceActive] = useState(false)
  const [invoiceId, setInvoiceId] = useState('')
  const [notes, setNotes] = useState('')
  const [authValue, setAuthValue] = useState(false)
  const initialRenewalDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date
  }
  const [renewalDate, setRenewalDate] = useState<any>(initialRenewalDate())
  const [frequency, setFrequency] = useState('monthly')
  const [discountAmount, setDiscountAmount] = useState('')
  const [amount, setAmount] = useState('')
  const form = useRef(null)
  const { handleSubmit, register, setValue } = useForm()
  const [spacesName, setSpacesName] = useState('')
  const [spacesImage, setSpacesImage] = useState('')
  const [spacesRate, setSpacesRate] = useState('')
  useEffect(() => {
    getMemberList(10, 1).then((data) => {
      if (data.statusCode !== 200) {
      } else {
        setMemberList(data.members)
      }
    })
    getSpacesList(10, 1).then((data) => {
      if (data.statusCode !== 200) {
      } else {
        setSpacesList(data.spaces)
      }
    })
    getLastInvoice().then((data) => {
      setInvoiceId(`00${data.data}`)
    })
  }, [])

  const dueDateChange = (date: any) => {
    const selectedDate = new Date(date)
    selectedDate.setHours(0, 0, 0, 0)
    setDueDate(selectedDate)
  }
  const CustomDatePickerInput: React.FC<any> = forwardRef(
    ({ value, onClick }, ref) => (
      <button className='calenderBox requestInputForm' onClick={onClick}>
        {value}
        <img src={calenderIcon} alt='calender' />
      </button>
    )
  )
  const CustomDateFormatInput: React.FC<any> = forwardRef(
    ({ value, onClick }, ref) => (
      <button className='calenderBox requestInputForm' onClick={onClick}>
        {value}
        <p>MM/DD/YYYY</p>
        <img src={calenderIcon} alt='calender' />
      </button>
    )
  )

  const saveInvoice = () => {
    const company = localStorage.getItem('company')
    const userInfo = company ? JSON.parse(company) : null
    let invoice = {
      id: uuidv4(),
      email: userInfo.user.email,
      invoiceId: invoiceId,
      dueDate: dueDate,
      member: memberId,
      assignment: spacesId,
      notes: notes,
      amount: discountAmount,
      renewal_date: renewalDate,
      renewal_frequency: frequency,
    }

    invoiceAdd(invoice).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications('error', data.message)
      } else {
        showNotifications('success', 'INvoice add successfully')
        setValue('invoiceId', '')
        setValue('notes', '')
        if (userInfo.user.role === 'admin') {
          return navigate('/billing')
        } else {
          return navigate('/my-invoice')
        }
      }
    })
  }
  // member filter
  const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMembers(e.target.value)
  }
  const filteredMembers = memberList?.filter(
    (member: any) =>
      member.first_name.toLowerCase().includes(searchMembers.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchMembers.toLowerCase()) ||
      member.email.toLowerCase().includes(searchMembers.toLowerCase())
  )
  const selectMember = (member: any) => {
    setSelectName(`${member.first_name} ${member.last_name}`)
    setSelectEmail(member.email)
    setMemberId(member.id)
    setMemberImage(member.member_image)
  }
  // spaces filter
  const handleSpacesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchSpaces(e.target.value)
  }
  const filteredSpaces = spacesList?.filter((member: any) =>
    member.name.toLowerCase().includes(searchSpaces.toLowerCase())
  )

  const selectSpaces = (member: any) => {
    setSpacesName(member.name)
    setSpacesId(member.id)
    setSpacesImage(member.space_image)
    setSpacesRate(member.rate)
    setAmount(member.rate)
    setDiscountAmount(member.rate)
  }

  useEffect(() => {
    calculateRent()
  }, [amount])

  const authClick = () => {
    setAuthValue(!authValue)
  }

  const calculateRent = () => {
    const today = new Date()
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    )
    const daysRemaining = lastDayOfMonth.getDate() - today.getDate()
    const rentForCurrentMonth = (
      (parseInt(amount) / 30) *
      daysRemaining
    ).toFixed(2)
    setDiscountAmount(rentForCurrentMonth.toString())
    setRenewalDate(lastDayOfMonth)
  }

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setFrequency(eventKey)
      if (eventKey === 'daily') {
        const rentForCurrentMonth = ((parseInt(amount) / 30) * 1).toFixed(2)
        setDiscountAmount(rentForCurrentMonth.toString())
        const today = new Date()
        const newRenewalDate = new Date(today)
        newRenewalDate.setDate(today.getDate() + 1)
        setRenewalDate(newRenewalDate)
      } else if (eventKey === 'weekly') {
        const rentForCurrentMonth = ((parseInt(amount) / 30) * 7).toFixed(2)
        setDiscountAmount(rentForCurrentMonth.toString())
        const today = new Date()
        const newRenewalDate = new Date(today)
        newRenewalDate.setDate(today.getDate() + 7)
        setRenewalDate(newRenewalDate)
      } else {
        setDiscountAmount(amount)
        const today = new Date()
        const newRenewalDate = new Date(today)
        newRenewalDate.setDate(today.getDate() + 30)
        setRenewalDate(newRenewalDate)
      }
    }
  }

  const handleTodayClick = () => {
    setDueDate(new Date())
  }

  const handleYesterdayClick = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    setDueDate(yesterday)
  }

  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => (
    <div>
      <div className='calenderHeading'>
        <button
          className='arrowLeft'
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className='calenderDate'>
          {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button
          className='arrowRight'
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className='calenderBtn'>
        <button onClick={handleYesterdayClick}>Yesterday</button>
        <button onClick={handleTodayClick}>Today</button>
      </div>
    </div>
  )

  return (
    <>
      <ToastContainer />
      <div className='mainContent'>
        <div className='invoiceHeading'>
          <nav aria-label='breadcrumb'>
            <ol className='breadcrumb m-0 ms-2'>
              <li className='breadcrumb-item'>Finances</li>
              <li className='breadcrumb-item'>
                <Link to='/billing'>Billing</Link>
              </li>
              <li className='breadcrumb-item active' aria-current='page'>
                Create New Invoice
              </li>
            </ol>
          </nav>
        </div>
        <div className='createInvoice'>
          <div className='topLine'>
            <div className='tableHeading'>
              <Link className='breadLink' to='/billing'>
                <FontAwesomeIcon icon={faArrowLeft} /> All Invoices
              </Link>
            </div>
          </div>
          <div className='invoiceForm'>
            <Row>
              <Col md={6}>
                <div className='memberInput'>
                  <label>Invoice ID</label>
                  <input
                    type='text'
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    placeholder='Invoice ID'
                    className='form-control'
                    required
                  />
                </div>
              </Col>

              <Col md={6}>
                <div className='calenderInput'>
                  <label>Due Date</label>
                  {dueDate && dueDate ? (
                    <div className='dueDateFormat'>
                      <DateCalender
                        dueDate={dueDate}
                        dueDateChange={dueDateChange}
                        setDueDate={setDueDate}
                      />
                    </div>
                  ) : (
                    <div className='dueDateFormat'>
                      <DatePicker
                        placeholderText='Select a date'
                        onChange={dueDateChange}
                        dateFormat='MM/dd/yyyy'
                        customInput={<CustomDateFormatInput />}
                        renderCustomHeader={CustomHeader}
                      />
                    </div>
                  )}
                </div>
              </Col>

              <Col md={4}>
                <div className='invoiceInput'>
                  <label>Member</label>
                </div>
                <div className='memberInfos invoiceDrop'>
                  <div className='dropdown' style={{ width: '100%' }}>
                    <div
                      onClick={(e) => {
                        setIsActive(!isActive)
                      }}
                      className='dropdown-btn'
                    >
                      <div className='d-flex tableImage'>
                        {selectEmail.length ? (
                          <>
                            {memberImage ? (
                              <img
                                src={`${API}/${memberImage}`}
                                alt='avatar'
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <img src={memberIcon} alt='avatar' />
                            )}
                            <div>
                              <p>
                                {selectName.length > 40
                                  ? selectName.substring(0, 40) + '...'
                                  : selectName}
                              </p>
                              <span>
                                {selectEmail.length > 40
                                  ? selectEmail.substring(0, 40) + '...'
                                  : selectEmail}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <p>Select Member</p>
                            </div>
                          </>
                        )}
                      </div>
                      <span>
                        <FontAwesomeIcon icon={faChevronDown} />
                      </span>
                    </div>
                    <div
                      className='dropdown-content'
                      style={{ display: isActive ? 'block' : 'none' }}
                    >
                      <div className='assignInput'>
                        <FontAwesomeIcon icon={faSearch} />
                        <input
                          type='text'
                          placeholder='Search member'
                          onChange={handleMemberChange}
                          className='form-control'
                        />
                      </div>
                      {filteredMembers.map((data: any, index: number) => (
                        <div
                          onClick={(e) => {
                            setIsActive(!isActive)
                            selectMember(data)
                          }}
                          className='item tableImage'
                        >
                          {data.member_image ? (
                            <img
                              src={`${API}/${data.member_image}`}
                              alt='avatar'
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <img src={memberIcon} alt='avatar' />
                          )}
                          <p>
                            {data.first_name} {data.last_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className='memberInput'>
                  <label>Assignment</label>
                </div>
                <div className='memberInfos invoiceDrop'>
                  <div className='dropdown' style={{ width: '100%' }}>
                    <div
                      onClick={(e) => {
                        setSpaceActive(!spaceActive)
                      }}
                      className='dropdown-btn'
                    >
                      <div className='d-flex tableImage'>
                        {spacesName.length ? (
                          <>
                            {spacesImage ? (
                              <img
                                src={`${API}/${spacesImage}`}
                                alt='avatar'
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <img src={spaceIcon} alt='avatar' />
                            )}
                            <div>
                              <p>
                                {spacesName.length > 40
                                  ? spacesName.substring(0, 40) + '...'
                                  : spacesName}
                              </p>
                              <span>${spacesRate}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <p>Select Spaces</p>
                            </div>
                          </>
                        )}
                      </div>
                      <span>
                        <FontAwesomeIcon icon={faChevronDown} />
                      </span>
                    </div>
                    <div
                      className='dropdown-content'
                      style={{ display: spaceActive ? 'block' : 'none' }}
                    >
                      <div className='assignInput'>
                        <FontAwesomeIcon icon={faSearch} />
                        <input
                          type='text'
                          placeholder='Search member'
                          onChange={handleSpacesChange}
                          className='form-control'
                        />
                      </div>
                      {filteredSpaces.map((data: any, index: number) => (
                        <div
                          onClick={(e) => {
                            setSpaceActive(!spaceActive)
                            selectSpaces(data)
                          }}
                          className='item tableImage'
                        >
                          {data.space_image ? (
                            <img
                              src={`${API}/${data.space_image}`}
                              alt='avatar'
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <img src={spaceIcon} alt='avatar' />
                          )}
                          <p>{data.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={4}>
                <div className='memberInput'>
                  <label>Amount</label>
                  <input
                    type='text'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder='Amount'
                    className='form-control'
                    required
                  />
                </div>
              </Col>

              <Col md={12}>
                <div className='memberInput'>
                  <label>Note</label>
                  <textarea
                    placeholder='Enter a note...'
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className='form-control'
                    required
                  />
                </div>
              </Col>
              <Col md={12} className='d-flex justify-content-end'></Col>
            </Row>
          </div>
          <Container>
            <Row>
              <Col md={12}>
                <div className='assignName'>
                  <div className='generateInvoice'>
                    <h5>
                      {' '}
                      <img src={refresh} alt='refresh' /> Create Recurring
                      Invoice
                    </h5>
                    <div className='authToggle'>
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
                          <input type='checkbox' onClick={authClick} />
                          <span className='slider round'></span>
                        </label>
                      )}
                    </div>
                  </div>
                  {authValue ? (
                    <>
                      <div className='generateInvoice'>
                        <h6>Amount Owed Today</h6>
                        <div className='memberInput amount'>
                          <span>$</span>
                          <input
                            type='text'
                            placeholder='Rate'
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(e.target.value)}
                            className='form-control'
                          />
                          <button className='calculate' onClick={calculateRent}>
                            Calculate Pro-Rated Rent
                          </button>
                        </div>
                      </div>
                      <div className='generateInvoice'>
                        <h6>Renewal Date</h6>
                        <div className='calenderInput'>
                          <div className='dueDateFormat'>
                            <DateCalender
                              dueDate={renewalDate}
                              dueDateChange={dueDateChange}
                              setDueDate={setRenewalDate}
                            />
                            {/* <DatePicker selected={renewalDate} placeholderText="Select a date" onChange={dueDateChange} dateFormat="MM/dd/yyyy" customInput={<CustomDatePickerInput />} renderCustomHeader={CustomHeader} /> */}
                          </div>
                        </div>
                      </div>
                      <div className='generateInvoice'>
                        <h6>Renewal Frequency</h6>
                        <div className='memberInput'>
                          <Dropdown onSelect={handleSelect}>
                            <Dropdown.Toggle
                              variant=''
                              className='custom-toggle'
                            >
                              {frequency === 'daily'
                                ? 'Daily'
                                : frequency === 'weekly'
                                ? 'Weekly'
                                : frequency === 'monthly'
                                ? 'Monthly'
                                : 'Choose type'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item eventKey='daily'>
                                Daily
                              </Dropdown.Item>
                              <Dropdown.Item eventKey='weekly'>
                                Weekly
                              </Dropdown.Item>
                              <Dropdown.Item eventKey='monthly'>
                                Monthly
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className='invoiceSave'>
                    <button
                      className='invoiceBtn active'
                      type='submit'
                      onClick={saveInvoice}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Create New Invoice
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  )
}

export default CreateInvoice
