import React, { useState, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import folder from '../../Assets/Images/icon/folder.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import uploadFile from '../../Assets/Images/icon/uploadIcon.svg'
import fileFormat from '../../Assets/Images/icon/file-05.svg'
import trash from '../../Assets/Images/icon/trash-02 (1).svg'
import { convertBytesToSize } from '../../CommonFunction/Function'

interface UploadTaskProps {
  handleUploadClose: () => void
  uploadShow: boolean
  setUploadShow: (type: boolean) => void
  setFile: (type: string) => void
  uploadedFiles: any
  setUploadedFiles: any
}

const UploadTask = ({
  setFile,
  uploadedFiles,
  setUploadedFiles,
  uploadShow,
  setUploadShow,
  handleUploadClose,
}: UploadTaskProps) => {
  const wrapperRef = useRef<HTMLInputElement>(null)
  const onFileDrop = (event: any) => {
    const imageFile = event.target.files && event.target.files[0]
    setFile(event.target.files[0])
    if (imageFile && uploadedFiles.length === 0) {
      setUploadedFiles([imageFile])
    }
  }
  // remove file
  const removeFile = () => {
    setUploadedFiles([])
  }

  return (
    <>
      <Modal show={uploadShow} onHide={handleUploadClose} centered>
        <ToastContainer />
        <div className='addMemberForm'>
          <button className='closeModal' onClick={handleUploadClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Container>
            <Row>
              <Col md={12}>
                <div className='addMemberHeading'>
                  <img src={folder} alt='member' />
                  <p>Upload File</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div ref={wrapperRef} className='drop-file-input'>
                  <div className='drop-file-input__label'>
                    <img src={uploadFile} alt='' />
                    <p>
                      <span>Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input type='file' value='' onChange={onFileDrop} />
                </div>
                {uploadedFiles &&
                  uploadedFiles.map((file: any, index: number) => (
                    <div className='uploadFileShow'>
                      <div className='fileFormat'>
                        <img src={fileFormat} alt='file' />
                      </div>
                      <div className='fileName'>
                        <p>{file.name}</p>
                        <span>
                          {convertBytesToSize(file.size)} – 100% uploaded
                        </span>
                      </div>
                      <div className='fileDelete' onClick={removeFile}>
                        <img src={trash} alt='trash' />
                      </div>
                    </div>
                  ))}

                <div className='uploadBtn'>
                  {uploadedFiles && uploadedFiles.length === 0 ? (
                    <button className='btn noFile' type='submit'>
                      Save
                    </button>
                  ) : (
                    <button
                      className='btn save'
                      type='submit'
                      onClick={() => setUploadShow(false)}
                    >
                      Save
                    </button>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Modal>
    </>
  )
}

export default UploadTask
