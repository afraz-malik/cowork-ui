import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap';
// import "./AddMember.css";
import { v4 as uuidv4 } from 'uuid';
import memberIcon from "../../Assets/Images/icon/assetsIcon.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import spaceIcon from "../../Assets/Images/icon/spaceLargeIcon.png";
import imageInput from "../../Assets/Images/icon/imgButton.svg";
import { spacesAdd } from '../../api/spaces';
import { showNotifications } from '../../CommonFunction/toaster';

interface AddSpacesProps {
    handleClose: () => void;
    show: boolean;
    setShow: (type: boolean) => void;
}


const AddSpace = ({ show, setShow, handleClose }: AddSpacesProps) => {

    const form = useRef(null);
    const { handleSubmit, register, setValue } = useForm();
    const [file, setFile] = useState("");
    const [imageKey, setImageKey] = useState("");
    const [selectedTag, setSelectedTag] = useState('');
    function handleChange(e: any) {
        setFile(URL.createObjectURL(e.target.files[0]));
        setImageKey(e.target.files[0]);
    }

  
    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setSelectedTag(eventKey);
        }
    };


    let onSubmit = () => {
        if (form.current) {
            const spaces:any = new FormData(form.current);
            spaces.append('id', uuidv4());
            spaces.append('space_image', imageKey);
            spaces.append('tag', selectedTag);
            spaces.append('active', true);
            spacesAdd(spaces).then((data) => {
                if (data.statusCode !== 201) {
                    showNotifications('error', 'Wrong information');
                }
                else {
                    showNotifications('success', 'Asset Added', spaces.name + ' added successfully');
                    // showNotifications('success', 'Assets add successfully!!');
                    setValue('name', "")
                    setValue('rate', "")
                    setValue('size', "")
                    setValue('tag', "")
                    setValue('notes', "")
                    setValue('notes', "")
                    setFile("")
                }
                setShow(false)
            })
        }
    }
    return (
        <>
            <Modal show={show} onHide={handleClose} centered size="lg">
                <ToastContainer />

                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container className='px-0'>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={memberIcon} alt="member" />
                                    <p>Asset Information</p>
                                </div>
                            </Col>
                        </Row>
                        <form ref={form} onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col md={2} className='inputFieldSidebar'>
                                    <div className="imageUpload">
                                        <div className="upload" style={{width: "inherit"}}>
                                            {file && file.length > 0 ? <img src={file} width="100px" height="100px" alt="shop" />
                                                : <img src={spaceIcon} style={{width: "100px", height: "100px"}} alt="" />
                                            }
                                            <div className="round">
                                                <input type="file" onChange={handleChange} />
                                                <img src={imageInput} alt="profile" />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={10}>
                                    <Row>
                                        <Col md={6}>
                                            <div className="memberInput">
                                                <label>Name</label>
                                                <input type="text" {...register("name", { required: true })} placeholder='Name' className='form-control' required />
                                            </div>
                                            <div className="memberInput rate">
                                                <span>$</span>
                                                <label>Rate</label>
                                                <input type="number" {...register("rate", { required: true })} placeholder='Rate' className='form-control' required />
                                                <button>USD</button>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="memberInput sizeInput">
                                                <label>Size</label>
                                                <input type="number" {...register("size", { required: true })} placeholder='Size' className='form-control' required />
                                                <button>SQFT</button>
                                            </div>
                                            <div className="memberInput">
                                                <label>Tag (Type)</label>
                                                <Dropdown onSelect={handleSelect}>
                                                    <Dropdown.Toggle variant="" className="custom-toggle">
                                                        {selectedTag === "private" ? "Private Office" : selectedTag === "dedicated" ? "Dedicated Desk" : selectedTag === "flex" ? "Flex" : "Choose tag (type)"}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item eventKey="private">Private Office</Dropdown.Item>
                                                        <Dropdown.Item eventKey="dedicated">Dedicated Desk</Dropdown.Item>
                                                        <Dropdown.Item eventKey="flex">Flex</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <button>
                                                    <FontAwesomeIcon icon={faChevronDown} />
                                                </button>
                                            </div>
                                        </Col>
                                        <Col md={12}>
                                            <div className="memberInput">
                                                <label>Notes</label>
                                                <input type="text" {...register("notes", { required: true })} placeholder='Type notes' className='form-control' required />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                                <div className="memberAddBtn">
                                    <button type='submit' className='save'>Save</button>
                                </div>
                            </Row>
                        </form>
                    </Container>
                </div>
            </Modal>
            
        </>
    )
}

export default AddSpace