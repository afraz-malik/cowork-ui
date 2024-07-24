import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import pen from '../../Assets/Images/icon/pen.svg'
import SignatureModal from './SignatureModal'

interface tabMemberProps {
  tabChoose: (tab: string, select: string) => void
  dataURL: string
  setDataURL: (value: string) => void
  signName: string
  setSignName: (value: string) => void
  dataFile: string
  setDataFile: (value: any) => void
  signatureAdd: () => void
  memberId: string
}

const Agreement = ({
  tabChoose,
  signatureAdd,
  memberId,
  dataURL,
  setDataURL,
  signName,
  setSignName,
  dataFile,
  setDataFile,
}: tabMemberProps) => {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const deleteSign = () => {
    setDataFile('')
    setSignName('')
    setDataURL('')
  }

  const editSign = () => {
    setShow(true)
  }

  function handleButtonClick() {
    tabChoose('done', 'agreement')
    signatureAdd()
  }

  return (
    <>
      <div className='agreementInfo'>
        <h1>Membership Agreement</h1>
        <div className='scroll-container my-3'>
          <div className='agreementText my-0 px-3 border-0'>
            <h6>Lorem Ipsum</h6>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. Lorem
              Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </p>
          </div>
        </div>
        <div className='agreeCheck px-3 mb-3'>
          <label className='agreement'>
            <label className='tableCheckBox'>
              <div className='contactCheck'>
                <input type='checkbox' name='agreement' />
                <span className='checkmark'></span>
              </div>
            </label>
            <span className='agreeText'>
              I agree to these membership terms, June 3rd 2024
            </span>
          </label>
        </div>

        {dataFile ? (
          <div className='signShowBox'>
            <div className='signShow'>
              {dataURL ? (
                <img
                  className='sigImage'
                  src={dataURL}
                  alt='user generated signature'
                />
              ) : null}
              <span className='signatureName'>{signName && signName}</span>
            </div>
            <div className='signChange'>
              <button onClick={editSign}>Edit</button>
              <button onClick={deleteSign}>Delete</button>
            </div>
          </div>
        ) : (
          <div className='signBox' onClick={handleShow}>
            <img src={pen} alt='pen' />
            <p className='mt-2 mb-0'>Click here to sign</p>
          </div>
        )}

        <div className='tabPanelBtn'>
          <button
            className='back'
            onClick={() => tabChoose('billing', 'agreement')}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          {signName.length && dataURL.length ? (
            <button className='continue' onClick={handleButtonClick}>
              Continue <FontAwesomeIcon icon={faArrowRight} />
            </button>
          ) : (
            <button className='disable'>
              Continue <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
        </div>
      </div>
      <SignatureModal
        memberId={memberId}
        show={show}
        setShow={setShow}
        handleClose={handleClose}
        setDataURL={setDataURL}
        setDataFile={setDataFile}
        signName={signName}
        setSignName={setSignName}
      />
    </>
  )
}

export default Agreement
