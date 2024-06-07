import React, { useRef, useState, useEffect } from 'react';
import "./Settings.css";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import trash from "../../Assets/Images/icon/trash-02 (1).svg";
import iconLogo from "../../Assets/Images/logo/Vector.png";
import trashLight from "../../Assets/Images/icon/trash-03.png";
import uploadFile from "../../Assets/Images/icon/uploadIcon.svg";
import { profileAdd, singleProfile, updateProfile } from '../../api/settings';
import { v4 as uuidv4 } from 'uuid';
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { DESKIE_API as API } from '../../config';

interface ProfileProps {
    settingTab: (type: string) => void;
}


const Profile = ({ settingTab }: ProfileProps) => {


 
    const [lightLogoFile, setLightLogoFile] = useState("");
    const [darkLogoFile, setDarkLogoFile] = useState("");
    const [lightIconFile, setLightIconFile] = useState("");
    const [darkIconFile, setDarkIconFile] = useState("");
    const [lightLogo, setLightLogo] = useState("");
    const [darkLogo, setDarkLogo] = useState("");
    const [lightIcon, setLightIcon] = useState("");
    const [darkIcon, setDarkIcon] = useState("");
    const [backFile, setBackFile] = useState("");
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
    const [lightLogoImage, setLightLogoImage] = useState("");
    const [darkLogoImage, setDarkLogoImage] = useState("");
    const [lightIconImage, setLightIconImage] = useState("");
    const [darkIconImage, setDarkIconImage] = useState("");


    const [address, setAddress] = useState("");


    const wrapperRef = useRef<HTMLInputElement>(null);

    function onFileLogoLight(event: any) {
        setLightLogoFile(URL.createObjectURL(event.target.files[0]));
        setLightLogo(event.target.files[0]);
    }
    function onFileLogoDark(event: any) {
        setDarkLogoFile(URL.createObjectURL(event.target.files[0]));
        setDarkLogo(event.target.files[0]);
    }
    function onFileIconLight(event: any) {
        setLightIconFile(URL.createObjectURL(event.target.files[0]));
        setLightIcon(event.target.files[0]);
    }
    function onFileIconDark(event: any) {
        setDarkIconFile(URL.createObjectURL(event.target.files[0]));
        setDarkIcon(event.target.files[0]);
    }


    function onFileBackgroundDrop(event: any) {
        setBackFile(URL.createObjectURL(event.target.files[0]));
        setUploadedBack(event.target.files[0]);
    }

    const saveProfile = () => {
        let profile = {
            "id": uuidv4(),
            "companyName": companyName,
            "companyLightLogo": lightLogo,
            "companyDarkLogo": darkLogo,
            "companyLightIcon": lightIcon,
            "companyDarkIcon": darkIcon,
            "background": uploadedBack,
            "companyEmail": email,
            "companyLinkedin": linkedin,
            "companyPhone": phoneNumber,
            "companyFacebook": facebook,
            "companyInstagram": instagram,
            "address": address
        }
        profileAdd(profile).then((data) => {
            console.log('profile', data);
        });
    }


    useEffect(() => {
        singleProfile().then((data) => {
            if (data.statusCode === 200) {
                setCompanyId(data.data.id);
                setCompanyName(data.data.company_name);
                setEmail(data.data.company_email);
                setPhone(data.data.company_phone);
                setFacebook(data.data.company_facebook);
                setInstagram(data.data.company_instagram);
                setLinkedin(data.data.company_linkedin);
                setBackgroundImage(data.data.background);
                setPhoneNumber(data.data.company_phone);
                setAddress(data.data.address);
                setLightLogoImage(data.data.company_logo_light);
                setDarkLogoImage(data.data.company_logo_dark);
                setLightIconImage(data.data.company_icon_light);
                setDarkIconImage(data.data.company_icon_dark);
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
            "address": address
        }
        if (lightLogo) {
            profile.companyLightLogo = lightLogo;
        }
        if (darkLogo) {
            profile.companyDarkLogo = darkLogo;
        }
        if (lightIcon) {
            profile.companyLightIcon = lightIcon;
        }
        if (darkIcon) {
            profile.companyDarkIcon = darkIcon;
        }
        // If uploadedBack exists, add it to the profile object
        if (uploadedBack) {
            profile.background = uploadedBack;
        }
        updateProfile(companyId, profile).then((data) => {
            showNotifications('success', "Company Profile Update Successfully !!");
            window.location.reload();
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
                        <p>Company Logo (Light)</p>
                        <div className='rightFileSetting'>
                            <div className="logoImageBox liteIcon">
                                {lightLogoFile && lightLogoFile.length > 0 ? <img src={lightLogoFile} className='changeLogo' alt="change-logo" />
                                    : <img src={`${API}/${lightLogoImage}`} className='changeLogo' alt="change-logo" />
                                }
                                <img src={trash} alt="delete" /> 
                            </div>
                            <div ref={wrapperRef} className="drop-file-input">
                                <div className="drop-file-input__label">
                                    <img src={uploadFile} alt="" />
                                    <p><span>Click to upload</span> or drag and drop</p>
                                </div>
                                <input type="file" onChange={onFileLogoLight} />
                            </div>
                        </div>
                    </div>
                    <div className="companyName">
                        <p>Company Logo (Dark)</p>
                        <div className='rightFileSetting'>
                            <div className="logoImageBox darkIcon">
                                {darkLogoFile && darkLogoFile.length > 0 ? <img src={darkLogoFile} className='changeLogo' alt="change-logo" />
                                    : <img src={`${API}/${darkLogoImage}`} className='changeLogo' alt="change-logo" />
                                }
                                <img src={trashLight} alt="delete" /> 
                            </div>
                            <div ref={wrapperRef} className="drop-file-input">
                                <div className="drop-file-input__label">
                                    <img src={uploadFile} alt="" />
                                    <p><span>Click to upload</span> or drag and drop</p>
                                </div>
                                <input type="file" onChange={onFileLogoDark} />
                            </div>
                        </div>
                    </div>
                    <div className="companyName">
                        <p>Company Icon (Light)</p>
                        <div className='rightFileSetting'>
                            <div className="iconImageBox liteIcon">
                                {lightIconFile && lightIconFile.length > 0 ? <img src={lightIconFile} className='changeLogo' alt="change-logo" />
                                    : <img src={`${API}/${lightIconImage}`} className='changeLogo' alt="change-logo" />
                                }
                                <img src={trash} alt="delete" /> 
                            </div>
                            <div ref={wrapperRef} className="drop-file-input">
                                <div className="drop-file-input__label">
                                    <img src={uploadFile} alt="" />
                                    <p><span>Click to upload</span> or drag and drop</p>
                                </div>
                                <input type="file" onChange={onFileIconLight} />
                            </div>
                        </div>
                    </div>
                    <div className="companyName">
                        <p>Company Icon (Dark)</p>
                        <div className='rightFileSetting'>
                            <div className="iconImageBox darkIcon">
                                {darkIconFile && darkIconFile.length > 0 ? <img src={darkIconFile} className='changeLogo' alt="change-logo" />
                                    : <img src={`${API}/${darkIconImage}`} className='changeLogo' alt="change-logo" />
                                }
                                <img src={trashLight} alt="delete" /> 
                            </div>
                            <div ref={wrapperRef} className="drop-file-input">
                                <div className="drop-file-input__label">
                                    <img src={uploadFile} alt="" />
                                    <p><span>Click to upload</span> or drag and drop</p>
                                </div>
                                <input type="file" onChange={onFileIconDark} />
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
                        <p>Company Details</p>
                        <div className='rightSideSetting'>
                            <div className="companyInput email">
                                <span>Email</span>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='_________@____.____' className='form-control' />
                            </div>
                            <div className="mt-2 phone phoneInput">
                                <label>Phone Number</label>
                                <PhoneInput country={'us'} value={phoneNumber} disableCountryCode={false} onChange={(value) => handlePhoneChange(value)}  />
                            </div>
                            <div className="companyInput address mt-2">
                                <span>Address</span>
                                <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder='' className='form-control'></textarea>
                                {/* <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder='' className='form-control' /> */}
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