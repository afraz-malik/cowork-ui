import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { DESKIE_API as API } from '../../config';
import imageInput from "../../Assets/Images/icon/imgButton.png";
import blankUser from "../../Assets/Images/icon/blank-profile.jpg";
import PhoneInput from 'react-phone-input-2';

interface tabMemberProps {
    tabChoose: (tab: string, select: string) => void;
    memberInfo:any;
}

const MemberPanel = ({ tabChoose,memberInfo }: tabMemberProps) => {
    const memberFunction = () => {
        tabChoose("password", "member")
    }
    return (
        <>
            <div className="profileInfo">
                <h1>Personal Info</h1>
                <div className="imageUpload">
                    <div className="memberImg">
                        {memberInfo.member_image ?  <img className='member' src={`${API}/${memberInfo.member_image}`} alt="" />
                        :  <img className='member' src={blankUser} alt="" />}
                       
                        <div className="round">
                            <img src={imageInput} alt="profile" />
                        </div>
                    </div>
                </div>
   
                <div className="memberInput memberSignUp">
                    <label>First Name</label>
                    <input type="text" value={memberInfo.first_name} readOnly name="firstName" placeholder="First Name" className="form-control" />
                </div>
                <div className="memberInput memberSignUp">
                    <label>Last Name</label>
                    <input type="text" value={memberInfo.last_name} readOnly name="firstName" placeholder="First Name" className="form-control" />
                </div>
                <div className="memberInput memberSignUp">
                    <label>Phone Number</label>
                    <PhoneInput country={'us'} disableCountryCode={false} value={memberInfo.phone_number}  inputProps={{ readOnly: true }} />
                </div>
                <div className="memberInput memberSignUp">
                    <label>Business Name</label>
                    <input type="text" value={memberInfo.business_name} readOnly name="firstName" placeholder="First Name" className="form-control" />
                </div>
                <div className="memberInput memberSignUp">
                    <label>Email Address</label>
                    <input type="text" value={memberInfo.email} readOnly name="firstName" placeholder="First Name" className="form-control" />
                </div>
                <div className="tabPanelBtn">
                    <button className='backBtn'><FontAwesomeIcon icon={faArrowLeft} /> Back</button>
                    <button className='continue' onClick={memberFunction}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
                </div>
            </div>
        </>
    )
}

export default MemberPanel