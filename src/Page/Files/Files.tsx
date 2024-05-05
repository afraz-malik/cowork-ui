import React, { useState, useEffect } from 'react';
import Layout from '../../Component/Layout/Layout';
import "./Files.css";
import sketch from "../../Assets/Images/icon/sketch(1).png";
import file from "../../Assets/Images/icon/file-05.png";
import figma from "../../Assets/Images/icon/figma.png";
import imageFile from "../../Assets/Images/icon/image-03.png";
import avatar from "../../Assets/Images/icon/tableAvatar.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowUp, faPen, faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Table } from 'react-bootstrap';
import { DESKIE_API as API } from '../../config';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import filter from '../../Assets/Images/icon/filter-lines.png';
import download from "../../Assets/Images/icon/download-cloud-02.png";
import deleteIcon from "../../Assets/Images/icon/trash-02.png";
import star from "../../Assets/Images/icon/star-01.png";
import markStar from "../../Assets/Images/icon/star-01(1).png";
import UploadFile from '../../Component/UploadFile/UploadFile';
import { favoriteFile, filesDelete, getFavoriteList, getFilesList } from '../../api/files';
import { convertBytesToSize, separateComma } from '../../CommonFunction/Function';
import moment from 'moment';
import imgExtension from "../../Assets/Images/icon/feature-image.png";
import fileExtension from "../../Assets/Images/icon/feature-file.png";
import videoExtension from "../../Assets/Images/icon/feature-video.png";
import unknownExtension from "../../Assets/Images/icon/feature-unknown.png";
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { getMemberList } from '../../api/member';
import ShareFile from '../../Component/UploadFile/ShareFile';
import DeleteModal from '../../Component/DeleteModal/DeleteModal';
import memberIcon from "../../Assets/Images/icon/memberAvatar.png";
import Pagination from '../../Component/Pagination/Pagination';


const Files = () => {

  const [filesList, setFilesList] = useState([]);
  const [count, setCount] = useState(0);
  const [filesId, setFilesId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [member, setMember] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);
  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => setDeleteShow(false);
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

  const [shareShow, setShareShow] = useState(false);
  const handleShareClose = () => setShareShow(false);

  const fileUpload = () => {
    setUploadShow(true);
  }

  useEffect(() => {
    getFilesList(limit, page).then((data) => {
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

    getFavoriteList().then((data) => {

      if (data.statusCode !== 200) {

      }
      else {
        setFavoriteList(data.favorite);
      }
    })

  }, [uploadShow, count, shareShow, limit, page]);




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


  const shareModal = (fileId: string) => {
    setFilesId(fileId);
    setShareShow(true);
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
}, [pageCount,page])


  const nextPage = () => {
    setPage(page + 1)
    setNextButton(true)
  }

  const prevPage = () => {
    setPage(page - 1)
  }


  return (
    <>
      <Layout>
        <ToastContainer />
        <div className='mainContent'>
          <div className="files">
            <div className="text43">Favorites</div>
            <div className="file-2-parent">
              {favoriteList && favoriteList.map((favorite: any, index) =>
                <div className={getFileExtension(favorite.extension)}>
                  <div className='favorite'>
                    <img src={getFileType(favorite.extension)} alt="avatar" />
                  </div>
                  <div className="membership-agreementpdf">
                    {favorite.nick_name}.{favorite.extension}
                  </div>
                </div>)}

            </div>
          </div>
          <div className="filesTable">
            <div className="topLine">
              <div className='tableHeading'>
                <h6>All Files</h6>
              </div>
              <div className='memberSearch'>
                <div className='searchInput'>
                  <input type="text" placeholder='Search files' className='form-control' />
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <button className='filterBtn'><img src={filter} alt='filter' /> Filter</button>
                <button onClick={() => fileUpload()}><FontAwesomeIcon icon={faPlus} /> Upload File</button>
              </div>
            </div>
            <div className="filesList">
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
                  {filesList && filesList.map((file: any, index) => <tr>
                    <td><label className="tableCheckBox">
                      <div className="contactCheck">
                        <input type="checkbox" name="agreement" />
                        <span className="checkmark"></span></div>
                    </label></td>
                    <td><img src={getFileType(file.extension)} alt="avatar" /> {file.nick_name}.{file.extension}</td>
                    <td>{moment(file.created_at).format('MMMM D, YYYY')}</td>
                    <td>{convertBytesToSize(file.size)}</td>
                    {file.member_images ? <td>
                      <div className="avatars2">
                        {file.member_images && separateComma(file.member_images).map((share: any) =>
                          <>{share ? <img className="avatar-icon36" alt="" src={`${API}/${share}`} />
                            : <img className="avatar-icon36" alt="" src={memberIcon} />}</>
                        )}
                        <div className="avatar2" onClick={() => shareModal(file.id)}>
                          +
                        </div>
                      </div>
                    </td>
                      : <td className='tableAction'><button className='btn assignBtn' onClick={() => shareModal(file.id)}>Share</button></td>
                    }
                    <td className='tableAction'>
                      <button className='btn download' onClick={() => handleDownloadClick(file.name)}><img src={download} alt="download" /></button>
                      <button className='btn delete' onClick={() => fileRemove(file.id)}><img src={deleteIcon} alt="delete" /></button>
                      <button className='btn start' onClick={() => favoriteAdd(file.id)}>
                        {file.favorite === 0 ? <img src={markStar} alt="download" /> : <img src={star} alt="download" />}

                      </button>
                    </td>
                  </tr>)}
                </tbody>
              </Table>
              <Pagination paginationTitle="files" setPage={setPage} limit={limit} setLimit={setLimit} prevButton={prevButton} nextButton={nextButton} pageValue={pageValue} totalValue={totalValue} prevPage={prevPage} nextPage={nextPage} allRequestList={filesList} />
            </div>
          </div>
        </div>
        <UploadFile uploadShow={uploadShow} setUploadShow={setUploadShow} handleUploadClose={handleUploadClose} />
        <ShareFile filesId={filesId} shareShow={shareShow} setShareShow={setShareShow} handleShareClose={handleShareClose} />
        <DeleteModal deleteShow={deleteShow} deleteApi={deleteApi} handleDeleteClose={handleDeleteClose} />
      </Layout>
    </>
  )
}

export default Files