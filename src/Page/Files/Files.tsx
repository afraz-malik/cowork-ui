import React, { useState, useEffect } from 'react';
import Layout from '../../Component/Layout/Layout';
import "./Files.css";
import sketch from "../../Assets/Images/icon/sketch(1).png";
import file from "../../Assets/Images/icon/file-05.png";
import figma from "../../Assets/Images/icon/figma.png";
import imageFile from "../../Assets/Images/icon/image-03.png";
import upload from "../../Assets/Images/icon/upload.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Table } from 'react-bootstrap';
import { DESKIE_API as API } from '../../config';
import filter from '../../Assets/Images/icon/filter-lines.svg';
import download from "../../Assets/Images/icon/download-cloud-02.svg";
import deleteIcon from "../../Assets/Images/icon/trash-02 (1).svg";
import star from "../../Assets/Images/icon/star-01.svg";
import markStar from "../../Assets/Images/icon/star-01(1).svg";
import UploadFile from '../../Component/UploadFile/UploadFile';
import { favoriteFile, filesDelete, getFavoriteList, getFilesList } from '../../api/files';
import { convertBytesToSize, separateComma } from '../../CommonFunction/Function';
import moment from 'moment';
import imgExtension from "../../Assets/Images/icon/feature-image.svg";
import fileExtension from "../../Assets/Images/icon/feature-file.svg";
import videoExtension from "../../Assets/Images/icon/feature-video.svg";
import unknownExtension from "../../Assets/Images/icon/feature-unknown.svg";
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { getMemberList } from '../../api/member';
import ShareFile from '../../Component/UploadFile/ShareFile';
import DeleteModal from '../../Component/DeleteModal/DeleteModal';
import memberIcon from "../../Assets/Images/icon/memberAvatar.svg";
import Pagination from '../../Component/Pagination/Pagination';
import LightBox from '../../Component/LightBox/LightBox';


const Files = () => {

  const [filesList, setFilesList] = useState([]);
  const [count, setCount] = useState(0);
  const [filesId, setFilesId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [lightBoxFile, setLightBoxFile] = useState("");
  const [member, setMember] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);
  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => setDeleteShow(false);
  const [totalValue, setTotalValue] = useState<any>();
  const [limitValue, setLimitValue] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const pageCount = Math.ceil(totalValue / limitValue);
  const [prevButton, setPrevButton] = useState<boolean>(false);
  const [nextButton, setNextButton] = useState<boolean>(false);
  const [pageValue, setPageValue] = useState<number>();
  const [lightBoxShow, setLightBoxShow] = useState(false);
  const handleLightBoxClose = () => setLightBoxShow(false);
  const [uploadShow, setUploadShow] = useState(false);
  const handleUploadClose = () => setUploadShow(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [shareShow, setShareShow] = useState(false);
  const handleShareClose = () => setShareShow(false);
  const [sharesShow, setSharesShow] = useState<any>([]);
  const [shares, setShares] = useState<any>([]);
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fileUpload = () => {
    setUploadShow(true);
  }

  useEffect(() => {
    getFilesList(limit, page, filterTag).then((data) => {
      setFilesList(data && data.files);
      setTotalValue(data && data.total);
      setLimitValue(data && data.limit);
      setPageValue(data && data.page)
    });

    getMemberList(10, 1).then((data) => {
      setMember(data.members);
    })

    getFavoriteList().then((data) => {
      setFavoriteList(data.favorite);
    })

  }, [uploadShow, count, shareShow, limit, page, filterTag]);




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
    setShares([]);

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

  const lightBox = (fileName: string) => {
    setLightBoxShow(true);
    setLightBoxFile(fileName);
  }

  const filteredFiles = filesList?.filter((member: any) =>
    member.nick_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.extension.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSort = (columnName: string) => {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortOrder('asc');
    }
  };

  const sortedFiles = [...filteredFiles].sort((a:any, b:any) => {
    if (sortBy === 'name') {
      return a.nick_name.localeCompare(b.nick_name) * (sortOrder === 'asc' ? 1 : -1);
    } else if (sortBy === 'uploaded') {
      const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return (dateA.getTime() - dateB.getTime()) * (sortOrder === 'asc' ? 1 : -1);
    } else if (sortBy === 'size') {
      const sizeA = parseFloat(a.size.replace(/[^\d.]/g, '')); // Remove non-numeric characters and parse
      const sizeB = parseFloat(b.size.replace(/[^\d.]/g, '')); // Remove non-numeric characters and parse
      return (sizeA - sizeB) * (sortOrder === 'asc' ? 1 : -1);
    }
    return 0;
  });

  return (
    <>
      <Layout>
        <ToastContainer />
        <div className='mainContent'>
          <div className="files">
            <div className="text43">Favorites</div>
            <div className="file-2-parent">
              {favoriteList && favoriteList.map((favorite: any, index) =>
                <div className={getFileExtension(favorite.extension)} onClick={() => lightBox(favorite.files_upload)}>
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
                  <input type="text" placeholder='Search files' onChange={(e) => setSearchTerm(e.target.value)} className='form-control' />
                  <FontAwesomeIcon icon={faSearch} />
                </div>

                <div className='filterDropdown taskDropdown'>
                  <Dropdown>
                    <Dropdown.Toggle>
                      <button className='filterBtn'><img className='mr-2' src={filter} alt='filter' />{filterTag === "created" ? "My Files" : filterTag === "member" ? "Shared With Me" : filterTag === "all" ? "All Files" : "Filters"}</button>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={()=>setFilterTag('all')}>All Files</Dropdown.Item>
                      <Dropdown.Item onClick={()=>setFilterTag('created')}>My Files</Dropdown.Item>
                      <Dropdown.Item onClick={()=>setFilterTag('member')}>Shared With Me</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <button onClick={() => fileUpload()}><img src={upload} alt='upload' /> Upload File</button>
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
                    <th></th>
                    <th onClick={() => handleSort('name')}>Name {sortBy === "name" ? <>{sortOrder === "asc" ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}</> : "" }</th>
                    <th onClick={() => handleSort('uploaded')}>Uploaded {sortBy === "uploaded" ? <>{sortOrder === "asc" ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}</> : "" }</th>
                    <th onClick={() => handleSort('size')}>Size {sortBy === "size" ? <>{sortOrder === "asc" ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}</> : "" }</th>
                    <th>Sharing</th>
                    <th>Actions</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFiles && sortedFiles.map((file: any, index) => <tr>
                    <td><label className="tableCheckBox">
                      <div className="contactCheck">
                        <input type="checkbox" name="agreement" />
                        <span className="checkmark"></span></div>
                    </label></td>
                    <td><img className={getFileExtension(file.extension) + " mx-auto"} style={{ width: "40px" }} src={getFileType(file.extension)} alt="avatar" /></td>
                    <td onClick={() => lightBox(file.files_upload)} style={{ cursor: "pointer", fontWeight: "800" }}>{file.nick_name.length <= 23 ? file.nick_name : file.nick_name.substring(0, 20) + '...'}.{file.extension}</td>
                    <td>{moment(file.created_at).format('MMMM D, YYYY')}</td>
                    <td>{convertBytesToSize(file.size)}</td>
                    {file.member_images ? <td>
                      <div className="avatars2">
                        {file.member_images && separateComma(file.member_images).map((share: any) =>
                          <>{share === "imageNull" ? <img className="avatar-icon36 default" alt="" src={memberIcon} />
                            : <img className="avatar-icon36" alt="" src={`${API}/${share}`} />
                          }</>
                        )}
                        <div className="avatar2" onClick={() => shareModal(file.id, file.shares)}>
                          +
                        </div>
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
                    <td>
                      <button className='btn start' onClick={() => favoriteAdd(file.id)}>
                        {file.favorite === 0 ? <img src={markStar} alt="download" /> : <img src={star} alt="download" />}
                      </button>
                    </td>
                  </tr>)}
                </tbody>
              </Table>
              <Pagination page={page} paginationTitle="items" setPage={setPage} limit={limit} setLimit={setLimit} prevButton={prevButton} nextButton={nextButton} pageValue={pageValue} totalValue={totalValue} prevPage={prevPage} nextPage={nextPage} allRequestList={filesList} />
            </div>
          </div>
        </div>
        <UploadFile uploadShow={uploadShow} setUploadShow={setUploadShow} handleUploadClose={handleUploadClose} />
        <ShareFile shares={shares} setShares={setShares} sharesShow={sharesShow} setSharesShow={setSharesShow} filesId={filesId} shareShow={shareShow} setShareShow={setShareShow} handleShareClose={handleShareClose} />
        <DeleteModal deleteShow={deleteShow} deleteApi={deleteApi} handleDeleteClose={handleDeleteClose} />
        <LightBox lightBoxFile={lightBoxFile} lightBoxShow={lightBoxShow} setLightBoxShow={setLightBoxShow} handleLightBoxClose={handleLightBoxClose} />
      </Layout>
    </>
  )
}

export default Files