import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import folder from "../../Assets/Images/icon/folder.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getMemberList, searchMember, singleJwtMember, singleMember } from '../../api/member';
import { DESKIE_API as API } from '../../config';
import uploadFile from "../../Assets/Images/icon/uploadIcon.png";
import fileFormat from "../../Assets/Images/icon/file-05.png";
import trash from "../../Assets/Images/icon/red-trash.png";
import avatar from "../../Assets/Images/icon/Avatar.png";
import { filesAdd } from '../../api/files';
import { convertBytesToSize } from '../../CommonFunction/Function';
import { showNotifications } from '../../CommonFunction/toaster';
import { isAuthenticate } from '../../api/auth';
import memberIcon from "../../Assets/Images/icon/memberAvatar.png";
import { adminList } from '../../api/admin';
interface UploadFileProps {
    handleUploadClose: () => void;
    uploadShow: boolean;
    setUploadShow: (type: boolean) => void;
}

const UploadFile = ({ uploadShow, setUploadShow, handleUploadClose }: UploadFileProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [members, setMembers] = useState([]);
    const [nickName, setNickName] = useState("");
    const [file, setFile] = useState("");
    const [shares, setShares] = useState<any>([]);


    const [searchTerm, setSearchTerm] = useState("");
    const [userImage, setUserImage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [sharesList, setSharesList] = useState([]);
    const [loginId, setLoginId] = useState("");
    const [filteredSharesList, setFilteredSharesList] = useState([]);

    let auth = isAuthenticate();
    useEffect(() => {
        singleJwtMember(auth.token).then((data) => {
            if (data.statusCode === 200) {
                if (data.data.data.member_image) {
                    setUserImage(data.data.data.member_image);
                }
                else {
                    setUserImage(data.data.data.avatar);
                }
                setFirstName(data.data.data.first_name);
                setLastName(data.data.data.last_name);
                setUserRole(data.data.data.role);
                setLoginId(data.data.data.id);
            }
        })
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const memberData = await getMemberList(10, 1);
                const adminData = await adminList();
                let combinedData: any = [];
                if (userRole === 'admin') {
                    combinedData = [
                        ...memberData.members.map((member: any) => ({ ...member, type: 'member' })),
                    ];
                    setSharesList(combinedData);
                } else if (userRole === 'user') {
                    combinedData = [
                        ...adminData.map((admin: any) => ({ ...admin, type: 'admin' })),
                    ];
                    combinedData = combinedData.filter((item: any) => item.id !== loginId);
                    setSharesList(combinedData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userRole]);

    useEffect(() => {
        if (searchTerm) {
            const filteredData = sharesList.filter((item: any) =>
                item.first_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSharesList(filteredData);
        } else {
            setFilteredSharesList([]);
        }
    }, [searchTerm, sharesList]);

    const wrapperRef = useRef<HTMLInputElement>(null);
    const onFileDrop = (event: any) => {
        const imageFile = event.target.files && event.target.files[0];
        const fileName = imageFile.name.split('.').slice(0, -1).join('.');
        setNickName(fileName);
        if (imageFile && imageFile.size <= 26 * 1024 * 1024) { // Convert MB to bytes
            setFile(imageFile);
            if (imageFile && uploadedFiles.length === 0) {
                setUploadedFiles([imageFile]);
            }
        } else {
            showNotifications('error', 'Maximum upload size 26 MB');
        }
    }
    // remove file
    const removeFile = () => {
        setUploadedFiles([]);
    }
    const company = localStorage.getItem("company");
    const userInfo = company ? JSON.parse(company) : null;
    // add files
    const addFiles = () => {
        let files: any = {
            "id": uuidv4(),
            "name": uploadedFiles[0].name,
            "nickName": nickName,
            "extension": uploadedFiles[0].name.split('.').pop() || '',
            "size": uploadedFiles.reduce((totalSize, file) => totalSize + file.size, 0),
            "files_upload": file,
            "created_by": userInfo.user.id
        }
        if (shares) {
            const ids = shares.map((obj: any) => obj.id);
            files.shares = `${ids}`;
        }

        if (nickName.length > 0) {
            filesAdd(files).then((data) => {
                if (data.statusCode !== 201) {
                    showNotifications('error', 'SOmething wrong');
                }
                else {
                    showNotifications('success', 'Files upload successfully');
                    setUploadShow(false);
                    setUploadedFiles([]);
                    setNickName("");
                }
            })
        }

    }

    const shareList = (share: any) => {
        const shareExists = shares.some((existingShare: any) => existingShare.id === share.id);
        if (!shareExists) {
            setShares([...shares, share]);
        } else {
            showNotifications('error', 'Share already exists in the list');
        }
    }

    const removeShare = (memberId: string) => {
        setShares((prevShares: any) => prevShares.filter((item: any) => item.id !== memberId));
    }


    return (
        <>
            <Modal show={uploadShow} onHide={handleUploadClose} centered size="lg">
                <ToastContainer />
                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleUploadClose}>
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
                                    <h6>Maximum upload size <b>26 MB</b></h6>
                                </div>
                                <input type="file" value="" onChange={onFileDrop} />
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

                            <div className="fileSendInfo">
                                <div className="fileNameType">
                                    <label htmlFor="name">Filename</label>
                                    <input type='text' value={nickName} onChange={(e) => setNickName(e.target.value)} placeholder='File name' className='form-control' required />
                                </div>
                            </div>

                            <div className="sharing">
                                <p>Who has access to this file:</p>
                                <div className="adminOption">
                                    {userImage && userImage ? <img src={`${API}/${userImage}`} className={userRole === "admin" ? "adminBorder" : "adminBorderless"} alt="admin" /> : <img src={memberIcon} alt="" className={userRole === "admin" ? "adminBorder" : "adminBorderless"} />}
                                    <div className='adminName'>
                                        <p>{firstName} {lastName} (you)</p>
                                        <span>{userRole === "admin" ? "ADMIN sd" : "MEMBER"}</span>
                                    </div>
                                </div>
                                <div className="shareMember">
                                    <div className="content">
                                        <ul>
                                            <li className={userRole === "admin" ? "adminBorder" : "adminBorderless"}>{userImage && userImage ? <img src={`${API}/${userImage}`} className={userRole === "admin" ? "adminBorder" : ""} alt="admin" /> : <img src={memberIcon} alt="" />}<span>{firstName}</span><FontAwesomeIcon icon={faXmark} /> </li>
                                            {shares && shares.map((member: any) => (
                                                <li className={member.type === "admin" ? "adminBorder" : "adminBorderless"}>
                                                    {member.member_image ? <img src={`${API}/${member.member_image}`} className={member.type === "admin" ? "adminBorder" : "adminBorderless"} alt="" />
                                                        : <img src={memberIcon} alt="" className={member.type === "admin" ? "adminBorder" : "adminBorderless"} />}
                                                    <span>{member.first_name}</span>
                                                    <FontAwesomeIcon onClick={() => removeShare(member.id)} icon={faXmark} />
                                                </li>
                                            ))}
                                            <input onChange={(e) => setSearchTerm(e.target.value)} type="text" spellCheck="false" placeholder='Share this file with other members' />
                                        </ul>
                                    </div>
                                    <div>
                                        <ul className='searchMemberList'>
                                            {filteredSharesList && filteredSharesList.map((member: any, index) => (
                                                <li key={`member` + index} onClick={() => shareList(member)} className={member.type === 'admin' ? "adminBordered" : "adminBorderless"}>
                                                    {member.member_image ? <img src={`${API}/${member.member_image}`} className={member.type === "admin" ? "adminBorder" : "adminBorderless"} alt="" />
                                                        : <img src={memberIcon} alt="" className={member.type === "admin" ? "adminBorder" : "adminBorderless"} />}
                                                    <span>{member.first_name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="uploadBtn">
                                {uploadedFiles && uploadedFiles.length === 0 ? <button className='btn noFile' type='submit'>Save</button>
                                    : <button className='btn save' type='submit' onClick={addFiles}>Save</button>}


                            </div>
                        </Col>
                    </Row>


                </div>
            </Modal>
        </>
    )
}

export default UploadFile