import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import "./ChangePassword.css";
import { memberPassword } from '../../api/admin';

interface EmailProps {
    userEmail: string;
}

const ChangePassword = ({ userEmail }: EmailProps) => {
    const [togglePassword, setTogglePassword] = useState(false);
    const [toggleType, setToggleType] = useState("password");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true); // State to track password match status

    const showPass = () => {
        setTogglePassword(!togglePassword)
        setToggleType("password")
    }

    const hidePass = () => {
        setTogglePassword(!togglePassword)
        setToggleType("")
    }


    const handleChangePassword = (event:any) => {
        setPassword(event.target.value);
        // if (event.target.value === confirmPassword) {
        //     setPasswordMatch(true);
        // } else {
        //     setPasswordMatch(false);
        // }
    };

    const handleChangeConfirmPassword = (event:any) => {
        setConfirmPassword(event.target.value);
        if (event.target.value === password) {
            setPasswordMatch(true);
        } else {
            setPasswordMatch(false);
        }
    };
    const togglePasswordVisibility = () => {
        // Function to toggle password visibility
    };
    // password update
    const changePassword = () => {
        memberPassword({ userEmail, password }).then((data) => {
            console.log('password',data);

        })
    }


    return (
        <>
            <div className="loginBox">
                <div className="PasswordForm">
                    <div className="accountPassword">
                        <h1>Finish Setting Up Your Account</h1>
                    </div>
                    <div className="passwordText">
                        <h1>Welcome <span>JOHN SMITH! 👋</span></h1>
                        <p>Someone from <b>Buzz Coworking</b> has invited you to join their space! Set your password to continue to your dashboard.</p>
                    </div>

                    <div className='d-flex justify-content-between'>
                        <div className="loginInput" style={{ width: "48%" }}>
                            <label htmlFor="password">Password</label>
                            <input
                                type={toggleType}
                                placeholder='Password'
                                value={password}
                                onChange={handleChangePassword}
                            />
                            {togglePassword ? <span onClick={() => showPass()}><FontAwesomeIcon icon={faEye} /> </span> : <span onClick={() => hidePass()}><FontAwesomeIcon icon={faEyeSlash} /></span>}
                        </div>

                        <div className="loginInput" style={{ width: "48%" }}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type={toggleType}
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                onChange={handleChangeConfirmPassword}
                            />
                           {togglePassword ? <span onClick={() => showPass()}><FontAwesomeIcon icon={faEye} /> </span> : <span onClick={() => hidePass()}><FontAwesomeIcon icon={faEyeSlash} /></span>}
                        </div>
                        
                    </div>
                    {!passwordMatch && <p className='text-danger'>Passwords do not match</p>}
                    <div className="loginBtn">
                        <button type='submit' onClick={changePassword}>Save</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePassword