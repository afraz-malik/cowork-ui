import React, { useState, useRef, useEffect, useContext } from 'react'
import { ToastContainer } from 'react-toastify';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import folder from "../../Assets/Images/icon/folder.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { DESKIE_API as API } from '../../config';
import uploadFile from "../../Assets/Images/icon/uploadIcon.png";
import fileFormat from "../../Assets/Images/icon/file-05.png";
import trash from "../../Assets/Images/icon/red-trash.png";
import avatar from "../../Assets/Images/icon/Avatar.png";
import { filesAdd, uploadFilesForChat } from '../../api/files';
import { convertBytesToSize } from '../../CommonFunction/Function';
import { showNotifications } from '../../CommonFunction/toaster';
import { CHATTER, USER } from '../../CommonFunction/types';
import { CHAT_FILE, CHAT_GROUP, CHAT_SINGLE } from '../../CommonFunction/constant';
import { SocketContext } from '../../CommonFunction/SocketContext';

interface UploadFileProps {
    from: USER;
    to: USER[];
    chatter: CHATTER | null;
    handleUploadClose: () => void;
    uploadShow: boolean;
    setUploadShow: (type: boolean) => void;
}

const UploadFileForChat = ({ chatter, from, to, uploadShow, setUploadShow, handleUploadClose }: UploadFileProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [file, setFile] = useState("");
    const socket = useContext(SocketContext);

    useEffect(() => {

    }, []);

    const wrapperRef = useRef<HTMLInputElement>(null);
    const onFileDrop = (event: any) => {
        const imageFile = event.target.files && event.target.files[0];
        setFile(event.target.files[0])
        if (imageFile && uploadedFiles.length === 0) {
            setUploadedFiles([imageFile]);
        }
    }
    // remove file
    const removeFile = () => {
        setUploadedFiles([]);
    }
    // add files
    const addFiles = () => {

        // let overload = {
        //     origin: uploadedFiles[0].name,
        //     from: from,
        //     to: to,
        //     type: CHAT_FILE,
        //     file_path: uuidv4(),
        //   };

        let overload: any = {
            // "id": uuidv4(),
            // "name": uploadedFiles[0].name,
            // "sender": from,
            // "receivers": to,
            "files_upload": uploadedFiles[0]
        }

        uploadFilesForChat(overload).then((payload) => {
            if (payload.statusCode !== 200) {
                showNotifications('error', payload.message);
            }
            else {
                const filename = payload.filename

                let sockData = {
                    sender: from.email,
                    name: from.name,
                    recipient: to,
                    mode: CHAT_FILE,
                    type: to.length > 1 ? CHAT_GROUP : CHAT_SINGLE,
                    file_path: filename,
                    group_id: chatter?.group_id,
                    created_at: Date()

                    // sender: currentUser.email,
                    // name: currentUser.name,
                    // // reciever: from.email,
                    // recipient: to,
                    // mode: CHAT_TEXT,
                    // type: to.length > 1 ? CHAT_GROUP : CHAT_SINGLE,
                    // message: input,
                    // group_id: chatter?.group_id,
                    // created_at: Date()
                };

                socket?.emit("senderMessage", sockData)
                setUploadShow(false)
            }
        })
    }


    return (
        <>
            <Modal show={uploadShow} onHide={handleUploadClose} centered size="lg">
                <ToastContainer />
                <div className="addMemberForm">
                    <button title='upload' className='closeModal' onClick={handleUploadClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>

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
                                    <p><span>Click to upload</span> or drag and drop</p>
                                </div>
                                <input title='file drop' type="file" value="" onChange={onFileDrop} />
                            </div>
                            {uploadedFiles && uploadedFiles.map((file, index) =>
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

                            <div className="uploadBtn">
                                {uploadedFiles && uploadedFiles.length === 0 ? <button className='btn noFile' type='submit'>Save</button>
                                    : <button className='btn save' type='submit' onClick={addFiles}>Send File</button>}

                            </div>
                        </Col>
                    </Row>


                </div>
            </Modal>
        </>
    )
}

export default UploadFileForChat