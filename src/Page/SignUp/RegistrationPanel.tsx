import React, { useState, useEffect } from 'react'
import stepCheck from "../../Assets/Images/icon/stepCheck.svg";
import stepDot from "../../Assets/Images/icon/stepDot.svg";
import stepBlank from "../../Assets/Images/icon/stepBlank.svg";
import MemberPanel from './MemberPanel';
import logo from "../../Assets/Images/logo/logo.svg";
import { DESKIE_API as API } from '../../config';
import { singleProfile } from '../../api/settings';
import PasswordPanel from './PasswordPanel';
import Billing from './Billing';
import Agreement from './Agreement';
import Finish from './Finish';
import { singleJwtMember, updateSignature } from '../../api/member';


const RegistrationPanel = () => {
    const [memberTab, setMemberTab] = useState(true);
    const [passwordTab, setPasswordTab] = useState(false);
    const [billingTab, setBillingTab] = useState(false);
    const [agreementTab, setAgreementTab] = useState(false);
    const [finishTab, setFinishTab] = useState(false);
    const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
    const [memberInfo, setMemberInfo] = useState<any>({});
    const [profile, setProfile] = useState<any>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dataURL, setDataURL] = useState<string>("");
    const [dataFile, setDataFile] = useState<any>(null);
    const [signName, setSignName] = useState("");
    // tab panel choose
    const tabChoose = (tab: string, selectTab: string) => {
        setSelectedTabs(prevTabs => {
            const tabExists = prevTabs.includes(selectTab);
            if (tabExists) {
                return prevTabs;
            } else {
                return [...prevTabs, selectTab];
            }
        });

        switch (tab) {
            case 'member':
                setMemberTab(true);
                setPasswordTab(false);
                setBillingTab(false);
                setAgreementTab(false);
                setFinishTab(false);
                break;
            case 'password':
                setMemberTab(false);
                setPasswordTab(true);
                setBillingTab(false);
                setAgreementTab(false);
                setFinishTab(false);
                break;
            case 'billing':
                setMemberTab(false);
                setPasswordTab(false);
                setBillingTab(true);
                setAgreementTab(false);
                setFinishTab(false);
                break;
            case 'agreement':
                setMemberTab(false);
                setPasswordTab(false);
                setBillingTab(false);
                setAgreementTab(true);
                setFinishTab(false);
                break;
            case 'done':
                setMemberTab(false);
                setPasswordTab(false);
                setBillingTab(false);
                setAgreementTab(false);
                setFinishTab(true);
                break;
            default:
                setMemberTab(true);
                setPasswordTab(false);
                setBillingTab(false);
                setAgreementTab(false);
                setFinishTab(false);
        }
    }
    // check tab duplicate
    function checkValueExist(value: string, valuesArray: string[]) {
        return valuesArray.includes(value);
    }

    // const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const token: any = urlParams.get('token');
    // single member info load
    useEffect(() => {
        singleProfile().then((data) => {
            setProfile(data.data);
        })
        singleJwtMember(token).then((data) => {
            setMemberInfo(data.data.data);
        })
    }, []);


    const signatureAdd = () => {
        let signIno = {
            "password": password,
            "signature_image": dataFile,
            "signature": signName,
            "account_active": true
        }

        updateSignature(memberInfo.id, signIno).then((data) => {
            console.log('update',data);
            
        })
    }


    return (
        <div className='d-flex flex-column'>
            <div className="logo mb-4">
                {profile && profile.company_logo_dark ?
                    <img src={`${API}/${profile.company_logo_dark}`} alt="logo" />
                    : <img src={logo} alt="logo" />
                }
            </div>

            <div className="tabPanel">
                <div className="tabHeading">
                    <ul className="tablist">
                        <li className="">
                            <div className="arrowLine">
                                <div className={`checkCircle ${checkValueExist("member", selectedTabs) && 'checked'}`}>
                                    {checkValueExist("member", selectedTabs) ? <img className='checked' src={stepCheck} alt='stepCheck' /> :
                                        <>{memberTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                    }
                                </div>
                            </div>
                            <div className="arrowHeading">
                                <h6 className={memberTab ? 'selected' : ''}>Personal Info</h6>
                                <p className={memberTab ? 'selected' : ''}>About you</p>
                            </div>
                        </li>
                        <li className="">
                            <div className="arrowLine">
                                <div className={`checkCircle ${checkValueExist("password", selectedTabs) && 'checked'}`}>
                                    {checkValueExist("password", selectedTabs) ? <img className='checked' src={stepCheck} alt='stepCheck' /> :
                                        <>{passwordTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                    }
                                </div>
                            </div>
                            <div className="arrowHeading">
                                <h6 className={passwordTab ? 'selected' : ''}>Set Password</h6>
                                <p className={passwordTab ? 'selected' : ''}>Secure your account</p>
                            </div>
                        </li>
                        <li className="">
                            <div className="arrowLine">
                                <div className={`checkCircle ${checkValueExist("billing", selectedTabs) && 'checked'}`}>
                                    {checkValueExist("billing", selectedTabs) ? <img className='checked' src={stepCheck} alt='stepCheck' /> :
                                        <>{billingTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                    }
                                </div>
                            </div>
                            <div className="arrowHeading">
                                <h6 className={billingTab ? 'selected' : ''}>Billing Info</h6>
                                <p className={billingTab ? 'selected' : ''}>Payment method</p>
                            </div>
                        </li>
                        <li className="">
                            <div className="arrowLine">
                                <div className={`checkCircle ${checkValueExist("agreement", selectedTabs) && 'checked'}`}>
                                    {checkValueExist("agreement", selectedTabs) ? <img className='checked' src={stepCheck} alt='stepCheck' /> :
                                        <> {agreementTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                    }
                                </div>
                            </div>
                            <div className="arrowHeading">
                                <h6 className={agreementTab ? 'selected' : ''}>Membership Agreement</h6>
                                <p className={agreementTab ? 'selected' : ''}>Read, sign, submit</p>
                            </div>
                        </li>
                        <li className="">
                            <div className="arrowLine">
                                <div className={`checkCircle done ${checkValueExist("done", selectedTabs) && 'checked'}`}>
                                    {checkValueExist("done", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                        <> {finishTab ? <img src={stepCheck} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                    }

                                </div>
                            </div>
                            <div className="arrowHeading">
                                <h6 className={finishTab ? 'selected' : ''}>Done!</h6>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="tabContent">
                    {memberTab ? <MemberPanel memberInfo={memberInfo} tabChoose={tabChoose} /> : ""}
                    {passwordTab ? <PasswordPanel password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} tabChoose={tabChoose} /> : ""}
                    {billingTab ? <Billing tabChoose={tabChoose} /> : ""}
                    {agreementTab ? <Agreement memberId={memberInfo.id} signatureAdd={signatureAdd} dataURL={dataURL} setDataURL={setDataURL} signName={signName} setSignName={setSignName} dataFile={dataFile} setDataFile={setDataFile} tabChoose={tabChoose} /> : ""}
                    {finishTab ? <Finish password={password} email={memberInfo.email} tabChoose={tabChoose} /> : ""}
                </div>
            </div>
        </div>
    )
}

export default RegistrationPanel