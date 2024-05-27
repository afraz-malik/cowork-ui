import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import pen from "../../Assets/Images/icon/pen.png";
import SignatureModal from './SignatureModal';

interface tabMemberProps {
    tabChoose: (tab: string, select: string) => void;
    dataURL: string;
    setDataURL: (value: string) => void;
    signName: string;
    setSignName: (value: string) => void;
    dataFile: string;
    setDataFile: (value: any) => void;
    signatureAdd: () => void;
    memberId: string;
}

const Agreement = ({ tabChoose, signatureAdd,memberId, dataURL, setDataURL, signName, setSignName, dataFile, setDataFile }: tabMemberProps) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const deleteSign = () => {
        setDataFile("");
        setSignName("");
        setDataURL("");
    }

    const editSign = () => {
        setShow(true);
    }

    function handleButtonClick() {
        tabChoose("done", "agreement");
        signatureAdd();
    }

    return (
        <>
            <div className="agreementInfo">
                <h1>Membership Agreement</h1>
                <div className="agreementText">
                    <h6>Lorem Ipsum</h6>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                </div>
                <div className="agreeCheck">
                    <label className="agreement">
                        <label className="tableCheckBox">
                            <div className="contactCheck">
                                <input type="checkbox" name="agreement" />
                                <span className="checkmark"></span></div>
                        </label>
                        <span className='agreeText'>I agree</span>
                    </label>
                </div>

                {dataFile ? <div className="signShowBox">
                    <div className="signShow">
                        {dataURL ? (
                            <img
                                className="sigImage"
                                src={dataURL}
                                alt="user generated signature"
                            />
                        ) : null}
                        <span className='signatureName'>{signName && signName}</span>
                    </div>
                    <div className="signChange">
                        <button onClick={editSign}>Edit</button>
                        <button onClick={deleteSign}>Delete</button>
                    </div>
                </div> : <div className="signBox" onClick={handleShow}>
                    <img src={pen} alt="pen" />
                    <p>Click here to sign</p>
                </div>}

                <div className="tabPanelBtn">
                    <button className='back' onClick={() => tabChoose("billing", "agreement")}><FontAwesomeIcon icon={faArrowLeft} /> Back</button>
                    {signName.length && dataURL.length ? <button className='continue' onClick={handleButtonClick}>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
                        : <button className='disable'>Continue <FontAwesomeIcon icon={faArrowRight} /></button>
                    }

                </div>
            </div>
            <SignatureModal memberId={memberId} show={show} setShow={setShow} handleClose={handleClose} setDataURL={setDataURL} setDataFile={setDataFile} signName={signName} setSignName={setSignName} />
        </>
    )
}

export default Agreement