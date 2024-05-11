import React, { useState, useEffect } from 'react'
import stepCheck from "../../Assets/Images/icon/stepCheck.png";
import stepDot from "../../Assets/Images/icon/stepDot.png";
import stepBlank from "../../Assets/Images/icon/stepBlank.png";
import MemberPanel from './MemberPanel';
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
        singleJwtMember(token).then((data) => {
            if (data.statusCode !== 200) {

            }
            else {
                setMemberInfo(data.data.data);
            }
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
        <>
            <div className="tabPanel">
                <div className="tabHeading">
                    <ul className="tablist">
                        <li className="">
                            <div className="arrowLine">
                                <div className="checkCircle">
                                    {checkValueExist("member", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                        <>{memberTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                    }
                                </div>
                            </div>
                            <div className="arrowHeading">
                                <h6>Personal Info</h6>
                                <p>Tell us who you are</p>
                            </div>
                        </li>
                        <li className="">
                            <div className="arrowLine">
                                <div className="checkCircle">
                                    {checkValueExist("password", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                        <>{passwordTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                    }
                                </div>
                            </div>
                            <div className="arrowHeading">
                                <h6>Set Password</h6>
                                <p>Secure your account</p>
                            </div>
                        </li>
                        <li className="">
                            <div className="arrowLine">
                                <div className="checkCircle">
                                    {checkValueExist("billing", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                        <>{billingTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                    }
                                </div>
                            </div>
                            <div className="arrowHeading">
                                <h6>Billing Info</h6>
                                <p>Payment method</p>
                            </div>
                        </li>
                        <li className="">
                            <div className="arrowLine">
                                <div className="checkCircle">
                                    {checkValueExist("agreement", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                        <> {agreementTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                    }
                                </div>
                            </div>
                            <div className="arrowHeading">
                                <h6>Membership Agreement</h6>
                                <p>Read, sign, submit</p>
                            </div>
                        </li>
                        <li className="">
                            <div className="arrowLine">
                                <div className="checkCircle">
                                    {checkValueExist("done", selectedTabs) ? <img src={stepCheck} alt='stepCheck' /> :
                                        <> {finishTab ? <img src={stepDot} alt='stepCheck' /> : <img src={stepBlank} alt='stepCheck' />}</>
                                    }

                                </div>
                            </div>
                            <div className="arrowHeading">
                                <h6>Done!</h6>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="tabContent">
                    {memberTab ? <MemberPanel memberInfo={memberInfo} tabChoose={tabChoose} /> : ""}
                    {passwordTab ? <PasswordPanel password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} tabChoose={tabChoose} /> : ""}
                    {billingTab ? <Billing tabChoose={tabChoose} /> : ""}
                    {agreementTab ? <Agreement memberId={memberInfo.id} signatureAdd={signatureAdd} dataURL={dataURL} setDataURL={setDataURL} signName={signName} setSignName={setSignName} dataFile={dataFile} setDataFile={setDataFile} tabChoose={tabChoose} /> : ""}
                    {finishTab ? <Finish tabChoose={tabChoose} /> : ""}
                </div>
            </div>
        </>
    )
}

export default RegistrationPanel