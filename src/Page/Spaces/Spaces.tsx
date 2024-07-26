import React, { useState, useEffect } from 'react'
import { Dropdown, Table } from 'react-bootstrap'
import './Spaces.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import Layout from '../../Component/Layout/Layout'
import { DESKIE_API as API } from '../../config'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import AddSpace from '../../Component/AddSpace/AddSpace'
import filter from '../../Assets/Images/icon/filter-lines.svg'
import { getSpacesList } from '../../api/spaces'
import editPen from '../../Assets/Images/icon/edit-01.svg'
import EditSpaces from '../../Component/ViewSpaces/EditSpaces'
import AssignMember from '../../Component/AssignMember/AssignMember'
import { separateComma } from '../../CommonFunction/Function'
import blankUser from '../../Assets/Images/icon/blank-profile.jpg'
import memberAvatar from '../../Assets/Images/icon/memberAvatar.svg'
import spaceAvatar from '../../Assets/Images/icon/spaceAvatar.png'
import Pagination from '../../Component/Pagination/Pagination'
import { Link, useNavigate } from 'react-router-dom'

const Spaces = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [assignShow, setAssignShow] = useState(false)
  const handleAssignClose = () => setAssignShow(false)
  const [spaces, setSpaces] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [spacesId, setSpacesId] = useState('')
  const [spaceId, setSpaceId] = useState('')
  const [updateShow, setUpdateShow] = useState(false)
  const handleUpdateClose = () => setUpdateShow(false)
  const [totalValue, setTotalValue] = useState<any>()
  const [limitValue, setLimitValue] = useState<any>()
  const [page, setPage] = useState(1)
  const [keywords, setKeywords] = useState('')
  const [limit, setLimit] = useState<number>(10)
  const pageCount = Math.ceil(totalValue / limitValue)
  const [prevButton, setPrevButton] = useState<boolean>(false)
  const [nextButton, setNextButton] = useState<boolean>(false)
  const [pageValue, setPageValue] = useState<number>()
  const [showFilter, setShowFilters] = useState(false)
  const [filterTag, setFilterTag] = useState<any>([])
  const [status, setstatus] = useState<any>([])
  const [rate, setRate] = useState({ min: '', max: '' })
  const [key, setKey] = useState(1)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('DESC')

  const onSort = (column: string) => {
    setSortColumn(column)
    setSortOrder((prevOrder) => (prevOrder === 'ASC' ? 'DESC' : 'ASC'))
  }
  useEffect(() => {
    getSpacesList(
      limit,
      page,
      keywords,
      filterTag,
      rate,
      status,
      sortOrder,
      sortColumn
    ).then((data) => {
      if (data.statusCode !== 200) {
      } else {
        setSpaces(data && data.spaces)
        setTotalValue(data && data.total)
        setLimitValue(data && data.limit)
        setPageValue(data && data.page)
      }
    })
  }, [
    show,
    page,
    totalValue,
    limitValue,
    limit,
    updateShow,
    assignShow,
    keywords,
    filterTag,
    status,
    rate,
    sortOrder,
    sortColumn,
  ])

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

  const handleFilterTagChange = (tag: any) => {
    setFilterTag((prevTags: any) =>
      prevTags.includes(tag)
        ? prevTags.filter((t: any) => t !== tag)
        : [...prevTags, tag]
    )
  }
  const handleStatusChange = (tag: any) => {
    setstatus((prevTags: any) =>
      prevTags.includes(tag)
        ? prevTags.filter((t: any) => t !== tag)
        : [...prevTags, tag]
    )
  }

  const handleRateChange = (e: any) => {
    const { name, value } = e.target
    setRate((prevRate: any) => ({ ...prevRate, [name]: value }))
  }
  const showResult = (value: number) => {
    setPage(1)
    setLimit(value)
  }

  // view
  const spacesView = (spacesId: string) => {
    setSpacesId(spacesId)
    return navigate(`${spacesId}`)
  }

  // update spaces
  const spacesUpdate = (spacesId: string) => {
    setSpacesId(spacesId)
    setUpdateShow(true)
  }

  // search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value)
  }

  const assignMembers = (spacesId: string) => {
    setAssignShow(true)
    setSpaceId(spacesId)
  }

  const nextPage = () => {
    setPage(page + 1)
    setNextButton(true)
  }

  const prevPage = () => {
    setPage(page - 1)
  }

  const handleToggle = (isOpen: any) => {
    setShowFilters(isOpen)
  }

  const handleClick = (e: any) => {
    // Prevent closing dropdown on input interactions
    e.stopPropagation()
  }

  const handleShowFilter = () => {
    // Close the dropdown when clicking the Show Filter button
    setShowFilters(false)
  }
  useEffect(() => {
    // This useEffect will run whenever the filterTag state changes
    console.log('Filter tags updated:', filterTag)
    setKey(key + 1)
    // Any additional logic to handle filterTag changes can be placed here
  }, [filterTag])

  const removeFilterTag = (tag: any) => {
    if (tag === 'available' || tag === 'unavailable') {
      setstatus(status.filter((t: any) => t !== tag))
    } else {
      setFilterTag(filterTag.filter((t: any) => t !== tag))
    }
  }
  return (
    <>
      <>
        <div className='mainContent'>
          <div className='memberBox'>
            <div className='topLine'>
              <div className='tableHeading'>
                <h6>All Assets</h6>
              </div>
              <div className='memberSearch'>
                <div className='searchInput'>
                  <input
                    type='text'
                    placeholder='Search assets'
                    value={keywords}
                    onChange={handleInputChange}
                    className='form-control'
                  />
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <div className='filterDropdown taskDropdown spacesDropDown'>
                  <Dropdown key={key} show={showFilter} onToggle={handleToggle}>
                    <Dropdown.Toggle>
                      <button className='filterBtn'>
                        <img className='mr-2' src={filter} alt='filter' />
                        Filters
                      </button>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Header>
                        <span className='filter-assest-page'>Filter</span>
                      </Dropdown.Header>

                      <Dropdown.Header
                        color='#98A2B3'
                        style={{ fontWeight: 500 }}
                      >
                        Type
                      </Dropdown.Header>
                      <Dropdown.Item onClick={handleClick}>
                        <label>
                          <input
                            type='checkbox'
                            checked={filterTag.includes('private')}
                            onChange={() => handleFilterTagChange('private')}
                          />
                          Private Office
                        </label>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleClick}>
                        <label>
                          <input
                            type='checkbox'
                            checked={filterTag.includes('dedicated')}
                            onChange={() => handleFilterTagChange('dedicated')}
                          />
                          Dedicated Desk
                        </label>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleClick}>
                        <label>
                          <input
                            type='checkbox'
                            checked={filterTag.includes('flex')}
                            onChange={() => handleFilterTagChange('flex')}
                          />
                          Flex
                        </label>
                      </Dropdown.Item>

                      <Dropdown.Header style={{ fontWeight: 500 }}>
                        Status
                      </Dropdown.Header>
                      <Dropdown.Item onClick={handleClick}>
                        <label>
                          <input
                            type='checkbox'
                            checked={status.includes('available')}
                            onChange={() => handleStatusChange('available')}
                          />
                          Available
                        </label>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleClick}>
                        <label>
                          <input
                            type='checkbox'
                            checked={status.includes('unavailable')}
                            onChange={() => handleStatusChange('unavailable')}
                          />
                          Unavailable
                        </label>
                      </Dropdown.Item>

                      <Dropdown.Header
                        color='#98A2B3'
                        style={{ fontWeight: 500 }}
                      >
                        Rate
                      </Dropdown.Header>
                      <Dropdown.Item onClick={handleClick}>
                        <div className='memberInput rate spacesFilter'>
                          <span>$</span>
                          <input
                            type='number'
                            name='min'
                            value={rate.min}
                            onChange={handleRateChange}
                            placeholder='Min'
                            className='form-control'
                          />
                          <button className='rateButton'>USD</button>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleClick}>
                        <div className='memberInput rate spacesFilter'>
                          <span>$</span>
                          <input
                            type='number'
                            name='max'
                            value={rate.max}
                            onChange={handleRateChange}
                            placeholder='Max'
                            className='form-control'
                          />
                          <button className='rateButton'>USD</button>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item
                        as='button'
                        className='button mt-2 showFilter'
                        onClick={handleShowFilter}
                      >
                        Show Filter
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                {/* <button className='filterBtn'>
                  <img className='mr-2' src={filter} alt='filter' /> Filter
                </button> */}
                <button onClick={handleShow}>
                  <FontAwesomeIcon icon={faPlus} /> Add Asset
                </button>
              </div>
            </div>
            {!showFilter &&
              (filterTag.length > 0 ||
                rate.max ||
                rate.max ||
                status.length > 0) && (
                <div className='filter-tags-container'>
                  <span>Show Filter</span>
                  {filterTag.map((tag: any) => (
                    <div
                      key={tag}
                      className={`filter-tag ${tag
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {tag}
                      <span
                        className='remove-tag'
                        onClick={() => removeFilterTag(tag)}
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                  {status.map((tag: any) => (
                    <div
                      key={tag}
                      className={`filter-tag ${tag
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {tag}
                      <span
                        className='remove-tag'
                        onClick={() => removeFilterTag(tag)}
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                  {rate.min && (
                    <div className={`filter-tag rate`}>
                      {rate.min && `Min: $${rate.min}/mo`}
                      <span
                        className='remove-tag'
                        onClick={() => setRate({ ...rate, min: '' })}
                      >
                        &times;
                      </span>
                    </div>
                  )}
                  {rate.max && (
                    <div className={`filter-tag rate`}>
                      {rate.max && `Max: $${rate.max}/mo`}
                      <span
                        className='remove-tag'
                        onClick={() => setRate({ ...rate, max: '' })}
                      >
                        &times;
                      </span>
                    </div>
                  )}
                </div>
              )}
            <div className='spaceList'>
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
                    <th></th>
                    <th
                      onClick={() => onSort('name')}
                      style={{ cursor: 'pointer' }}
                    >
                      Name
                      <SortIcon />
                    </th>
                    <th
                      onClick={() => onSort('tag')}
                      style={{ cursor: 'pointer' }}
                    >
                      Type
                      <SortIcon />
                    </th>
                    <th
                      onClick={() => onSort('rate')}
                      style={{ cursor: 'pointer' }}
                    >
                      Rate
                      <SortIcon />
                    </th>
                    <th
                      onClick={() => onSort('member_images')}
                      style={{ cursor: 'pointer' }}
                    >
                      Status
                      <SortIcon />
                    </th>
                    <th>Assignment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {spaces &&
                    spaces.map((data: any, index) => (
                      <tr key={`refer` + index}>
                        <td>
                          <label className='tableCheckBox'>
                            <div className='contactCheck'>
                              <input type='checkbox' name='agreement' />
                              <span className='checkmark'></span>
                            </div>
                          </label>
                        </td>
                        <td>
                          <div
                            className='tableImage justify-content-center'
                            style={{ cursor: 'pointer' }}
                            onClick={() => spacesView(data.id)}
                          >
                            {data.space_image ? (
                              <img
                                src={`${API}/${data.space_image}`}
                                alt='avatar'
                                style={{
                                  objectFit: 'cover',
                                  borderRadius: '50%',
                                }}
                              />
                            ) : (
                              <img
                                src={spaceAvatar}
                                alt='avatar'
                                style={{ borderRadius: '50%' }}
                              />
                            )}{' '}
                          </div>
                        </td>
                        <td className='tableLink'>
                          <Link to={`${data.id}`}>{data.name}</Link>
                        </td>
                        <td
                          className='deskType'
                          style={
                            {
                              // display: 'flex',
                              // alignItems: 'center',
                              // justifyContent: 'start',
                            }
                          }
                        >
                          {data.tag === 'private' ? (
                            <span className='private'>Private Office</span>
                          ) : (
                            ''
                          )}
                          {data.tag === 'dedicated' ? (
                            <span className='dedicated'>Dedicated Desk</span>
                          ) : (
                            ''
                          )}
                          {data.tag === 'flex' ? (
                            <span className='flex'>Flex</span>
                          ) : (
                            ''
                          )}
                        </td>
                        <td className='rate'>
                          ${data.rate} <small>/mo</small>
                        </td>
                        <td className='status'>
                          {data.member_images ? (
                            <span className='unavailable'>Unavailable</span>
                          ) : (
                            <span className='available'>Available</span>
                          )}
                        </td>
                        <td className='tableAction'>
                          {data.member_images ? (
                            <>
                              <div className='memberSpacesList'>
                                {data.member_images &&
                                  separateComma(data.member_images).map(
                                    (member: any, i: number) => (
                                      <div key={`memberImage` + i}>
                                        {member === 'imgNull' ? (
                                          <img
                                            className='avatar-icon36 default'
                                            alt=''
                                            src={memberAvatar}
                                          />
                                        ) : (
                                          <img
                                            className='avatar-icon36'
                                            alt=''
                                            src={`${API}/${member}`}
                                          />
                                        )}
                                      </div>
                                    )
                                  )}
                                <div
                                  className='plusMember'
                                  onClick={() => assignMembers(data.id)}
                                >
                                  <FontAwesomeIcon icon={faPlus} />
                                </div>
                              </div>
                            </>
                          ) : (
                            <button
                              className='btn assign'
                              onClick={() => assignMembers(data.id)}
                            >
                              Assign
                            </button>
                          )}
                        </td>
                        <td className='tableAction'>
                          <button
                            className='btn view'
                            onClick={() => spacesView(data.id)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            className='btn edit'
                            onClick={() => spacesUpdate(data.id)}
                          >
                            <img src={editPen} alt='edit' />
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
                allRequestList={spaces}
              />
            </div>

            <AddSpace show={show} setShow={setShow} handleClose={handleClose} />
            <EditSpaces
              spacesId={spacesId}
              updateShow={updateShow}
              setUpdateShow={setUpdateShow}
              handleUpdateClose={handleUpdateClose}
            />
            <AssignMember
              spaceId={spaceId}
              assignShow={assignShow}
              setAssignShow={setAssignShow}
              handleAssignClose={handleAssignClose}
            />
          </div>
        </div>
      </>
    </>
  )
}

const SortIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='11'
      height='11'
      fill='#475467'
      style={{ marginLeft: '2px' }}
      viewBox='0 0 320 512'
    >
      <path d='M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8L32 224c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z' />
    </svg>
  )
}
export default Spaces
