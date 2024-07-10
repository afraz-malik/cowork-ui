import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
interface tabMemberProps {
    tabChoose: (tab: string, select: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
}
const PasswordPanel = ({ tabChoose, confirmPassword, setConfirmPassword, password, setPassword }: tabMemberProps) => {
    const [togglePassword, setTogglePassword] = useState(false);
    const [toggleType, setToggleType] = useState("password");
    const [passwordMatch, setPasswordMatch] = useState(true);

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

    return (
        <>
            <div className="passwordInfo">
                <h1>Set Password</h1>

                <div className="loginInput mt-4">
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
                <div className="tabPanelBtn">
                    <button className='back' onClick={() => tabChoose("member", "password")}><FontAwesomeIcon icon={faArrowLeft} /> Back</button>
                    {confirmPassword.length ? <>
                        {password === confirmPassword ? <button className='continue' onClick={() => tabChoose("billing", "password")}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
                            : <button className='disable' disabled={true}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
                        }
                    </> : <>
                        <button className='disable' disabled={true}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
                    </>}


                </div>
            </div>
        </>
    )
}

export default PasswordPanel