import React from 'react';
import { Modal } from 'react-bootstrap';
import { DESKIE_API as API } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import "./LightBox.css"

interface LightBoxShowProps {
    handleLightBoxClose: () => void;
    lightBoxShow: boolean;
    setLightBoxShow: (type: boolean) => void;
    lightBoxFile: string;
}

const LightBox = ({ lightBoxFile, lightBoxShow, setLightBoxShow, handleLightBoxClose }: LightBoxShowProps) => {
    return (
        <>
            <section className='lightModal'>
                <Modal show={lightBoxShow} onHide={() => setLightBoxShow(false)} centered size="lg" className='lightModal' aria-labelledby="example-custom-modal-styling-title" >
                    <div className="lightBox">
                        <button className='closeModal' onClick={handleLightBoxClose}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <img src={`${API}/${lightBoxFile}`} width="100%" height="100%" alt="light" />
                    </div>
                </Modal>
            </section>

        </>
    )
}

export default LightBox