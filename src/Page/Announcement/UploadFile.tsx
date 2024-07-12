import React, { useState, useRef } from 'react'
import { ToastContainer } from 'react-toastify';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import folder from "../../Assets/Images/icon/folder.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import uploadFile from "../../Assets/Images/icon/uploadIcon.svg";
import fileFormat from "../../Assets/Images/icon/file-05.svg";
import trash from "../../Assets/Images/icon/trash-02.svg";
import { convertBytesToSize } from '../../CommonFunction/Function';


interface UploadFileProps {
    handleUploadClose: () => void;
    uploadShow: boolean;
    setUploadShow: (type: boolean) => void;
    setFile: (type: string) => void;
    uploadedFiles: any;
    setUploadedFiles: any;
    setCommentFileId?: any;
    id?: any;
}


const UploadFile = ({ id,setFile, uploadedFiles, setUploadedFiles, uploadShow, setUploadShow, handleUploadClose, setCommentFileId }: UploadFileProps) => {

    const wrapperRef = useRef<HTMLInputElement>(null);
    const onFileDrop = (event: any) => {
        const imageFile = event.target.files && event.target.files[0];
        setFile(event.target.files[0]);
        setCommentFileId((prevState:any) => ({
            ...prevState,
            [id]: event.target.files[0].name
        }));
        if (imageFile && uploadedFiles.length === 0) {
            setUploadedFiles([imageFile]);
        }
    }
    // remove file
    const removeFile = () => {
        setUploadedFiles([]);
    }

    return (
        <>
            <Modal show={uploadShow} onHide={handleUploadClose} centered>
                <ToastContainer />
                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleUploadClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container className='px-0'>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={folder} alt="member" />
                                    <p>Upload File</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <div ref={wrapperRef} className="drop-file-input">
                                    <div className="drop-file-input__label">
                                        <img src={uploadFile} alt="" />
                                        <p className='mb-0'><span>Click to upload</span> or drag and drop</p>
                                        <h6>Maximum upload size <b>26 MB</b></h6>
                                    </div>
                                    <input type="file" value="" onChange={onFileDrop} />
                                </div>
                                {uploadedFiles && uploadedFiles.map((file:any, index:number) =>
                                    <div className="uploadFileShow">
                                        <div className="fileFormat">
                                            <img src={fileFormat} alt="file" />
                                        </div>
                                        <div className="fileName">
                                            <p>{file.name}</p>
                                            <span>{convertBytesToSize(file.size)} – 100% uploaded</span>
                                        </div>
                                        <div className="fileDelete" onClick={removeFile}>
                                            <img src={trash} alt="trash" />
                                        </div>
                                    </div>
                                )}


                                <div className="uploadBtn" style={{marginTop: "24px"}}>
                                    {uploadedFiles && uploadedFiles.length === 0 ? <button className='btn noFile' type='submit'>Save</button>
                                        : <button className='btn save' type='submit' onClick={() => setUploadShow(false)}>Save</button>
                                    }
                                </div>
                            </Col>
                        </Row>

                    </Container>
                </div>
            </Modal>
        </>
    )
}

export default UploadFile