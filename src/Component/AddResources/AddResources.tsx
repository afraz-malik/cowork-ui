import React, { useState, useRef } from 'react'
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'
import resourceIcon from '../../Assets/Images/icon/resourceIcon.svg'
import changeLogo from '../../Assets/Images/icon/adminUser.png'
import { DESKIE_API as API } from '../../config'
import memberIcon from '../../Assets/Images/icon/addresources.svg'
import uploadIcon from '../../Assets/Images/icon/delete_svg.svg'
import deleteIcon from '../../Assets/Images/icon/upload_svg.svg'
import './AddResources.css'
import { v4 as uuidv4 } from 'uuid'
import { resourceAdd } from '../../api/resource'
import { showNotifications } from '../../CommonFunction/toaster'

interface AddResourcesProps {
  handleClose: () => void
  show: boolean
  setShow: (type: boolean) => void
}

const AddResources = ({ show, setShow, handleClose }: AddResourcesProps) => {
  const [imageLogo, setImageLogo] = useState('')
  const [logoFile, setLogoFile] = useState('')
  const [uploadedLogo, setUploadedLogo] = useState('')
  const [userImage, setUserImage] = useState('')
  const [name, setName] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedCapacity, setSelectedCapacity] = useState('')
  const [memberTime, setMemberTime] = useState('')
  const [memberRate, setMemberRate] = useState('')
  const [publicTime, setPublicTime] = useState('')
  const [publicRate, setPublicRate] = useState('')
  const [authValue, setAuthValue] = useState(false)
  const [publicValue, setPublicValue] = useState(false)

  const authClick = () => {
    setAuthValue(!authValue)
  }

  const publicClick = () => {
    setPublicValue(!publicValue)
  }

  const wrapperRef = useRef<HTMLInputElement>(null)
  function onFileLogoDrop(event: any) {
    setLogoFile(URL.createObjectURL(event.target.files[0]))
    setUploadedLogo(event.target.files[0])
  }
  const removeImage = () => {
    setLogoFile('')
    setUploadedLogo('')
    setUserImage('')
    setImageLogo('')
  }

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedType(eventKey)
    }
  }

  const handleCapacitySelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedCapacity(eventKey)
    }
  }

  const handleMemberSelect = (eventKey: string | null) => {
    if (eventKey) {
      setMemberTime(eventKey)
    }
  }
  const handlePublicSelect = (eventKey: string | null) => {
    if (eventKey) {
      setPublicTime(eventKey)
    }
  }

  const resourceCreate = () => {
    let resourceInfo = {
      id: uuidv4(),
      name: name,
      resource_image: uploadedLogo,
      type: selectedType,
      capacity: selectedCapacity,
      member_rate: memberRate,
      member_time: memberTime,
      public_rate: publicRate,
      public_time: publicTime,
    }
    resourceAdd(resourceInfo).then((data) => {
      setShow(false)
      showNotifications(
        'success',
        'Resource Added',
        name + ' added successfully'
      )
    })
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size='xl'
        id='addResource'
      >
        <div className='addMemberForm'>
          <button className='closeModal' onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Container>
            <Row>
              <Col md={12}>
                <div className='addMemberHeading'>
                  <img src={resourceIcon} alt='member' />
                  <p>Add Resource</p>
                </div>
              </Col>
              <Col md={12}>
                <div className='resourceBox'>
                  <div className='profileImageUpload'>
                    <div className='profileTitle'>
                      <p>Resource Photo</p>
                    </div>
                    <div className='profileImgView d-flex justify-content-center'>
                      {imageLogo && imageLogo.length > 0 ? (
                        <img
                          src={changeLogo}
                          className='changeLogo'
                          alt='change-logo'
                        />
                      ) : (
                        <>
                          {logoFile && logoFile.length > 0 ? (
                            <img
                              src={logoFile}
                              className='changeLogo'
                              alt='change-logo'
                            />
                          ) : userImage.length ? (
                            <img
                              src={`${API}/${userImage}`}
                              className='changeLogo'
                              alt='change-logo'
                            />
                          ) : (
                            <img
                              src={memberIcon}
                              className='changeLogo'
                              alt='change-logo'
                            />
                          )}
                        </>
                      )}
                    </div>
                    <div className='profileFooter'>
                      <div ref={wrapperRef} className='drop-file-input'>
                        <div className='drop-file-input__label'>
                          <img
                            src={uploadIcon}
                            className='uploadIcon'
                            alt='delete'
                            onClick={removeImage}
                          />
                        </div>
                        <input type='file' onChange={onFileLogoDrop} />
                      </div>

                      <img
                        src={deleteIcon}
                        className='uploadIcon'
                        alt='delete'
                        onClick={removeImage}
                      />
                    </div>
                  </div>

                  <div className='resourceAdd'>
                    <div className='inputField resourceName'>
                      <span>Name</span>
                      <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Enter your name'
                        className='form-control'
                      />
                    </div>
                    <div className='typeCapacity mt-3'>
                      <div className='dropdownInput'>
                        <div className='dropdownField'>
                          <span>Type</span>
                          <Dropdown onSelect={handleSelect}>
                            <Dropdown.Toggle
                              variant=''
                              className='custom-toggle'
                            >
                              {selectedType === 'meeting' ? (
                                'Meeting Space'
                              ) : selectedType === 'equipment' ? (
                                'Equipment'
                              ) : selectedType === 'workspace' ? (
                                'Workspace'
                              ) : selectedType === 'other' ? (
                                'Other'
                              ) : (
                                <div className='noneSelect'>
                                  Choose tag (type)
                                </div>
                              )}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='w-100'>
                              <Dropdown.Item eventKey='meeting'>
                                Meeting Space
                              </Dropdown.Item>
                              <Dropdown.Item eventKey='equipment'>
                                Equipment
                              </Dropdown.Item>
                              <Dropdown.Item eventKey='workspace'>
                                Workspace
                              </Dropdown.Item>
                              <Dropdown.Item eventKey='other'>
                                Other
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                          <div className='inputSvg'>
                            <FontAwesomeIcon icon={faSortDown} />
                          </div>
                        </div>
                      </div>
                      <div className='dropdownInput'>
                        <div className='dropdownField'>
                          <span>Capacity</span>
                          <Dropdown onSelect={handleCapacitySelect}>
                            <Dropdown.Toggle
                              variant=''
                              className='custom-toggle'
                            >
                              {selectedCapacity}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='w-100'>
                              {[...Array(10)].map((_, index) => (
                                <Dropdown.Item
                                  key={index + 1}
                                  eventKey={index + 1}
                                >
                                  {index + 1}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                          <div className='inputSvg'>
                            <FontAwesomeIcon icon={faSortDown} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='rateChoose my-3'>
                      <div className='generateInvoice my-0'>
                        <h5 className='mb-0'>Allow member bookings?</h5>
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
                              <input type='checkbox' onClick={authClick} />
                              <span className='slider round'></span>
                            </label>
                          )}
                        </div>
                      </div>
                      {authValue === true ? (
                        <div className='dropdownInput mt-4'>
                          <div className='dropdownRate mt-3'>
                            <span className='h-100 py-2'>Rate</span>
                            <div className='rateNumber'>
                              $
                              <input
                                className='form-control'
                                onChange={(e) => setMemberRate(e.target.value)}
                                type='number'
                              />
                            </div>

                            <div className='rateOption h-100 py-1'>
                              <Dropdown onSelect={handleMemberSelect}>
                                <Dropdown.Toggle
                                  variant=''
                                  className='custom-toggle'
                                >
                                  {memberTime === 'hour'
                                    ? 'Per Hour'
                                    : memberTime === 'day'
                                      ? 'Per Day'
                                      : 'Choose time'}{' '}
                                  <FontAwesomeIcon icon={faSortDown} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item eventKey='hour'>
                                    Per Hour
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey='day'>
                                    Per Day
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>

                    <div className='rateChoose'>
                      <div className='generateInvoice my-0'>
                        <h5 className='mb-0'>Allow public bookings?</h5>
                        <div className='authToggle mt-0'>
                          {publicValue === true ? (
                            <label className='switch'>
                              <input
                                type='checkbox'
                                onClick={publicClick}
                                defaultChecked
                              />
                              <span className='slider round'></span>
                            </label>
                          ) : (
                            <label className='switch'>
                              <input type='checkbox' onClick={publicClick} />
                              <span className='slider round'></span>
                            </label>
                          )}
                        </div>
                      </div>
                      {publicValue === true ? (
                        <div className='dropdownInput mt-4'>
                          <div className='dropdownRate mt-3'>
                            <span className='h-100 py-2'>Rate</span>
                            <div className='rateNumber'>
                              $
                              <input
                                className='form-control'
                                onChange={(e) => setPublicRate(e.target.value)}
                                type='number'
                              />
                            </div>

                            <div className='rateOption h-100 py-1'>
                              <Dropdown onSelect={handlePublicSelect}>
                                <Dropdown.Toggle
                                  variant=''
                                  className='custom-toggle'
                                >
                                  {publicTime === 'hour'
                                    ? 'Per Hour'
                                    : publicTime === 'day'
                                      ? 'Per Day'
                                      : 'Choose time'}{' '}
                                  <FontAwesomeIcon icon={faSortDown} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item eventKey='hour'>
                                    Per Hour
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey='day'>
                                    Per Day
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>

                    <div className='resourceBtn'>
                      <button onClick={resourceCreate}>Save</button>
                    </div>
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

export default AddResources
