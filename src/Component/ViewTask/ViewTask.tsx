import React, { useState, useEffect } from "react";
import { Col, Container, Dropdown, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import taskIcon from "../../Assets/Images/icon/viewTask.svg";
import "react-quill/dist/quill.snow.css";
import attachment from "../../Assets/Images/icon/attachment.svg";
import downArrow from "../../Assets/Images/icon/chevron-down.svg";
import { getSingleTask, updateStatus } from "../../api/task";
import { DESKIE_API as API } from "../../config";
import editPen from "../../Assets/Images/icon/edit-01.svg";
import memberIcon from "../../Assets/Images/icon/memberAvatar.svg";
import { convertBytesToSize } from "../../CommonFunction/Function";
import featureImage from "../../Assets/Images/icon/feature-image.svg";
import downloadImage from "../../Assets/Images/icon/download-01.svg";
import moment from "moment";
import descriptionIcon from "../../Assets/Images/icon/align-left 1.svg";
import { toast } from "react-toastify";

interface ViewTaskProps {
  handleTaskClose: () => void;
  taskShow: boolean;
  setTaskShow: (type: boolean) => void;
  taskId: string;
  setTaskEditShow: (type: boolean) => void;
}

const ViewTask = ({
  taskShow,
  taskId,
  setTaskShow,
  handleTaskClose,
  setTaskEditShow,
}: ViewTaskProps) => {
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState<any>(new Date());
  const [title, setTitle] = useState("");
  const [taskImage, setTaskImage] = useState("");
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [createDate, setCreateDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [taskSize, setTaskSize] = useState("");
  const [createdByRole, setCreatedByRole] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    getSingleTask(taskId).then((data) => {
      if (data.statusCode === 200) {
        setContent(data.data.description);
        setTitle(data.data.title);
        setTaskImage(data.data.task_image);
        setDueDate(data.data.dueDate);
        setCreateDate(data.data.created_at);
        setAssignedMembers(JSON.parse(data.data.assigned_member_data));
        setCreatedBy(data.data.created_by_info);
        setTaskSize(data.data.image_size);
        setCreatedByRole(data.data.created_by_role);
        setStatus(data.data.status);
      }
    });
  }, [taskId]);

  const downloadFile = async () => {
    const imageUrl = `${API}/${taskImage}`;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = taskImage;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const editTask = () => {
    setTaskShow(false);
    setTaskEditShow(true);
  };

  const handleStatusChange = async (status: string) => {
    await updateStatus(taskId, { status: status }).then((data) => {
      toast.success("Task status Change Successfully !!");
      setStatus(status);
    });
  };
  return (
    <>
      <Modal show={taskShow} onHide={handleTaskClose} centered size="lg">
        <div className="addMemberForm" style={{ paddingBottom: "29px" }}>
          <button className="closeModal" onClick={handleTaskClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Container className="px-0">
            <Row>
              <Col md={12}>
                <div className="viewTask">
                  <div className="taskHeading">
                    <img src={taskIcon} alt="taskIcon" />
                    <div className="">
                      <h5>{title}</h5>
                      <p style={{ fontWeight: "400", color: "#98A2B3AA" }}>
                        {moment(createDate).format("MMMM D, YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className="editTask">
                    <button onClick={editTask}>
                      <img src={editPen} alt="editPen" />
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="taskOptionView">
                  <div className="taskOption">
                    <h6>ASSIGNED TO</h6>
                    <div className="taskMember mt-2">
                      {assignedMembers && assignedMembers.length ? (
                        <>
                          {assignedMembers &&
                            assignedMembers.map((data: any, index: number) => (
                              <>
                                {data.image ? (
                                  <img
                                    className={`${
                                      data?.role === "admin"
                                        ? "adminBorder"
                                        : ""
                                    }`}
                                    key={index}
                                    src={`${API}/${data.image}`}
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    className={`${
                                      data?.role === "admin"
                                        ? "adminBorder"
                                        : ""
                                    } default`}
                                    src={memberIcon}
                                    alt="task"
                                  />
                                )}
                              </>
                            ))}
                        </>
                      ) : (
                        <p>No assign</p>
                      )}
                    </div>
                  </div>
                  <div className="taskOption">
                    <h6>DUE DATE</h6>
                    <div className="taskMember mt-2">
                      <div className="dueDate">
                        {moment(dueDate).format("MMMM D, YYYY")}
                      </div>
                    </div>
                  </div>
                  <div className="taskOption">
                    <h6>CREATED BY</h6>
                    <div className="taskMember mt-2">
                      {createdBy ? (
                        <img
                          className={`${
                            createdByRole === "admin" ? "adminBorder" : ""
                          }`}
                          src={`${API}/${createdBy}`}
                          alt=""
                        />
                      ) : (
                        <img
                          className={`${
                            createdByRole === "admin" ? "adminBorder" : ""
                          } default`}
                          src={memberIcon}
                          alt="task"
                        />
                      )}
                    </div>
                  </div>
                  <div className="taskOption">
                    <h6>STATUS</h6>
                    <div className="filterDropdown taskDropdown">
                      <Dropdown>
                        <Dropdown.Toggle>
                          <button className="filterBtn">
                            {status} <img src={downArrow} alt="down" />{" "}
                          </button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="px-2">
                          <Dropdown.Item
                            onClick={() => {
                              handleStatusChange("PENDING");
                            }}
                          >
                            Pending
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              handleStatusChange("DOING");
                            }}
                          >
                            Doing
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              handleStatusChange("DONE");
                            }}
                          >
                            Done
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className="descriptionTask">
                  <h6>
                    <img src={descriptionIcon} alt="attachment" />
                    Description
                  </h6>
                  <div
                    className="description"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>

                {taskImage ? (
                  <div className="attachmentFiles">
                    <h6>
                      <img src={attachment} alt="attachment" />
                      Attachments
                    </h6>
                    <div className="taskFilesView">
                      <div className="fileFormat">
                        <img
                          className="rounded-5 default"
                          src={featureImage}
                          alt="file"
                        />
                      </div>
                      <div className="fileName">
                        <p>{taskImage}</p>
                        <span>{convertBytesToSize(taskSize)}</span>
                      </div>
                      <div
                        className="fileDelete"
                        onClick={() => downloadFile()}
                      >
                        <img src={downloadImage} alt="trash" /> Download
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Container>
        </div>
      </Modal>
    </>
  );
};

export default ViewTask;
