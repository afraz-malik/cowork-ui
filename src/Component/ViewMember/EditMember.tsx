import React, { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import memberIcon from "../../Assets/Images/icon/member.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { singleMember, updateMember } from '../../api/member';
import { DESKIE_API as API } from '../../config';
import imageInput from "../../Assets/Images/icon/imgButton.png";
import PhoneInput from 'react-phone-input-2';
import memberBlank from "../../Assets/Images/icon/memberLargeIcon.png";


interface EditMemberProps {
    memberId: string;
    handleUpdateClose: () => void;
    updateShow: boolean;
    setUpdateShow: (type: boolean) => void;
}


const EditMember = ({ memberId, updateShow, setUpdateShow, handleUpdateClose }: EditMemberProps) => {
    const [file, setFile] = useState("");
    const [imageKey, setImageKey] = useState("");
    // const [memberInfo, setMemberInfo] = useState({});

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [businessEmail, setBusinessEmail] = useState("");
    const [businessPhone, setBusinessPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [memberImage, setMemberImage] = useState("");

    function handleChange(e: any) {
        setFile(URL.createObjectURL(e.target.files[0]));
        setImageKey(e.target.files[0]);
    }


    useEffect(() => {
        singleMember(memberId).then((data) => {
            setFirstName(data.data && data.data.first_name);
            setLastName(data.data && data.data.last_name);
            setPhoneNumber(data.data && data.data.phone_number);
            setEmail(data.data && data.data.email);
            setBusinessName(data.data && data.data.business_name);
            setBusinessEmail(data.data && data.data.business_email);
            setBusinessPhone(data.data && data.data.business_phone);
            setNotes(data.data && data.data.notes);
            setMemberImage(data.data && data.data.member_image);
        })
    }, [memberId]);

    // update member info
    const memberUpdate = () => {
        let member:any = {
            "first_name": firstName,
            "last_name": lastName,
            "phone_number": phoneNumber,
            "email": email,
            "business_name": businessName,
            "business_phone": businessPhone,
            "business_email": businessEmail,
            "notes": notes
        }
        if (imageKey) {
            member["member_image"] = imageKey;
          }
        updateMember(memberId, member).then((data) => {
            setUpdateShow(false);
        })
    }

     // hide member info
     const memberHide = () => {
        let member:any = {
            "active": false,
        }
        updateMember(memberId, member).then((data) => {
            setUpdateShow(false);
        })
    }

    return (
        <>
            <Modal show={updateShow} onHide={handleUpdateClose} centered size="lg">
                <ToastContainer />

                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleUpdateClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={memberIcon} alt="member" />
                                    <p>Update Information</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2} className='inputFieldSidebar'>
                                <div className="imageUpload">
                                    <div className="upload">

                                        {file && file.length > 0 ? <img src={file} width="100px" height="100px" alt="shop" />
                                            : <>
                                            {memberImage ? <div style={{ width: "80px", height: "80px", overflow: "hidden", borderRadius: "50%" }}>
                                            <img src={`${API}/${memberImage}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                            :  <img src={memberBlank} width="100px" height="100px" alt="shop" />}
                                            </>
                                        }
                                        <div className="round">
                                            <input type="file" onChange={handleChange} required />
                                            <img src={imageInput} alt="profile" />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={10}>
                                <Row>
                                    <Col md={12}>
                                        <div className="inputHeading">
                                            <p>Personal</p>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="memberInput">
                                            <label>First Name</label>
                                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='First Name' className='form-control' />
                                        </div>
                                        <div className="numberInput">
                                            <label>Phone Number</label>
                                            <PhoneInput country={'us'} disableCountryCode={false} value={phoneNumber} onChange={(value) => setPhoneNumber(value)} />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="memberInput">
                                            <label>Last Name</label>
                                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='Last Name' className='form-control' />
                                        </div>
                                        <div className="memberInput">
                                            <label>Email</label>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className='form-control' />
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <div className="inputHeading mt-4">
                                            <p>Business</p>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="memberInput">
                                            <label>Business Name</label>
                                            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder='Business Name' className='form-control' />
                                        </div>
                                        <div className="memberInput">
                                            <label>Business Email</label>
                                            <input type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder='Business Email' className='form-control' />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="numberInput">
                                            <label>Business Phone</label>
                                            <PhoneInput country={'us'} disableCountryCode={false} value={businessPhone} onChange={(value) => setBusinessPhone(value)} />
                                        </div>
                                        <div className="memberInput">
                                            <label>Notes</label>
                                            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder='Notes' className='form-control' />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                            <div className="memberAddBtn">
                            <button type='submit' className='mr-2 deleteSpaces' onClick={memberHide}>Delete</button>
                                <button type='submit' className='save' onClick={memberUpdate}>Update</button>
                            </div>
                        </Row>
                    </Container>
                </div>
            </Modal>
        </>
    )
}

export default EditMember