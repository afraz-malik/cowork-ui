import React, { useEffect, useState } from 'react';
import "./SignUp.css";
import { singleProfile } from '../../api/settings';
import { DESKIE_API as API } from '../../config';
import logo from "../../Assets/Images/logo/logo.png";
import signUpImage from "../../Assets/Images/background/member.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import RegistrationPanel from './RegistrationPanel';



const SignUp = () => {
    const [profile, setProfile] = useState<any>();
    const [userTab, setUserTab] = useState(true);
    useEffect(() => {
        singleProfile().then((data) => {
            if (data.statusCode !== 200) {

            }
            else {
                setProfile(data.data);
            }
        })
    }, [])
    return (
        <>
            <section className="signUpSection">
                {userTab ? <div className="signUpBox">
                    <div className="logo">
                        {profile && profile.company_logo ?
                            <img src={`${API}/${profile.company_logo}`} alt="logo" />
                            : <img src={logo} alt="logo" />
                        }
                    </div>
                    <img src={signUpImage} alt="sign" />
                    <div className="welcomeText">
                        <h6>Welcome to Buzz Coworking!</h6>
                        <p>We’ve got a few questions, let’s get started!</p>
                        <button onClick={()=>setUserTab(false)}>Continue <FontAwesomeIcon icon={faArrowRight} /> </button>
                    </div>
                </div> 
                : <RegistrationPanel /> }
                 
                
            </section>
        </>
    )
}

export default SignUp