import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { singleSpaces } from '../../api/spaces'
import { DESKIE_API as API } from '../../config'
import penIcon from '../../Assets/Images/icon/pencil-01.svg'
import spaceIcon from '../../Assets/Images/icon/spaceAvatar.png'
import Layout from '../Layout/Layout'
import { Link, useParams } from 'react-router-dom'
import EditSpaces from './EditSpaces'

const ViewSpaces = () => {
  const { id } = useParams()
  const [spacesDetails, setSpacesDetails] = useState<any>({})
  const [spacesId, setSpacesId] = useState('')
  const [updateShow, setUpdateShow] = useState(false)
  const handleUpdateClose = () => setUpdateShow(false)

  useEffect(() => {
    if (id) {
      singleSpaces(id).then((data) => {
        setSpacesDetails(data.data && data.data)
      })
    }
  }, [])

  const spacesUpdate = (spacesId: string) => {
    setSpacesId(spacesId)
    setUpdateShow(true)
  }

  return (
    <>
      <div className='mainContent'>
        <div className='invoiceHeading'>
          <nav aria-label='breadcrumb'>
            <ol className='breadcrumb m-0 ms-2'>
              <li className='breadcrumb-item'>
                <Link to='/assets'>Assets</Link>
              </li>
              <li className='breadcrumb-item active' aria-current='page'>
                {spacesDetails.name}
              </li>
            </ol>
          </nav>
        </div>
        <div className='spacesDetailsBox'>
          <div className='topLine'>
            <div className='memberName'>
              <Link to='/assets' className='backDashboard'>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <h6> {spacesDetails.name}</h6>
            </div>
            <div className='editBtn'>
              <button
                style={{ padding: '8px 16px' }}
                onClick={() => spacesUpdate(spacesDetails.id)}
              >
                <img src={penIcon} alt='edit' /> Edit Asset
              </button>
            </div>
          </div>
          <div className='spacesInfo'>
            <div className='rightSpacesContent'>
              <div className='resourceInfo'>
                <div className='resourceMiniBox'>
                  <div className='resourceName'>
                    <h6 className='mb-3'>Name</h6>
                    <p className='mb-0'>{spacesDetails.name}</p>
                  </div>
                  <div className='resourceName' style={{ borderRight: 'none' }}>
                    <h6 className='mb-3'>Size</h6>
                    <p className='mb-0'>{spacesDetails.size}sqft</p>
                  </div>
                </div>
                <div className='resourceMiniBox'>
                  <div className='resourceRate'>
                    <h6 className='mb-3'>
                      Rate <span style={{ fontWeight: '400' }}>(Members)</span>
                    </h6>
                    <p className='mb-0'>${spacesDetails.rate} / mo</p>
                  </div>
                  <div
                    className='resourceName border-bottom-0'
                    style={{ borderRight: 'none', borderLeft: 'none' }}
                  >
                    <h6 className='mb-3'>Type</h6>
                    <span className='deskType'>
                      {spacesDetails.tag === 'private' ? (
                        <span className='private'>Private Office</span>
                      ) : (
                        ''
                      )}
                      {spacesDetails.tag === 'dedicated' ? (
                        <span className='dedicated'>Dedicated Desk</span>
                      ) : (
                        ''
                      )}
                      {spacesDetails.tag === 'flex' ? (
                        <span className='flex'>Flex</span>
                      ) : (
                        ''
                      )}
                    </span>
                  </div>
                </div>
                <div className='assignments resourceMiniBox'>
                  <div className='resourceRate'>
                    <h6 className='mb-3'>Active Assignments</h6>
                  </div>
                </div>
              </div>
              <div className='spacesDescription mt-4'>
                <div className='spacesNotes'>
                  <h6 className='mb-3'>Notes</h6>
                  <p className='mb-0'>{spacesDetails.notes}</p>
                </div>
              </div>

              {/* <div className="spacesHeadingBox">
                                    <h6>{spacesDetails.name}
                                        <span className='deskType'>
                                            {spacesDetails.tag === "private" ? <span className='private'>Private Office</span> : ""}
                                            {spacesDetails.tag === "dedicated" ? <span className='dedicated'>Dedicated Desk</span> : ""}
                                            {spacesDetails.tag === "flex" ? <span className='flex'>Flex</span> : ""}
                                        </span>
                                    </h6>
                                    <h6>${spacesDetails.rate}</h6>
                                </div>
                                <div className="spacesDescription">
                                    <div className='spacesMiddle'>
                                        <div className="spacesSize">
                                            <h6>Size</h6>
                                            <p>{spacesDetails.size}</p>
                                        </div>
                                        <div className="spacesType" style={{ borderLeft: '1px solid rgba(234, 236, 240, 1)' }}>
                                            <h6>Type</h6>
                                            <span className='deskType'>
                                                {spacesDetails.tag === "private" ? <span className='private'>Private Office</span> : ""}
                                                {spacesDetails.tag === "dedicated" ? <span className='dedicated'>Dedicated Desk</span> : ""}
                                                {spacesDetails.tag === "flex" ? <span className='flex'>Flex</span> : ""}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="spacesNotes">
                                        <h6>Notes</h6>
                                        <p>{spacesDetails.notes}</p>
                                    </div>
                                </div> */}
            </div>
            <div className='leftSpacesImage'>
              {spacesDetails.space_image ? (
                <img
                  src={`${API}/${spacesDetails.space_image}`}
                  alt='avatar'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img src={spaceIcon} width='100px' height='100px' alt='shop' />
              )}
            </div>
          </div>
        </div>
      </div>
      <EditSpaces
        spacesId={spacesId}
        updateShow={updateShow}
        setUpdateShow={setUpdateShow}
        handleUpdateClose={handleUpdateClose}
      />
    </>
  )
}

export default ViewSpaces
