import React, { useRef, useState, useEffect } from 'react';
import "./Settings.css";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import trash from "../../Assets/Images/icon/red-trash.png";
import changeLogo from "../../Assets/Images/logo/changeLogo.png";
import changeBackground from "../../Assets/Images/background/changeBackground.png";
import uploadFile from "../../Assets/Images/icon/uploadIcon.png";
import { profileAdd, singleProfile, updateProfile } from '../../api/settings';
import { v4 as uuidv4 } from 'uuid';
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { DESKIE_API as API } from '../../config';

interface ProfileProps {
    settingTab: (type: string) => void;
}


const Profile = ({ settingTab }: ProfileProps) => {


    const [logoFile, setLogoFile] = useState("");
    const [backFile, setBackFile] = useState("");
    const [uploadedLogo, setUploadedLogo] = useState("");
    const [uploadedBack, setUploadedBack] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [backgroundImage, setBackgroundImage] = useState("");
    const [logoImage, setLogoImage] = useState("");
    
    const wrapperRef = useRef<HTMLInputElement>(null);
    function onFileLogoDrop(event: any) {
        setLogoFile(URL.createObjectURL(event.target.files[0]));
        setUploadedLogo(event.target.files[0]);
    }
    function onFileBackgroundDrop(event: any) {
        setBackFile(URL.createObjectURL(event.target.files[0]));
        setUploadedBack(event.target.files[0]);
    }

    const saveProfile = () => {
        let profile = {
            "id": uuidv4(),
            "companyName": companyName,
            "companyLogo": uploadedLogo,
            "background": uploadedBack,
            "companyEmail": email,
            "companyLinkedin": linkedin,
            "companyPhone": phoneNumber,
            "companyFacebook": facebook,
            "companyInstagram": instagram,
        }
        profileAdd(profile).then((data) => {
            console.log('profile', data);
        });
    }


    useEffect(() => {
        singleProfile().then((data) => {
            console.log('profile',data);
            
            if (data.statusCode !== 200) {

            }
            else {
                setCompanyId(data.data.id);
                setCompanyName(data.data.company_name);
                setEmail(data.data.company_email);
                setPhone(data.data.company_phone);
                setFacebook(data.data.company_facebook);
                setInstagram(data.data.company_instagram);
                setLinkedin(data.data.company_linkedin);
                setBackgroundImage(data.data.background);
                setLogoImage(data.data.company_logo);
                setPhoneNumber(data.data.company_phone);
            }
        })
    }, []);

    const editProfile = () => {
        let profile: any = {
            "company_name": companyName,
            "company_email": email,
            "company_linkedin": linkedin,
            "company_phone": phoneNumber,
            "company_facebook": facebook,
            "company_instagram": instagram,
        }
        if (uploadedLogo) {
            profile.companyLogo = uploadedLogo;
        }
        // If uploadedBack exists, add it to the profile object
        if (uploadedBack) {
            profile.background = uploadedBack;
        }
        updateProfile(companyId, profile).then((data) => {
            showNotifications('success', "Company Profile Update Successfully !!");
        });
    }

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
    };

    return (
        <>
            <ToastContainer />
            <div className='mainContent'>
                <div className="settingPage">
                    <div className="companyOptions">
                    <button onClick={() => settingTab('account')}>Personal Profile</button>
                        <button className='activeBtn' onClick={() => settingTab('profile')}>Company Profile</button>
                        <button onClick={() => settingTab('finance')}>Finances</button>
                        <button onClick={() => settingTab('users')}>Users</button>
                        <button onClick={() => settingTab('custom')}>Customization</button>
                    </div>
                    <div className="companyProfile">
                        <div className='profileHeading'>
                            <h6>Company Profile</h6>
                            <p>Update your company’s info here.</p>
                        </div>
                        <div className='profileSave'>
                            <button className='cancel'>Cancel</button>
                            {companyId ? <button className='save' onClick={editProfile}>Save</button>
                                : <button className='save' onClick={saveProfile}>Save</button>}

                        </div>
                    </div>
                    <div className="companyName">
                        <p>Company Name</p>
                        <div className='rightSideSetting'>
                            <div className="memberInput">
                                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder='First Name' className='form-control' required />
                            </div>
                        </div>
                    </div>
                    <div className="companyName">
                        <p>Company Logo</p>
                        <div className='rightFileSetting'>
                            <div className="logoImageBox">
                                {logoFile && logoFile.length > 0 ? <img src={logoFile} className='changeLogo' alt="change-logo" />
                                    : <img src={`${API}/${logoImage}`} className='changeLogo' alt="change-logo" />
                                }
                                <img src={trash} alt="delete" /> 
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
                    <div className="companyName">
                        <p>Background Image</p>
                        <div className='rightFileSetting'>
                            <div className="backgroundImageBox">
                                {backFile && backFile.length > 0 ? <img src={backFile} className='changeBack' alt="change-logo" />
                                    : <img src={`${API}/${backgroundImage}`} className='changeBack' alt="change-logo" />
                                }
                                <img src={trash} alt="delete" />
                            </div>
                            <div ref={wrapperRef} className="drop-file-input">
                                <div className="drop-file-input__label">
                                    <img src={uploadFile} alt="" />
                                    <p><span>Click to upload</span> or drag and drop</p>
                                </div>
                                <input type="file" onChange={onFileBackgroundDrop} />
                            </div>
                        </div>
                    </div>
                    <div className="contactDetails">
                        <p>Company Name</p>
                        <div className='rightSideSetting'>
                            <div className="companyInput email">
                                <span>Email</span>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='_________@____.____' className='form-control' />
                            </div>
                            <div className="mt-2 phone phoneInput">
                                <label>Phone Number</label>
                                <PhoneInput country={'us'} value={phoneNumber} disableCountryCode={false} onChange={(value) => handlePhoneChange(value)}  />
                                {/* <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Enter phone number' className='form-control' /> */}
                            </div>
                        </div>
                    </div>
                    <div className="socialProfile">
                        <p>Social Profiles</p>
                        <div className='rightSideSetting'>
                            <div className="companyInput facebook">
                                <span>www.facebook.com/</span>
                                <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder='Enter Facebook username' className='form-control' />
                            </div>
                            <div className="companyInput mt-2 instagram">
                                <span>www.instagram.com/</span>
                                <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder='Enter Instagram username' className='form-control' />
                            </div>
                            <div className="companyInput mt-2 linkedin">
                                <span>www.linkedin.com/company/</span>
                                <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder='Enter Linkedin username' className='form-control' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile