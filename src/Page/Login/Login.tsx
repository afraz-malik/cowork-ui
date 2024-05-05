import React, { useState, useEffect } from 'react';
import "./Login.css";
import logo from "../../Assets/Images/logo/logo.png";
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { loginAdmin, memberPassword } from '../../api/admin';
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { authenticate } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { singleProfile } from '../../api/settings';
import { DESKIE_API as API } from '../../config';
import backgroundImg from "../../Assets/Images/background/login.png";
import ChangePassword from '../../Component/ChangePassword/ChangePassword';

const Login = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>();
    const [backImage, setBackImage] = useState("");
    const [passwordUpdate, setPasswordUpdate] = useState(false);
    const [togglePassword, setTogglePassword] = useState(false);
    const [toggleType, setToggleType] = useState("password");
    const [userEmail, setUserEmail] = useState("");
    const {
        register,
        handleSubmit,
        setValue,
    } = useForm();

    const showPass = () => {
        setTogglePassword(!togglePassword)
        setToggleType("password")
    }

    const hidePass = () => {
        setTogglePassword(!togglePassword)
        setToggleType("")
    }

    let onSubmit = (user: any) => {
        const { email, password } = user;
        loginAdmin({ email, password }).then((data) => {
            console.log('login', data);
            if (data.statusCode !== 200) {
                showNotifications('error', 'Wrong information');
            }
            else {
                if (data.passwordCheck === true) {
                    setPasswordUpdate(true);
                    setUserEmail(email);
                }
                else {
                    showNotifications('success', 'Login Successfully');
                    authenticate(data, () => {
                        setTimeout(() => {
                            setValue("email", "", { shouldValidate: false });
                            setValue("password", "", { shouldValidate: false });
                            if (data.user.role === "admin") {
                                return navigate("/member");
                            }
                            else {
                                return navigate("/my-messenger");
                            }

                        }, 500)
                    })
                }

            }
        })
    }




    useEffect(() => {
        singleProfile().then((data) => {
            if (data.statusCode !== 200) {

            }
            else {
                setProfile(data.data);
                setBackImage(data.data.background);
            }
        })
    }, [])



    const LoginForm = () => {
        return (
            <div className="loginBox">
                <div className="logo">
                    {profile && profile.company_logo ?
                        <img src={`${API}/${profile.company_logo}`} alt="logo" />
                        : <img src={logo} alt="logo" />
                    }
                </div>
                <div className="loginForm">
                    <h6>Login</h6>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="loginInput">
                            <label htmlFor="email">Email Address</label>
                            <input type='email' {...register("email", { required: true })} placeholder='Email' className='form-control' />
                        </div>
                        <div className="loginInput">
                            <label htmlFor="password">Password</label>
                            <input type={toggleType} {...register("password", { required: true })} placeholder='Password' />
                            {togglePassword ? <span onClick={() => showPass()}><FontAwesomeIcon icon={faEye} /> </span> : <span onClick={() => hidePass()}><FontAwesomeIcon icon={faEyeSlash} /></span>}
                        </div>
                        <label className="agreement">
                            <label className="tableCheckBox">
                                <div className="contactCheck">
                                    <input type="checkbox" name="agreement" />
                                    <span className="checkmark"></span></div>
                            </label>
                            <span>Remember Me</span>
                        </label>
                        <div className="loginBtn">
                            <button type='submit'>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };


    return (
        <div>
            <ToastContainer />
            <div>

                <section className="loginSection" style={{ backgroundImage: `url(${profile && `${API}/${encodeURIComponent(profile.background)}`})` }}>
                    {LoginForm()}
                </section>

            </div>
        </div>
    )
}

export default Login