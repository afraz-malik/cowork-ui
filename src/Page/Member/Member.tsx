import React, { useState, useEffect } from 'react'
import AddMember from '../../Component/AddMember/AddMember';
import { Dropdown, Table } from 'react-bootstrap';
import { getMemberList } from '../../api/member';
import "./Member.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowUp, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../Component/Layout/Layout';
import { DESKIE_API as API } from '../../config';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import ViewMember from '../../Component/ViewMember/ViewMember';
import editPen from "../../Assets/Images/icon/edit-01.png";
import EditMember from '../../Component/ViewMember/EditMember';
import { separateComma } from '../../CommonFunction/Function';
import AssignSpaces from '../../Component/AssignSpaces/AssignSpaces';
import { ToastContainer } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import memberAvatar from "../../Assets/Images/icon/memberAvatar.png";
import spaceAvatar from "../../Assets/Images/icon/spaceAvatar.png";
import Pagination from './../../Component/Pagination/Pagination';
import { Link,useNavigate } from 'react-router-dom';


const Member = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [memberShow, setMemberShow] = useState(false);
  const handleMemberClose = () => setMemberShow(false);
  const handleMemberShow = () => setMemberShow(true);
  const [memberId, setMemberId] = useState("");
  const [member, setMember] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignShow, setAssignShow] = useState(false);
  const handleAssignClose = () => setAssignShow(false);
  const [updateShow, setUpdateShow] = useState(false);
  const handleUpdateClose = () => setUpdateShow(false);
  const handleUpdateShow = () => setUpdateShow(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(6);
  const [allCheck, setAllCheck] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [limitValue, setLimitValue] = useState<number>(0);
  const pageCount = Math.ceil(totalValue / limitValue);
  const [prevButton, setPrevButton] = useState<boolean>(false);
  const [nextButton, setNextButton] = useState<boolean>(false);
  const [pageValue, setPageValue] = useState<number>();

  useEffect(() => {
    getMemberList(limit, page).then((data) => {
      if (data.statusCode !== 200) {

      }
      else {
        setMember(data.members);
        setTotalValue(data.total)
        setLimitValue(data.limit)
        setPageValue(data.page)
      }
    })
  }, [show, updateShow, assignShow, limit, page]);

  // member info view
  const memberView = (memberId: string) => {
    setMemberId(memberId);
    return navigate(`${memberId}`);
  }
  // member update view
  const memberUpdate = (memberId: string) => {
    setMemberId(memberId);
    setUpdateShow(true);
  }
  // search member
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMembers = member.filter((member: any) =>
    member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assignMembers = (spacesId: string) => {
    setAssignShow(true);
    setMemberId(spacesId);
    // setSpaceId(spacesId);
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
    setAllCheck(false)
    setResult([])
    setPage(page + 1)
    setNextButton(true)
  }

  const prevPage = () => {
    setAllCheck(false)
    setResult([])
    setPage(page - 1)
  }



  return (
    <>
      <Layout>
        <ToastContainer />
        <div className='mainContent'>
          <div className="memberBox">
            <div className="topLine">
              <div className='tableHeading'>
                <h6>All Members</h6>
              </div>
              <div className='memberSearch'>
                <div className='searchInput'>
                  <input type="text" placeholder='Search member' onChange={handleInputChange} className='form-control' />
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <button onClick={handleShow}><FontAwesomeIcon icon={faPlus} /> Add Member</button>
              </div>
            </div>

            <div className="memberList">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th><label className="tableCheckBox">
                      <div className="contactCheck">
                        <input type="checkbox" name="agreement" />
                        <span className="checkmark"></span></div>
                    </label></th>
                    <th>Name <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th className='text-center'>Assignment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((data: any, index) => <tr key={`refer` + index}>
                    <td><label className="tableCheckBox">
                      <div className="contactCheck">
                        <input type="checkbox" name="agreement" />
                        <span className="checkmark"></span></div>
                    </label></td>
                    <td className='tableLink'>
                      <Link className='tableImage' to={`${data.id}`}>
                        {data.member_image ?
                          <><img src={`${API}/${data.member_image}`} alt="avatar" style={{ borderRadius: "50%", objectFit: "cover" }} /> {data.first_name} {data.last_name}</>
                          : <><img src={memberAvatar} alt="avatar" style={{ borderRadius: "50%" }} /> {data.first_name} {data.last_name}</>
                        }
                      </Link>
                    </td>
                    <td>{data.email}</td>
                    <td className='memberPhone'><PhoneInput country={'us'} disableCountryCode={false} value={data.phone_number} /></td>
                    <td className='tableAction text-center'>
                      {data.space_images ? <>
                        <div className="memberSpacesList">
                          {data.space_images && separateComma(data.space_images).map((member: any) =>
                            <>
                              {member ? <img className="avatar-icon36" alt="" src={`${API}/${member}`} />
                                : <img className="avatar-icon36" alt="" src={spaceAvatar} />
                              }
                            </>
                          )}
                          <div className="plusMember" onClick={() => assignMembers(data.id)}>
                            <FontAwesomeIcon icon={faPlus} />
                          </div>
                        </div>
                      </>
                        : <button className='btn assign' onClick={() => assignMembers(data.id)}>Assign</button>
                      }
                    </td>
                    <td className='tableAction'>
                      <button className='btn view' onClick={() => memberView(data.id)}><FontAwesomeIcon icon={faEye} /></button>
                      <button className='btn edit' onClick={() => memberUpdate(data.id)}><img src={editPen} alt="edit" /></button>
                    </td>
                  </tr>)}
                </tbody>
              </Table>
              <Pagination paginationTitle="members" setPage={setPage} limit={limit} setLimit={setLimit} prevButton={prevButton} nextButton={nextButton} pageValue={pageValue} totalValue={totalValue} prevPage={prevPage} nextPage={nextPage} allRequestList={member} />
            </div>
            <AddMember show={show} setShow={setShow} handleClose={handleClose} />
            <EditMember memberId={memberId} updateShow={updateShow} setUpdateShow={setUpdateShow} handleUpdateClose={handleUpdateClose} />
            <AssignSpaces memberId={memberId} assignShow={assignShow} setAssignShow={setAssignShow} handleAssignClose={handleAssignClose} />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Member