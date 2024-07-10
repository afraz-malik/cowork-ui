import React, { useEffect, useState } from 'react';
import "./SignUp.css";
import { singleProfile } from '../../api/settings';
import { DESKIE_API as API } from '../../config';
import logo from "../../Assets/Images/logo/logo.svg";
import signUpImage from "../../Assets/Images/background/member.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import RegistrationPanel from './RegistrationPanel';



const SignUp = () => {
    const [profile, setProfile] = useState<any>();
    const [userTab, setUserTab] = useState(true);
    useEffect(() => {
        singleProfile().then((data) => {
            setProfile(data.data);
        })
    }, [])
    return (
        <>
            <section className="signUpSection">
                {userTab ? <div className="signUpBox">
                    <div className="logo">
                        {profile && profile.company_logo_dark ?
                            <img src={`${API}/${profile.company_logo_dark}`} alt="logo" />
                            : <img src={logo} alt="logo" />
                        }
                    </div>
                    <img src={signUpImage} alt="sign" />
                    <div className="welcomeText">
                        <h6>Welcome to {profile && profile.company_name}!</h6>
                        <p>We’ve got a few questions, let’s get started!</p>
                        <button className='mt-3' onClick={() => setUserTab(false)}>Continue <FontAwesomeIcon icon={faArrowRight} /> </button>
                    </div>
                </div>
                    : <RegistrationPanel />}


            </section>
        </>
    )
}

export default SignUp