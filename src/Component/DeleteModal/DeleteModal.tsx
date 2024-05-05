import React from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import "./DeleteModal.css"
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

interface AddMemberProps {
    handleDeleteClose: () => void;
    deleteShow: boolean;
    deleteApi: () => void;
}

const DeleteModal = ({ deleteShow, handleDeleteClose,deleteApi }: AddMemberProps) => {
    return (
        <>
            <Modal show={deleteShow} onHide={handleDeleteClose} centered size="lg">
                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleDeleteClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className="deleteIcon">
                                    <FontAwesomeIcon icon={faTrashCan} />
                                    <h4 className="modal-title w-100">Are you sure?</h4>
                                    <p>Do you really want to delete these records? <br/> This process cannot be undone.</p>
                                    <div className='deleteBtn'>
                                        <button className='cancel' onClick={handleDeleteClose}>Cancel</button>
                                        <button className='delete' onClick={deleteApi}>Delete</button>
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