import React, { useState, useEffect } from 'react'
import Pagination from '../../Component/Pagination/Pagination'
import Layout from './../../Component/Layout/Layout'
import { Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faSearch } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer } from 'react-toastify'
import { getVisitorList, visitorDelete } from '../../api/visitor'
import trashIcon from '../../Assets/Images/icon/trash-icon.svg'
import downloadIcon from '../../Assets/Images/icon/download-02.svg'
import { showNotifications } from '../../CommonFunction/toaster'
import { CSVLink } from 'react-csv'
import { Link } from 'react-router-dom'

const VisitorList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [visitorList, setVisitorList] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalValue, setTotalValue] = useState<number>(0)
  const [limitValue, setLimitValue] = useState<number>(0)
  const pageCount = Math.ceil(totalValue / limitValue)
  const [prevButton, setPrevButton] = useState<boolean>(false)
  const [nextButton, setNextButton] = useState<boolean>(false)
  const [pageValue, setPageValue] = useState<number>()
  const [count, setCount] = useState<number>(0)
  function processDateTime(create_ad: string) {
    function separateDateTime(datetime: string) {
      const [date, time] = datetime.split(' ')
      return { date, time }
    }

    function convertTo12HourFormat(time24: string) {
      const [hourStr, minuteStr] = time24.split(':')
      let hour = parseInt(hourStr)
      const minute = parseInt(minuteStr)

      const period = hour >= 12 ? 'PM' : 'AM'
      hour = hour % 12 || 12

      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = minute.toString().padStart(2, '0')

      return `${formattedHour}:${formattedMinute} ${period}`
    }

    function formatDate(dateStr: string) {
      const date = new Date(dateStr)
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(date)
    }

    const { date, time } = separateDateTime(create_ad)
    const formattedDate = formatDate(date)
    const time12Hour = convertTo12HourFormat(time)

    return { date: formattedDate, time: time12Hour }
  }

  useEffect(() => {
    getVisitorList(limit, page).then((data) => {
      const processedVisitorList = data.visitor.map((visitor: any) => {
        const { date, time } = processDateTime(visitor.created_at)
        return {
          ...visitor,
          create_at_date: date,
          create_at_time: time,
        }
      })
      setVisitorList(processedVisitorList)
      setTotalValue(data.total)
      setLimitValue(data.limit)
      setPageValue(data.page)
    })
  }, [limit, page, count])

  useEffect(() => {
    if (pageCount > 1) {
      setPrevButton(true)
    }
    if (page === 1) {
      setPrevButton(false)
    }
    // next button
    if (pageCount > 1) {
      setNextButton(true)
    }
    if (pageCount === page) {
      setNextButton(false)
    }
  }, [pageCount, page])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  const filteredVisitor = visitorList.filter(
    (visitor: any) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const nextPage = () => {
    setPage(page + 1)
    setNextButton(true)
  }

  const prevPage = () => {
    setPage(page - 1)
  }
  const deleteVisitor = (visitorId: string) => {
    visitorDelete(visitorId).then((data) => {
      showNotifications('success', 'Visitor delete successfully')
      setCount(count + 1)
    })
  }

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Email Address', key: 'email' },
    { label: 'Check In Date', key: 'create_at_date' },
    { label: 'Check In Time', key: 'create_at_time' },
    { label: 'Reason', key: 'reason' },
    { label: 'Looking', key: 'looking' },
  ]

  const csvData = visitorList.map((visitor: any) => ({
    name: visitor.name,
    email: visitor.email,
    create_at_date: visitor.create_at_date,
    create_at_time: visitor.create_at_time,
    reason: visitor.reason,
    looking: visitor.looking,
  }))

  return (
    <div id='visitor'>

      <>
        <ToastContainer />
        <div className='mainContent' id='visitor-log'>
          <div className='memberBox border-0'>
            <div className='topLine'>
              <div className='tableHeading'>
                <h6>All Visitors</h6>
              </div>
              <div className='memberSearch'>
                <div className='searchInput'>
                  <input
                    type='text'
                    placeholder='Search visitors'
                    onChange={handleInputChange}
                    className='form-control'
                  />
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <CSVLink
                  className='visitorDownload'
                  data={csvData}
                  headers={headers}
                  filename={'visitors.csv'}
                >
                  <button>
                    <img src={downloadIcon} alt='downloadIcon' />
                    &nbsp; Download CSV
                  </button>
                </CSVLink>

              </div>
              <CSVLink
                className='visitorDownload'
                data={csvData}
                headers={headers}
                filename={'visitors.csv'}
              >
                <button>
                  <img src={downloadIcon} alt='downloadIcon' />
                  &nbsp; Download CSV
                </button>
              </CSVLink>
            </div>
          </div>


            <div className='memberList visitorList'>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>
                      <label className='tableCheckBox'>
                        <div className='contactCheck'>
                          <input type='checkbox' name='agreement' />
                          <span className='checkmark'></span>
                        </div>
                      </label>
                    </th>
                    <th>
                      Name <FontAwesomeIcon icon={faArrowUp} />
                    </th>
                    <th>Email Address</th>
                    <th>Time / Date</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisitor &&
                    filteredVisitor.map((visitor: any, index: number) => (
                      <tr key={`refer` + index}>
                        <td>
                          <label className='tableCheckBox'>
                            <div className='contactCheck d-flex'>
                              <input type='checkbox' name='agreement' />
                              <span className='checkmark'></span>
                            </div>
                          </label>
                        </td>
                        <td className='tableAction'>{visitor.name}</td>
                        <td className='tableAction'>{visitor.email}</td>
                        <td className='tableAction'>
                          <span style={{ marginBottom: '1rem' }}>
                            {visitor.create_at_date}
                          </span>
                          <br />
                          {visitor.create_at_time}
                        </td>
                        <td className='tableAction reason'>
                          {visitor.reason}
                          {visitor.member_name ? (
                            <>
                              <br />
                              <Link to={`/visitor/${visitor.member_id}`}>
                                ({visitor.member_name})
                              </Link>
                            </>
                          ) : (
                            ''
                          )}
                          {visitor.admin_name ? (
                            <>
                              <br />
                              <Link to='/settings'>({visitor.admin_name})</Link>
                            </>
                          ) : (
                            ''
                          )}
                        </td>
                        <td className='tableAction'>
                          <button
                            className='btn removeVisitor'
                            onClick={() => deleteVisitor(visitor.id)}
                          >
                            <img src={trashIcon} alt='trash' />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <Pagination
                page={page}
                paginationTitle='items'
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                prevButton={prevButton}
                nextButton={nextButton}
                pageValue={pageValue}
                totalValue={totalValue}
                prevPage={prevPage}
                nextPage={nextPage}
                allRequestList={visitorList}
              />
            </div>
          </div>
        </div>
      </>

    </div>
  )
}

export default VisitorList
