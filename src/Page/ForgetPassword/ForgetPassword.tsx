import React, { useState, useEffect } from 'react';
import { DESKIE_API as API } from '../../config';
import { singleProfile } from '../../api/settings';
import "./ForgetPassword.css"
import { Link, useNavigate } from 'react-router-dom';
import { forgetPassword, forgetUpdate, singleJwtMember } from '../../api/member';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [memberInfo, setMemberInfo] = useState<any>({});
    const [togglePassword, setTogglePassword] = useState(false);
    const [toggleType, setToggleType] = useState("password");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailInsert, setEmailInsert] = useState(false);
    const [emailSent, setEmailSent] = useState(false);


    useEffect(() => {
        singleProfile().then((data) => {
            setProfile(data.data);
        })
    }, []);

    // forget mail send
    const emailSend = () => {
        let emailInfo = {
            "email": email
        }
        forgetPassword(emailInfo).then((data) => {
           if (data.statusCode !== 201) {
            showNotifications("error",data.message) 
           }
           else{
            setEmailInsert(false)
            setEmailSent(true)
           }
        })
    }
    const urlParams = new URLSearchParams(window.location.search);
    const token: any = urlParams.get('token');
    useEffect(() => {
        if (token) {
            setEmailInsert(false)
            singleJwtMember(token).then((data) => {
                setMemberInfo(data.data.data);
            })
        }
        else{
            setEmailInsert(true)
        }
    }, []);


    // password match
    const showPass = () => {
        setTogglePassword(!togglePassword)
        setToggleType("password")
    }

    const hidePass = () => {
        setTogglePassword(!togglePassword)
        setToggleType("")
    }


    const handleChangePassword = (event: any) => {
        setPassword(event.target.value);
    };

    const handleChangeConfirmPassword = (event: any) => {
        setConfirmPassword(event.target.value);
        if (event.target.value === password) {
            setPasswordMatch(true);
        } else {
            setPasswordMatch(false);
        }
    };

    const passChange = () => {
        let pass = {
            "password": confirmPassword
        }
        forgetUpdate(memberInfo.email, pass).then((data) => {
            return navigate("/");
        })
    }
    return (
        <>
            <section className="loginSection" style={{ background: `linear-gradient(rgba(31, 41, 55, 0.9), rgba(31, 41, 55, 0.94)), url(${profile && `${API}/${encodeURIComponent(profile.background)}`})` }}>
         <ToastContainer/>
            {emailInsert ? <div className="forgetBox">
                    <h6>Forgot Password</h6>
                    <div className="loginInput">
                        <label htmlFor="email">Email Address</label>
                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email address' className='form-control' />
                    </div>
                    <div className="forgetBtn d-flex justify-content-end">
                        <button type='submit' onClick={emailSend}>Next</button>
                    </div>
                </div> : ""}
                {emailSent ? <div className="forgetBox">
                    <h6 className='mb-2'>Password reset has been sent!</h6>
                    <p>Check your email to finish resetting your password</p>
                    <div className="forgetBtn d-flex justify-content-center" style={{marginTop: '44px'}}>
                        <Link to='/'>Back to Login</Link>
                    </div>
                </div> : ""}
                
                {token ?   <div className="forgetBox">
                    <h6>Create New Password</h6>
                    <div className="forgetMember">
                        <label>Your Email</label>
                        <p>{memberInfo.email}</p>
                    </div>
                    <div className="loginInput">
                        <label htmlFor="password">New Password</label>
                        <input
                            type={toggleType}
                            placeholder='Password'
                            value={password}
                            onChange={handleChangePassword}
                        />
                        {togglePassword ? <span onClick={() => showPass()}><FontAwesomeIcon icon={faEye} /> </span> : <span onClick={() => hidePass()}><FontAwesomeIcon icon={faEyeSlash} /></span>}
                    </div>

                    <div className="loginInput">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type={toggleType}
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={handleChangeConfirmPassword}
                        />
                        {togglePassword ? <span onClick={() => showPass()}><FontAwesomeIcon icon={faEye} /> </span> : <span onClick={() => hidePass()}><FontAwesomeIcon icon={faEyeSlash} /></span>}
                    </div>
                    <p className='passMatch'>{passwordMatch ? "" : "Password is not match!!"}</p>
                    <div className="forgetBtn d-flex justify-content-end">
                        <button type='submit' onClick={passChange}>Finish</button>
                    </div>
                </div>: ""}
              
            </section>
        </>
    )
}

export default ForgetPassword