import React, { useState, useEffect } from 'react';
import Layout from '../../../Component/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'react-bootstrap';
import { DESKIE_API as API } from '../../../config';
import filter from '../../../Assets/Images/icon/filter-lines.png';
import download from "../../../Assets/Images/icon/download-cloud-02.svg";
import deleteIcon from "../../../Assets/Images/icon/trash-02.svg";
import UploadFile from '../../../Component/UploadFile/UploadFile';
import { favoriteFile, filesDelete, getFilesList } from '../../../api/files';
import { convertBytesToSize, separateComma } from '../../../CommonFunction/Function';
import moment from 'moment';
import imgExtension from "../../../Assets/Images/icon/feature-image.png";
import fileExtension from "../../../Assets/Images/icon/feature-file.png";
import videoExtension from "../../../Assets/Images/icon/feature-video.png";
import unknownExtension from "../../../Assets/Images/icon/feature-unknown.png";
import { showNotifications } from '../../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { getMemberList } from '../../../api/member';
import ShareFile from '../../../Component/UploadFile/ShareFile';
import DeleteModal from '../../../Component/DeleteModal/DeleteModal';
import memberIcon from "../../../Assets/Images/icon/memberAvatar.png";
import Pagination from '../../../Component/Pagination/Pagination';
import LightBox from '../../../Component/LightBox/LightBox';

const MyFiles = () => {

    const [filesList, setFilesList] = useState([]);
    const [selectedValue, setSelectedValue] = useState(0);
    const [count, setCount] = useState(0);
    const [filesId, setFilesId] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const [member, setMember] = useState([]);
    const [favoriteList, setFavoriteList] = useState([]);
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => setDeleteShow(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [lightBoxVisible, setLightBoxVisible] = useState(false);
    // pagination number
    const [totalValue, setTotalValue] = useState<any>();
    const [limitValue, setLimitValue] = useState<any>();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState<number>(6);
    const pageCount = Math.ceil(totalValue / limitValue);
    const [prevButton, setPrevButton] = useState<boolean>(false);
    const [nextButton, setNextButton] = useState<boolean>(false);
    const [pageValue, setPageValue] = useState<number>();
    const [uploadShow, setUploadShow] = useState(false);
    const handleUploadClose = () => setUploadShow(false);
    const [lightBoxShow, setLightBoxShow] = useState(false);
    const handleLightBoxClose = () => setLightBoxShow(false);
    const [lightBoxFile, setLightBoxFile] = useState("");
    const [shareShow, setShareShow] = useState(false);
    const handleShareClose = () => setShareShow(false);
    const [sharesShow, setSharesShow] = useState<any>([]);
    const [shares, setShares] = useState<any>([]);
    const fileUpload = () => {
        setUploadShow(true);
    }

    useEffect(() => {
        getFilesList(limit, page, "all").then((data) => {
            if (data.statusCode !== 200) {

            }
            else {
                setFilesList(data && data.files);
                setTotalValue(data && data.total);
                setLimitValue(data && data.limit);
                setPageValue(data && data.page)
            }
        });

        getMemberList(10, 1).then((data) => {

            if (data.statusCode !== 200) {

            }
            else {
                setMember(data.members);
            }
        })

    }, [uploadShow, count, shareShow, page]);




    const getFileType = (extension: string) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const videoExtensions = ['mp4', 'avi', 'mov'];
        const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];

        if (imageExtensions.includes(extension)) {
            return imgExtension;
        } else if (videoExtensions.includes(extension)) {
            return videoExtension;
        } else if (documentExtensions.includes(extension)) {
            return fileExtension;
        } else {
            return unknownExtension;
        }
    };

    const getFileExtension = (extension: string) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const videoExtensions = ['mp4', 'avi', 'mov'];
        const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];

        if (imageExtensions.includes(extension)) {
            return 'file-5 favoriteBox';
        } else if (videoExtensions.includes(extension)) {
            return 'file-4 favoriteBox';
        } else if (documentExtensions.includes(extension)) {
            return 'file-2 favoriteBox';
        } else {
            return 'file-3 favoriteBox';
        }
    };

    // delete files
    const fileRemove = (id: string) => {
        setDeleteShow(true);
        setDeleteId(id);
    }
    const deleteApi = () => {
        filesDelete(deleteId).then((data) => {
            showNotifications('success', 'Files deleted successfully');
            setCount(count + 1);
            setDeleteShow(false);
        });
    }
    // download file
    const handleDownloadClick = async (fileName: string) => {
        const imageUrl = `${API}/${fileName}`;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };

    // favorite choose
    const favoriteAdd = (id: string) => {
        favoriteFile(id).then((data) => {
            if (data.newFavorite === true) {
                showNotifications('success', 'Favorite add successfully');
            }
            else {
                showNotifications('error', 'Favorite remove successfully');
            }

            setCount(count + 1)
        });
    }

    // favorite choose
    const shareUpdate = (id: string) => {
        favoriteFile(id).then((data) => {
            if (data.newFavorite === true) {
                showNotifications('success', 'Favorite add successfully');
            }
            else {
                showNotifications('error', 'Favorite remove successfully');
            }

            setCount(count + 1)
        });
    }


    const shareModal = (fileId: string, shareList: any) => {
        setFilesId(fileId);
        setShareShow(true);
        setSharesShow(shareList);
    }
    useEffect(() => {
        if (pageCount > 1) {
            setPrevButton(true)
        }
        if (page === 1) {
            setPrevButton(false)
        }
        // next button
        if (pageCount > 1) {
            setNextButton(true)
        }
        if (pageCount === page) {
            setNextButton(false)
        }
    }, [pageCount, page])


    const nextPage = () => {
        setPage(page + 1)
        setNextButton(true)
    }

    const prevPage = () => {
        setPage(page - 1)
    }




    const filteredFiles = filesList?.filter((member: any) =>
        member.nick_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.extension.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const lightBox = (fileName: string) => {
        setLightBoxShow(true);
        setLightBoxFile(fileName);
        setLightBoxVisible(true);
    }
    const closeLightBox = () => {
        setLightBoxVisible(false);
    };
    return (
        <>
            <Layout>
                <ToastContainer />
                <div className='mainContent'>
                    <div className="myFilesTable">
                        <div className="topLine">
                            <div className='tableHeading'>
                                <h6>All Files</h6>
                            </div>
                            <div className='memberSearch'>
                                <div className='searchInput'>
                                    <input type="text" placeholder='Search files' onChange={(e) => setSearchTerm(e.target.value)} className='form-control' />
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <button className='filterBtn'><img src={filter} alt='filter' /> Filter</button>
                                <button onClick={() => fileUpload()}><FontAwesomeIcon icon={faPlus} /> Upload File</button>
                            </div>
                        </div>
                        <div className="filesList myFilesList">
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></th>
                                        <th>Name <FontAwesomeIcon icon={faArrowUp} /></th>
                                        <th>Uploaded <FontAwesomeIcon icon={faArrowUp} /></th>
                                        <th>Size <FontAwesomeIcon icon={faArrowUp} /></th>
                                        <th>Sharing</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFiles && filteredFiles.map((file: any, index) => <tr>
                                        <td><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></td>
                                        <td onClick={() => lightBox(file.files_upload)} style={{ cursor: "pointer" }}><img src={getFileType(file.extension)} alt="avatar" /> {file.nick_name}.{file.extension}</td>
                                        <td>{moment(file.created_at).format('MMMM D, YYYY')}</td>
                                        <td>{convertBytesToSize(file.size)}</td>
                                        {file.sharesList.length ? <td>
                                            <div className="avatars2">
                                                {file.sharesList.map((share: any) =>
                                                    <>{share.image === "imageNull" ? <img className="avatar-icon36 default" alt="" src={memberIcon} />
                                                        : <img className="avatar-icon36" alt="" src={`${API}/${share.image}`} />
                                                    }</>
                                                )}
                                                {file.delete ?
                                                <div className="avatar2" onClick={() => shareModal(file.id, file.shares)}>
                                                    +
                                                </div>
                                                : ""}
                                            </div>
                                        </td>
                                            : <td className='tableAction'><button className='btn assignBtn' onClick={() => shareModal(file.id, file.shares)}>Share</button></td>
                                        }
                                        <td className='tableAction'>
                                            <button className='btn download' onClick={() => handleDownloadClick(file.name)}><img src={download} alt="download" /></button>
                                            {file.delete ?
                                                <button className='btn delete' onClick={() => fileRemove(file.id)}><img src={deleteIcon} alt="delete" /></button>
                                                : ""}
                                        </td>
                                    </tr>)}
                                </tbody>
                            </Table>
                            <Pagination page={page} paginationTitle="files" setPage={setPage} limit={limit} setLimit={setLimit} prevButton={prevButton} nextButton={nextButton} pageValue={pageValue} totalValue={totalValue} prevPage={prevPage} nextPage={nextPage} allRequestList={filesList} />
                        </div>
                    </div>
                </div>
                <UploadFile uploadShow={uploadShow} setUploadShow={setUploadShow} handleUploadClose={handleUploadClose} />
                <ShareFile shares={shares} setShares={setShares} sharesShow={sharesShow} setSharesShow={setSharesShow} filesId={filesId} shareShow={shareShow} setShareShow={setShareShow} handleShareClose={handleShareClose} />
                <DeleteModal deleteShow={deleteShow} deleteApi={deleteApi} handleDeleteClose={handleDeleteClose} />
                {lightBoxVisible && <LightBox lightBoxFile={lightBoxFile} lightBoxShow={lightBoxShow} setLightBoxShow={setLightBoxShow} handleLightBoxClose={closeLightBox} />}
            </Layout>
        </>
    )
}

export default MyFiles