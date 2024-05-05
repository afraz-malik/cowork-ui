import React, { useRef, useState, useEffect } from 'react';
import trash from "../../../Assets/Images/icon/red-trash.png";
import changeLogo from "../../../Assets/Images/icon/adminUser.png";
import uploadFile from "../../../Assets/Images/icon/uploadIcon.png";
import blankUser from "../../../Assets/Images/icon/blank-profile.jpg";
import PhoneInput from 'react-phone-input-2';
import { singleJwtMember, updateMember } from '../../../api/member';
import { isAuthenticate } from '../../../api/auth';
import { DESKIE_API as API } from '../../../config';
import { updateAdmin } from '../../../api/admin';
import { showNotifications } from '../../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface AccountProps {
    settingTab: (type: string) => void;
}

const MyAccount = ({ settingTab }: AccountProps) => {
    const navigate = useNavigate();
    const [imageLogo, setImageLogo] = useState("");
    const [logoFile, setLogoFile] = useState("");
    const [uploadedLogo, setUploadedLogo] = useState("");
    const [userImage, setUserImage] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [adminId, setAdminId] = useState("");
    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
    };
    const wrapperRef = useRef<HTMLInputElement>(null);
    function onFileLogoDrop(event: any) {
        setLogoFile(URL.createObjectURL(event.target.files[0]));
        setUploadedLogo(event.target.files[0]);
    }
    let auth = isAuthenticate();
    useEffect(() => {
        singleJwtMember(auth.token).then((data) => {
            if (data.statusCode === 200) {
                setAdminId(data.data.data.id);
                setUserImage(data.data.data.member_image);
                setFirstName(data.data.data.first_name);
                setLastName(data.data.data.last_name);
                setEmail(data.data.data.email);
                setPhoneNumber(data.data.data.phone_number);
            }
        })
    }, []);

    const adminUpdate = () => {

        let member:any = {
            "first_name": firstName,
            "last_name": lastName,
            "phone_number": phoneNumber,
            "email": email,
        }
        if (uploadedLogo) {
            member["member_image"] = uploadedLogo;
          }
        updateMember(adminId, member).then((data) => {
            showNotifications("success", data.message);
        })
    }

    const removeImage = () => {
        setLogoFile("");
        setUploadedLogo("");
        setUserImage("");
        setImageLogo("logo");
    }
  return (
    <>
       <div className='mainContent'>
                <ToastContainer />
                <div className="settingPage">
                    <div className="companyOptions">
                        <button className='activeBtn' onClick={() => settingTab('account')}>Personal Profile</button>
                        <button>Billing Settings</button>
                    </div>
                    <div className="companyProfile">
                        <div className='profileHeading'>
                            <h6>Edit Personal Profile</h6>
                            <p>Update your personal profile here.</p>
                        </div>
                        <div className='profileSave'>
                            <button className='cancel'>Cancel</button>
                            <button className='save' onClick={adminUpdate}>Save</button>
                        </div>
                    </div>
                    <div className="companyName">
                        <p>Profile Picture</p>
                        <div className='rightFileSetting'>
                            <div className="profileImageBox">
                                {imageLogo && imageLogo.length > 0 ? <img src={changeLogo} className='changeLogo' alt="change-logo" />
                                    : <>
                                        {logoFile && logoFile.length > 0 ? <img src={logoFile} className='changeLogo' alt="change-logo" />
                                            : <img src={`${API}/${userImage}`} className='changeLogo' alt="change-logo" />
                                        }
                                    </>}

                                <img src={trash} className='trash' alt="delete" onClick={removeImage} />
                            </div>
                            <div ref={wrapperRef} className="drop-file-input">
                                <div className="drop-file-input__label">
                                    <img src={uploadFile} alt="" />
                                    <p><span>Click to upload</span> or drag and drop</p>
                                </div>
                                <input type="file" onChange={onFileLogoDrop} />
                            </div>
                        </div>
                    </div>
                    <div className="contactDetails">
                        <p>Contact Details</p>
                        <div className='rightSideSetting'>
                            <div className="companyInput profileName">
                                <span>First Name</span>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='First Name' className='form-control' />
                            </div>
                            <div className="companyInput profileName">
                                <span>Last Name</span>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='Last Name' className='form-control' />
                            </div>
                            <div className="companyInput profileEmail">
                                <span>Email Address</span>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='_________@____.____' className='form-control' />
                            </div>
                            <div className="mt-2 phone phoneInput">
                                <label>Phone Number</label>
                                <PhoneInput country={'us'} value={phoneNumber} disableCountryCode={false} onChange={(value) => handlePhoneChange(value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
    </>
  )
}

export default MyAccount