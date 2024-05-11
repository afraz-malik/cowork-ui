import React, { useState, useRef,useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import "./AddMember.css";
import { memberAdd } from '../../api/member';
import { showNotifications } from '../../CommonFunction/toaster';
import { v4 as uuidv4 } from 'uuid';
import memberIcon from "../../Assets/Images/icon/member.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import imageInput from "../../Assets/Images/icon/imgButton.png";
import PhoneInput from 'react-phone-input-2';
import memberAvatar from "../../Assets/Images/icon/memberLargeIcon.png";
import { singleProfile } from '../../api/settings';
import { DESKIE_API as API } from '../../config';

interface AddMemberProps {
    handleClose: () => void;
    show: boolean;
    setShow: (type: boolean) => void;
}

const AddMember = ({ show, setShow, handleClose }: AddMemberProps) => {
    const [file, setFile] = useState("");
    const [imageKey, setImageKey] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [businessNumber, setBusinessNumber] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [lightLogoImage, setLightLogoImage] = useState("");
    const [darkLogoImage, setDarkLogoImage] = useState("");
    const [address, setAddress] = useState("");

    function handleChange(e: any) {
        setFile(URL.createObjectURL(e.target.files[0]));
        setImageKey(e.target.files[0]);
    }
    const form = useRef(null);
    const { handleSubmit, register, setValue } = useForm();
    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
    };
    const handleBusinessChange= (value: string) => {
        setBusinessNumber(value);
    };
    useEffect(() => {
        singleProfile().then((data) => {
            if (data.statusCode === 200) {
                setCompanyName(data.data.company_name);
                setLightLogoImage(data.data.company_logo_light);
                setDarkLogoImage(data.data.company_logo_dark);
                setAddress(data.data.address);
            }
        })
    }, []);
    let onSubmit = () => {
        if (form.current) {
            const member:any = new FormData(form.current);
            member.append('id', uuidv4());
            member.append('member_image', imageKey);
            member.append('phoneNumber', phoneNumber);
            member.append('businessPhone', businessNumber); 
            member.append('companyName', companyName);
            member.append('darkLogo', darkLogoImage);
            member.append('address', address);
            member.append('logoImage', `${API}/${encodeURIComponent(darkLogoImage)}`);
            member.append('active', true);

            memberAdd(member).then((data) => {
                if (data.statusCode !== 201) {
                    showNotifications('error', data.message);
                }
                else {
                    showNotifications('success', 'Member add and email send successfully');
                    setValue('firstName', "")
                    setValue('firstName', "")
                    setValue('lastName', "")
                    setValue('phoneNumber', "")
                    setValue('email', "")
                    setValue('businessName', "")
                    setValue('businessPhone', "")
                    setValue('businessEmail', "")
                    setValue('notes', "")
                    setFile("");
                    setShow(false)
                }
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
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={memberIcon} alt="member" />
                                    <p>Add Member</p>
                                </div>
                            </Col>
                        </Row>
                        <form ref={form} onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col md={2} className='inputFieldSidebar'>
                                    <div className="imageUpload">
                                        <div className="upload">
                                            {file && file.length > 0 ? <img src={file}  style={{ borderRadius: "50%", objectFit: "cover" }} width="100px" height="100px" alt="shop" />
                                                : <img src={memberAvatar} alt="" />
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
                                        <Col md={12}>
                                            <div className="inputHeading">
                                                <p>Personal</p>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="memberInput">
                                                <label>First Name</label>
                                                <input type="text" {...register("firstName", { required: true })} placeholder='First Name' className='form-control' required />
                                            </div>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <div className="memberInput">
                                                <label>Last Name</label>
                                                <input type="text" {...register("lastName", { required: true })} placeholder='Last Name' className='form-control' required />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="numberInput">
                                                <label>Phone Number</label>
                                                <PhoneInput country={'us'} disableCountryCode={false} onChange={(value) => handlePhoneChange(value)}  />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="memberInput">
                                                <label>Email</label>
                                                <input type="email" {...register("email", { required: true })} placeholder='Email' className='form-control' required />
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
                                                <input type="text" {...register("businessName", { required: true })} placeholder='Business Name' className='form-control' required />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="numberInput">
                                                <label>Business Phone</label>
                                                <PhoneInput country={'us'} disableCountryCode={false} onChange={(value) => handleBusinessChange(value)}  />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="memberInput">
                                                <label>Business Email</label>
                                                <input type="email" {...register("businessEmail", { required: true })} placeholder='Business Email' className='form-control' required />
                                            </div>
                                        </Col>
                                       
                                        <Col md={6}>
                                            <div className="memberInput">
                                                <label>Notes</label>
                                                <input type="text" {...register("notes", { required: false })} placeholder='Notes' className='form-control' />
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

export default AddMember