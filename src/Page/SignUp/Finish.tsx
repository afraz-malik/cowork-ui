import React from 'react';
import finish from "../../Assets/Images/background/finish.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
interface tabMemberProps{
    tabChoose:(tab: string,select: string)=>void;
}

const Finish = ({tabChoose}:tabMemberProps) => {
    const navigate = useNavigate();
    function handleButtonClick() {
        tabChoose("done", "");
        return navigate("/")
    }
    return (
        <>
            <div className="finishInfo">
                <div className="finishText">
                <img src={finish} alt="finish" />
                <h6>Congratulations, you’re done!</h6>
                <p>Click “Finish” to login!</p>
                </div>
                <div className="tabPanelBtn">
                    <button className='back' onClick={() => tabChoose("agreement","done")}><FontAwesomeIcon icon={faArrowLeft} /> Back</button>
                    <button className='continue'  onClick={handleButtonClick}>Finish <FontAwesomeIcon icon={faArrowRight} /></button>
                </div>
            </div>
        </>
    )
}

export default Finish