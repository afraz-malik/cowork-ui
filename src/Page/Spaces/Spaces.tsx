import React, { useState, useEffect } from 'react'
import { Dropdown, Table } from 'react-bootstrap';
import "./Spaces.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../Component/Layout/Layout';
import { DESKIE_API as API } from '../../config';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import AddSpace from '../../Component/AddSpace/AddSpace';
import filter from '../../Assets/Images/icon/filter-lines.png';
import { getSpacesList } from '../../api/spaces';
import editPen from "../../Assets/Images/icon/edit-01.png"
import EditSpaces from '../../Component/ViewSpaces/EditSpaces';
import AssignMember from '../../Component/AssignMember/AssignMember';
import { separateComma } from '../../CommonFunction/Function';
import { ToastContainer } from 'react-toastify';
import blankUser from "../../Assets/Images/icon/blank-profile.jpg"
import memberAvatar from "../../Assets/Images/icon/memberAvatar.png";
import spaceAvatar from "../../Assets/Images/icon/spaceAvatar.png";
import Pagination from '../../Component/Pagination/Pagination';
import { Link ,useNavigate } from 'react-router-dom';

const Spaces = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [assignShow, setAssignShow] = useState(false);
    const handleAssignClose = () => setAssignShow(false);
    const [spaces, setSpaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [spacesId, setSpacesId] = useState('');
    const [spaceId, setSpaceId] = useState('');
    const [updateShow, setUpdateShow] = useState(false);
    const handleUpdateClose = () => setUpdateShow(false);

    const [totalValue, setTotalValue] = useState<any>();
    const [limitValue, setLimitValue] = useState<any>();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState<number>(6);
    const pageCount = Math.ceil(totalValue / limitValue);
    const [prevButton, setPrevButton] = useState<boolean>(false);
    const [nextButton, setNextButton] = useState<boolean>(false);
    const [pageValue, setPageValue] = useState<number>();

    useEffect(() => {
        getSpacesList(limit, page).then((data) => {
            if (data.statusCode !== 200) {

            }
            else {
                setSpaces(data && data.spaces);
                setTotalValue(data && data.total);
                setLimitValue(data && data.limit);
                setPageValue(data && data.page)
            }
        });

    }, [show, page, totalValue, limitValue, limit, updateShow, assignShow]);

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

   

    const showResult = (value: number) => {
        setPage(1)
        setLimit(value)
    }

    // view
    const spacesView = (spacesId: string) => {
        setSpacesId(spacesId);
        return navigate(`${spacesId}`);
    }

    // update spaces
    const spacesUpdate = (spacesId: string) => {
        setSpacesId(spacesId);
        setUpdateShow(true);
    }

    // search
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredSpaces = spaces?.filter((member: any) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const assignMembers = (spacesId: string) => {
        setAssignShow(true);
        setSpaceId(spacesId);
    }

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
                    <div className="memberBox">
                        <div className="topLine">
                            <div className='tableHeading'>
                                <h6>All Assets</h6>
                            </div>
                            <div className='memberSearch'>
                                <div className='searchInput'>
                                    <input type="text" placeholder='Search assets' onChange={handleInputChange} className='form-control' />
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <button className='filterBtn'><img src={filter} alt='filter' /> Filter</button>
                                <button onClick={handleShow}><FontAwesomeIcon icon={faPlus} /> Add Asset</button>
                            </div>
                        </div>

                        <div className="spaceList">
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></th>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Rate</th>
                                        <th>Status</th>
                                        <th>Assignment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSpaces && filteredSpaces.map((data: any, index) => <tr key={`refer` + index}>
                                        <td><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></td>
                                        <td>
                                            <div className='tableImage justify-content-center'>
                                                {data.space_image ?
                                                    <img src={`${API}/${data.space_image}`} alt="avatar" style={{ objectFit: "cover", borderRadius: "50%" }} />
                                                    : <img src={spaceAvatar} alt="avatar" style={{ borderRadius: "50%" }} />
                                                } </div>
                                        </td>
                                        <td className='tableLink'><Link to={`${data.id}`}>{data.name}</Link></td>
                                        <td className='deskType'>
                                            {data.tag === "private" ? <span className='private'>Private Office</span> : ""}
                                            {data.tag === "dedicated" ? <span className='dedicated'>Dedicated Desk</span> : ""}
                                            {data.tag === "flex" ? <span className='flex'>Flex</span> : ""}
                                        </td>
                                        <td>${data.rate}/mo</td>
                                        <td className='status'>
                                            {data.member_images ? <span className='unavailable'>Unavailable</span> : <span className='available'>Available</span>}
                                        </td>
                                        <td className='tableAction'>
                                            {data.member_images ? <>
                                                <div className="memberSpacesList">
                                                    {data.member_images && separateComma(data.member_images).map((member: any) =>
                                                        <>
                                                            {member ? <img className="avatar-icon36" alt="" src={`${API}/${member}`} />
                                                                : <img className="avatar-icon36" alt="" src={memberAvatar} />
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
                                            <button className='btn view' onClick={() => spacesView(data.id)}><FontAwesomeIcon icon={faEye} /></button>
                                            <button className='btn edit' onClick={() => spacesUpdate(data.id)}><img src={editPen} alt="edit" /></button>
                                        </td>
                                    </tr>)}
                                </tbody>
                            </Table>
                            <Pagination page={page} paginationTitle="assets" setPage={setPage} limit={limit} setLimit={setLimit} prevButton={prevButton} nextButton={nextButton} pageValue={pageValue} totalValue={totalValue} prevPage={prevPage} nextPage={nextPage} allRequestList={spaces} />
                        </div>

                        <AddSpace show={show} setShow={setShow} handleClose={handleClose} />
                        <EditSpaces spacesId={spacesId} updateShow={updateShow} setUpdateShow={setUpdateShow} handleUpdateClose={handleUpdateClose} />
                        <AssignMember spaceId={spaceId} assignShow={assignShow} setAssignShow={setAssignShow} handleAssignClose={handleAssignClose} />
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Spaces