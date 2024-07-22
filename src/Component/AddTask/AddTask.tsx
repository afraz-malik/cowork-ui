import React, { useState, forwardRef, useRef, useEffect } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faClose,
  faPlus,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import taskIcon from "../../Assets/Images/icon/task.png";
import { DESKIE_API as API } from "../../config";
import "./AddTask.css";
import attachment from "../../Assets/Images/icon/attachment.png";
import assign from "../../Assets/Images/icon/assign.png";
import clock from "../../Assets/Images/icon/clock.png";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker from "react-datepicker";
import UploadTask from "./UploadTask";
import uploadFile from "../../Assets/Images/icon/uploadIcon.png";
import fileFormat from "../../Assets/Images/icon/file-05.png";
import { convertBytesToSize } from "../../CommonFunction/Function";
import trash from "../../Assets/Images/icon/red-trash.png";
import { getMemberList, searchMember } from "../../api/member";
import { showNotifications } from "../../CommonFunction/toaster";
import { v4 as uuidv4 } from "uuid";
import { taskAdd } from "../../api/task";
import memberIcon from "../../Assets/Images/icon/memberAvatar.png";
import DateCalender from "../DateCalender/DateCalender";

interface AddTaskProps {
  handleClose: () => void;
  show: boolean;
  setShow: (type: boolean) => void;
  status: string;
}

const AddTask = ({ show, setShow, status, handleClose }: AddTaskProps) => {
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState<any>(
    new Date().setDate(new Date().getDate() + 1)
  );
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [shares, setShares] = useState<any>([]);
  const [shareMember, setShareMember] = useState<any>([]);
  const [uploadShow, setUploadShow] = useState(false);
  const handleUploadClose = () => setUploadShow(false);
  const [isActive, setIsActive] = useState(false);
  const [searchMembers, setSearchMembers] = useState("");
  const [memberImage, setMemberImage] = useState("");

  useEffect(() => {
    getMemberList(20, 1).then((data) => {
      if (data.statusCode !== 200) {
      } else {
        setMembers(data.members);
      }
    });
  }, [searchMembers]);

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
        { align: [] },
      ],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
      ],
    ],
  };

  var formats: any = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "align",
    "size",
  ];

  const handleProcedureContentChange = (content: string) => {
    setContent(content);
  };

  const dueDateChange = (date: any) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    setDueDate(selectedDate);
  };

  const CustomDatePickerInput: React.FC<any> = forwardRef(
    ({ value, onClick }, ref) => (
      <button className="taskDate" onClick={onClick}>
        {value}
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
    )
  );

  // add files
  const wrapperRef = useRef<HTMLInputElement>(null);
  const onFileDrop = (event: any) => {
    const imageFile = event.target.files && event.target.files[0];
    setFile(event.target.files[0]);
    setUploadedFiles([imageFile]);
  };

  // remove file
  const removeFile = () => {
    setUploadedFiles([]);
  };

  const shareList = (share: any) => {
    const shareExists = shares.some(
      (existingShare: any) => existingShare === share.id
    );
    const shareExistsMember = shareMember.some(
      (existingShare: any) => existingShare.id === share.id
    );
    if (!shareExists) {
      setShares([...shares, share.id]);
    } else {
      const updatedShares = shares.filter(
        (existingShare: any) => existingShare !== share.id
      );
      setShares(updatedShares);
    }
    if (!shareExistsMember) {
      setShareMember([...shareMember, share]);
    } else {
      const updatedShareMembers = shareMember.filter(
        (existingShare: any) => existingShare.id !== share.id
      );
      setShareMember(updatedShareMembers);
    }
  };

  const taskCrete = () => {
    let task = {
      id: uuidv4(),
      status: status,
      title: title,
      description: content,
      assign: `${shares}`,
      task_image: file,
      dueDate: dueDate,
    };

    taskAdd(task).then((data) => {
      showNotifications("success", "Task add successfully!!");
      setShow(false);
      setShareMember([]);
      setShares([]);
      setMembers([]);
      setContent("");
    });
  };

  const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMembers(e.target.value);
  };

  const filteredMembers = members?.filter(
    (member: any) =>
      member.first_name.toLowerCase().includes(searchMembers.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchMembers.toLowerCase()) ||
      member.email.toLowerCase().includes(searchMembers.toLowerCase())
  );
  const selectMember = (member: any) => {
    // setSelectName(`${member.first_name} ${member.last_name}`);
    // setSelectEmail(member.email)
    // setMemberId(member.id)
    setMemberImage(member.member_image);
  };

  const handleTodayClick = () => {
    setDueDate(new Date());
  };

  const handleYesterdayClick = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDueDate(yesterday);
  };

  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => (
    <div>
      <div className="calenderHeading">
        <button
          className="arrowLeft"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className="calenderDate">
          {date.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <button
          className="arrowRight"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className="calenderBtn">
        <button onClick={handleYesterdayClick}>Yesterday</button>
        <button onClick={handleTodayClick}>Today</button>
      </div>
    </div>
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <div className="addMemberForm">
          <button className="closeModal" onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Container>
            <Row>
              <Col md={12}>
                <div className="addMemberHeading">
                  <img src={taskIcon} alt="member" />
                  <p>Add Task</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="taskName">
                  <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                    placeholder="Task Title"
                  />
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
                  <p>
                    <img src={assign} alt="assign" /> Assignee
                  </p>
                  <button
                    onClick={(e) => {
                      setIsActive(!isActive);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className="taskMember mt-2 mb-2">
                  {shareMember.map((filePath: any, index: number) => (
                    <>
                      {filePath.member_image ? (
                        <img
                          key={index}
                          src={`${API}/${filePath.member_image}`}
                          alt=""
                        />
                      ) : (
                        <img src={memberIcon} alt="" />
                      )}
                    </>
                  ))}
                </div>
                <div className="assignMemberTask">
                  <div className="memberInfos assignBox">
                    <div className="dropdown">
                      <div
                        className="dropdown-content"
                        style={{ display: isActive ? "block" : "none" }}
                      >
                        <div className="assignHeading">
                          <p>
                            <img src={assign} alt="assign" /> Assignee
                          </p>
                          <button onClick={() => setIsActive(!isActive)}>
                            <FontAwesomeIcon icon={faClose} />
                          </button>
                        </div>
                        <div className="assignInput">
                          <FontAwesomeIcon icon={faSearch} />
                          <input
                            type="text"
                            placeholder="Search member"
                            onChange={handleMemberChange}
                            className="form-control"
                          />
                        </div>
                        {filteredMembers &&
                          filteredMembers.map((data: any, index) => (
                            <div className="item tableImage d-flex justify-content-between w-100">
                              <div className="d-flex align-item-center">
                                {data.member_image ? (
                                  <img
                                    src={`${API}/${data.member_image}`}
                                    alt="avatar"
                                    style={{ objectFit: "cover" }}
                                  />
                                ) : (
                                  <img src={memberIcon} alt="avatar" />
                                )}
                                <p>
                                  {data.first_name} {data.last_name}
                                </p>
                              </div>
                              <div className="memberCheck">
                                <label className="tableCheckBox">
                                  <div className="contactCheck">
                                    <input
                                      type="checkbox"
                                      name="agreement"
                                      onChange={() => shareList(data)}
                                    />
                                    <span className="checkmark"></span>
                                  </div>
                                </label>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="taskOptions">
                  <p>
                    <img src={clock} alt="clock" /> Due Date
                  </p>
                  <button>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className="dateShow">
                  <DatePicker
                    selected={dueDate}
                    onChange={dueDateChange}
                    placeholderText="Select a date"
                    dateFormat="MM/dd/yyyy"
                    customInput={<CustomDatePickerInput />}
                    renderCustomHeader={CustomHeader}
                  />
                </div>
                <div className="taskOptions">
                  <p>
                    <img src={attachment} alt="attachment" /> Attachments
                  </p>
                  <button onClick={() => setUploadShow(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className="taskFiles mt-3">
                  <div ref={wrapperRef} className="drop-file-input">
                    <div className="drop-file-input__label">
                      <img src={uploadFile} alt="" />
                      <p>
                        <span>Click to upload</span> or drag and drop
                      </p>
                    </div>
                    <input type="file" value="" onChange={onFileDrop} />
                  </div>
                  {uploadedFiles &&
                    uploadedFiles.map((file: any, index: number) => (
                      <div className="uploadFileShow">
                        <div className="fileFormat">
                          <img src={fileFormat} alt="file" />
                        </div>
                        <div className="fileName">
                          <p>{file.name}</p>
                          <span>
                            {convertBytesToSize(file.size)} – 100% uploaded
                          </span>
                        </div>
                        <div className="fileDelete" onClick={removeFile}>
                          <img src={trash} alt="trash" />
                        </div>
                      </div>
                    ))}
                </div>
                <div className="taskBtn d-flex justify-content-end">
                  <button onClick={taskCrete}>Add Task</button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <UploadTask
          setFile={setFile}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          uploadShow={uploadShow}
          setUploadShow={setUploadShow}
          handleUploadClose={handleUploadClose}
        />
      </Modal>
    </>
  );
};

export default AddTask;
