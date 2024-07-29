import React from 'react'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import trash from '../../Assets/Images/icon/trash-02.svg'

import './DeleteModal.css'

interface AddMemberProps {
  handleDeleteClose: () => void
  deleteShow: boolean
  disabledModal?: boolean
  deleteApi: () => void
}

const DeleteModal = ({
  deleteShow,
  disabledModal,
  handleDeleteClose,
  deleteApi,
}: AddMemberProps) => {
  return (
    <>
      <Modal
        show={deleteShow}
        id='delete-confirm'
        onHide={handleDeleteClose}
        centered
        size='lg'
      >
        <div className='addMemberForm'>
          <button className='closeModal' onClick={handleDeleteClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Container>
            <Row>
              <Col md={12}>
                <div className='deleteIcon'>
                  <img src={trash} alt='trash' />
                  <h4 className='modal-title w-100'>
                    {`Are you sure you want to ${
                      disabledModal
                        ? 'disable the member?'
                        : 'delete this file?'
                    } `}
                  </h4>
                  <p>{`${
                    disabledModal ? 'Disabled member' : 'Deleted files'
                  } cannot be recovered!`}</p>
                  <div className='deleteBtn'>
                    <button className='cancel' onClick={handleDeleteClose}>
                      Cancel
                    </button>
                    <button className='delete' onClick={deleteApi}>
                      Yes, {`${disabledModal ? 'Disabled' : 'Delete'}`}
                    </button>
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

export default DeleteModal
