import React, { useState, forwardRef, useEffect } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import taskIcon from "../../Assets/Images/icon/task.png";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import attachment from "../../Assets/Images/icon/attachment.png";
import assign from "../../Assets/Images/icon/assign.png";
import clock from "../../Assets/Images/icon/clock.png";
import DatePicker from 'react-datepicker';
import { getSingleTask } from '../../api/task';
import { DESKIE_API as API } from '../../config';
import { singleMember } from '../../api/member';
import blankUser from '../../Assets/Images/icon/blank-profile.jpg';
import memberIcon from "../../Assets/Images/icon/memberAvatar.png";


interface ViewTaskProps {
    handleTaskClose: () => void;
    taskShow: boolean;
    setTaskShow: (type: boolean) => void;
    taskId: string;
}

const ViewTask = ({ taskShow, taskId, setTaskShow, handleTaskClose }: ViewTaskProps) => {
    const [content, setContent] = useState("");
    const [dueDate, setDueDate] = useState<any>(new Date());
    const [title, setTitle] = useState("");
    const [taskImage, setTaskImage] = useState("");
    const [assignedMembers, setAssignedMembers] = useState([]);


    var modules: any = {
        toolbar: [
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
                { align: [] }
            ],
            [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
        ]
    };

    var formats: any = [
        "header", "height", "bold", "italic",
        "underline", "strike", "blockquote",
        "list", "color", "bullet", "indent",
        "link", "align", "size",
    ];

    const handleProcedureContentChange = (content: string) => {
        setContent(content)
    };

    const dueDateChange = (date: any) => {
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        setDueDate(selectedDate)
    }

    const CustomDatePickerInput: React.FC<any> = forwardRef(({ value, onClick }, ref) => (
        <button className="taskDate" onClick={onClick}>
            {value}
            <FontAwesomeIcon icon={faChevronDown} />
        </button>
    ));

    useEffect(() => {
        getSingleTask(taskId).then((data) => {
            if (data.statusCode === 200) {
                console.log('task view', data);
                setContent(data.data.description)
                setTitle(data.data.title)
                setTaskImage(data.data.task_image)
                setDueDate(data.data.dueDate)
                setAssignedMembers(data.data.assigned_images)
            }
        })
    }, [taskId])


    return (
        <>
            <Modal show={taskShow} onHide={handleTaskClose} centered size="lg">
                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleTaskClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={taskIcon} alt="member" />
                                    <p>View Task</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <div className="taskName">
                                    <input type="text" value={title} className='form-control' placeholder='Task Title' />
                                </div>
                                <div className="taskDescription">
                                    <h6>Description</h6>
                                    <ReactQuill
                                        theme="snow"
                                        modules={modules}
                                        formats={formats}
                                        placeholder="Enter a description..."
                                        onChange={handleProcedureContentChange}
                                        value={content}
                                    />
                                </div>
                                <div className="taskOptions">
                                    <p><img src={assign} alt="assign" /> Assignee</p>
                                    <button><FontAwesomeIcon icon={faPlus} /></button>
                                </div>
                                <div className="taskMemberList">
                                    <div className="taskMember mt-2">
                                        {assignedMembers && assignedMembers.map((filePath: any, index: number) => (
                                            <>
                                                {filePath ? <img key={index} src={`${API}/${filePath}`} alt="" />
                                                    : <img src={memberIcon} alt='task' />}
                                            </>
                                        ))}
                                    </div>
                                </div>
                                <div className="taskOptions">
                                    <p><img src={clock} alt="clock" /> Due Date</p>
                                    <button><FontAwesomeIcon icon={faPlus} /></button>
                                </div>
                                <div className="dateShow">
                                    <DatePicker selected={dueDate} onChange={dueDateChange} placeholderText="Select a date" dateFormat="MM/dd/yyyy" customInput={<CustomDatePickerInput />} />
                                </div>
                                <div className="taskOptions">
                                    <p><img src={attachment} alt="attachment" /> Attachments</p>
                                    <button><FontAwesomeIcon icon={faPlus} /></button>
                                </div>
                                <div className="taskFiles mt-3">
                                    <img src={`${API}/${taskImage}`} alt="" width="250px" />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Modal>
        </>
    )
}

export default ViewTask