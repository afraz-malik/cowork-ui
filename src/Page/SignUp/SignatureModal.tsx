import React, { useState } from 'react'
import { Modal, Tab, Col, Row, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import SignaturePad from 'react-signature-canvas'
import SignatureCanvas from 'react-signature-canvas'

interface AddSignatureProps {
  handleClose: () => void
  show: boolean
  signName: string
  setShow: (type: boolean) => void
  setDataURL: (type: string) => void
  setDataFile: (type: File) => void
  setSignName: (type: string) => void
  memberId: string
}

const SignatureModal = ({
  show,
  setShow,
  handleClose,
  memberId,
  setDataURL,
  setDataFile,
  signName,
  setSignName,
}: AddSignatureProps) => {
  const [activeTab, setActiveTab] = useState<string>('first')

  let padRef = React.useRef<SignatureCanvas>(null)

  const clear = () => {
    padRef.current?.clear()
  }

  const trim = () => {
    handleTabClick('second')
    const url = padRef.current?.getTrimmedCanvas().toDataURL('image/png')
    const trimmedCanvas = padRef.current?.getTrimmedCanvas()
    if (url) setDataURL(url)
    if (trimmedCanvas) {
      trimmedCanvas.toBlob((blob: any) => {
        if (blob) {
          const file = new File([blob], `${memberId}`, { type: 'image/png' })
          setDataFile(file)
        }
      }, 'image/png')
    }
  }

  const handleTabClick = (eventKey: string) => {
    setActiveTab(eventKey)
  }

  const saveSignature = () => {
    setShow(false)
  }

  const back = () => {
    setActiveTab('first')
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size='lg'>
        <div className='addMemberForm signatureTab'>
          <button className='closeModal' onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h1>Add Signature</h1>
          <div className='signatureBox'>
            <Tab.Container id='left-tabs-example' defaultActiveKey='first'>
              <Row>
                <Col sm={3}>
                  <Nav variant='pills' className='flex-column signatureTab'>
                    <Nav.Item className='mb-2'>
                      <Nav.Link eventKey='first' active={activeTab === 'first'}>
                        Draw Signature
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Nav.Link
                        eventKey='second'
                        active={activeTab === 'second'}
                      >
                        Type Signature
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    <Tab.Pane eventKey='first' active={activeTab === 'first'}>
                      <div className='signaturePad'>
                        <p>
                          Please sign the area below with your finger or mouse.
                        </p>
                        <SignaturePad
                          ref={padRef}
                          canvasProps={{ className: 'sigCanvas' }}
                        />
                        <div className='tabPanelBtn mt-4'>
                          <button className='back' onClick={clear}>
                            Cancel
                          </button>
                          <button className='continue' onClick={trim}>
                            Continue
                          </button>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey='second' active={activeTab === 'second'}>
                      <div className='typeSignature px-4'>
                        <p className='mb-0'>Type your full legal name below</p>
                        <input
                          value={signName}
                          onChange={(e) => setSignName(e.target.value)}
                          className='form-control'
                          type='text'
                        />
                      </div>
                      <div className='tabPanelBtn mt-4'>
                        <button className='back' onClick={back}>
                          Back
                        </button>
                        <button className='continue' onClick={saveSignature}>
                          Save
                        </button>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SignatureModal
