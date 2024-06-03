import React, { useState, useEffect, forwardRef } from 'react';
import Layout from '../../Component/Layout/Layout';
import "./Task.css";
import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight, faEllipsis, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faClock, faEye } from '@fortawesome/free-regular-svg-icons';
import arrow from "../../Assets/Images/icon/doubleArrow.png";
import AddTask from '../../Component/AddTask/AddTask';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { deleteTask, getTaskList, updateStatus } from '../../api/task';
import { DESKIE_API as API } from '../../config';
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { getDueDateStatus } from '../../CommonFunction/Function';
import DeleteModal from '../../Component/DeleteModal/DeleteModal';
import ViewTask from '../../Component/ViewTask/ViewTask';
import memberIcon from "../../Assets/Images/icon/memberAvatar.png";
import EditTask from '../../Component/ViewTask/EditTask';
import calenderIcon from "../../Assets/Images/icon/calendar.png";


interface TaskInterface {
    id: string;
    status: string;
    title: string;
    description: string;
    assign: string;
    dueDate: string;
    task_image: string;
    created_at: string;
    assigned_members: any;
}

interface Column {
    id: string;
    title: string;
    tasks: TaskInterface[];
}


const Task = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [status, setStatus] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const [taskId, setTaskId] = useState("");
    const [pendingList, setPendingList] = useState([]);
    const [doingList, setDoingList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => setDeleteShow(false);
    const [taskShow, setTaskShow] = useState(false);
    const handleTaskClose = () => setTaskShow(false);
    const [taskEditShow, setTaskEditShow] = useState(false);
    const handleEditTaskClose = () => setTaskEditShow(false);
    const [dueDate, setDueDate] = useState<any>("");

    const [sort, setSort] = useState("ASC");

    useEffect(() => {
        getTaskList("PENDING", sort).then((data) => {
            setPendingList(data)
        });
        getTaskList("DOING", sort).then((data) => {
            setDoingList(data)
        });
        getTaskList("DONE", sort).then((data) => {
            setDoneList(data)
        });
    }, [show, deleteShow, taskEditShow, sort])

    const [columns, setColumns] = useState<Column[]>([]);
    useEffect(() => {
        const initialColumns = [
            {
                id: 'PENDING',
                title: 'PENDING',
                tasks: pendingList,
            },
            {
                id: 'DOING',
                title: 'DOING',
                tasks: doingList,
            },
            {
                id: 'DONE',
                title: 'DONE',
                tasks: doneList,
            },
        ];

        // Set the initial columns
        setColumns(initialColumns);
    }, [pendingList, doingList, doneList, show, taskEditShow]);


    const addTask = (status: string) => {
        setShow(true);
        setStatus(status);
    }

    const onDragEnd = (result: any) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }
        const sourceColumn = columns.find(
            (column) => column.id === source.droppableId
        );
        const destinationColumn = columns.find(
            (column) => column.id === destination.droppableId
        );
        if (!sourceColumn || !destinationColumn || sourceColumn === destinationColumn) {
            return;
        }
        const task = sourceColumn.tasks.find((task) => task.id === draggableId);
        const newSourceTasks = [...sourceColumn.tasks];
        newSourceTasks.splice(source.index, 1);
        const newDestinationTasks = [...destinationColumn.tasks];
        newDestinationTasks.splice(destination.index, 0, task as TaskInterface);
        const newColumns = columns.map((column) => {
            if (column.id === sourceColumn.id) {
                return { ...column, tasks: newSourceTasks };
            } else if (column.id === destinationColumn.id) {
                return { ...column, tasks: newDestinationTasks };
            } else {
                return column;
            }
        });

        let statusUpdate = {
            "status": destinationColumn.id
        }
        updateStatus(draggableId, statusUpdate).then((data) => {
            showNotifications('success', "Task Change Successfully !!");
        });

        setColumns(newColumns);
    };

    // delete task
    const deleteTasks = (id: string) => {
        setDeleteId(id);
        setDeleteShow(true);
    }

    const taskRemove = () => {
        deleteTask(deleteId).then((data) => {
            showNotifications('success', data.message);
            setDeleteShow(false);
        });
    }

    // view task
    const viewTasks = (id: string) => {
        setTaskShow(true);
        setTaskId(id);
    }

    // edit task
    const EditTasks = (id: string) => {
        setTaskEditShow(true);
        setTaskId(id);
    }

    const dueDateChange = (date: any) => {
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        setDueDate(selectedDate)
    }
    const handleTodayClick = () => {
        setDueDate(new Date());
    };

    const handleYesterdayClick = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setDueDate(yesterday);
    };

    const CustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }: any) => (
        <div>
            <div className='calenderHeading'>
                <button className='arrowLeft' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}><FontAwesomeIcon icon={faChevronLeft} /></button>
                <span className='calenderDate'>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button className='arrowRight' onClick={increaseMonth} disabled={nextMonthButtonDisabled}><FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
            <div className='calenderBtn'>
                <button onClick={handleYesterdayClick}>Yesterday</button>
                <button onClick={handleTodayClick}>Today</button>
            </div>
        </div>
    );
    const [dragging, setDragging] = useState(false);
    const [mouseDown, setMouseDown] = useState(false);

    useEffect(() => {
        const handleMouseMove = () => {
            if (mouseDown) {
                setDragging(true);
            }
        };

        const handleMouseUp = () => {
            if (mouseDown && !dragging) {
                console.log('Mouse clicked!');
                viewTasks(taskId)
            }
            setMouseDown(false);
            setDragging(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [mouseDown, dragging]);
    const handleMouseDown = (taskId: string) => {
        setMouseDown(true);
        setDragging(false);
        setTaskId(taskId);
    };
    return (
        <>
            <Layout>
                <div className='mainTaskContent'>
                    <ToastContainer />
                    <Container>
                        <Row>
                            <Col md={12}>

                                <div className="allTaskFilter">
                                    <p>All Tasks</p>
                                    <div className="d-flex">
                                        <div className='filterDropdown taskDropdown'>
                                            <Dropdown>
                                                <Dropdown.Toggle>
                                                    <button className='filterBtn'><FontAwesomeIcon icon={faEye} /> All Tasks <FontAwesomeIcon icon={faChevronDown} /></button>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>All Tasks</Dropdown.Item>
                                                    <Dropdown.Item>Your Tasks</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        {/* <div className='filterDropdown'>
                                        <DatePicker placeholderText="Select a date" onChange={dueDateChange} dateFormat="MM/dd/yyyy" customInput={<CustomDateFormatInput />} renderCustomHeader={CustomHeader} />
                                        </div> */}
                                        <div className='filterDropdown taskDropdown'>
                                            <Dropdown>
                                                <Dropdown.Toggle>
                                                    <button className='filterBtn' style={{ height: "100%", marginLeft: '10px', paddingLeft: '10px' }}><img src={arrow} alt="arrow" style={{ marginRight: '7px' }} /> Due Date <FontAwesomeIcon icon={faChevronDown} /></button>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => setSort("ASC")}>Due Date (Ascending)</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => setSort("DESC")}>Due Date (Descending)</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>

                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>

                    <Container>
                        <Row>
                            <DragDropContext onDragEnd={onDragEnd}>
                                {columns && columns.map((column) => (
                                    <Col md={4}>
                                        <div className="pendingList">
                                            <div className="taskTopHeading">
                                                <p>{column.title}</p>
                                                <FontAwesomeIcon icon={faEllipsis} />
                                            </div>
                                            <Droppable droppableId={column.id}>
                                                {(provided: any) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={{
                                                            overflow: "auto",
                                                            height: 'calc(100vh - 288px)',
                                                        }}
                                                    >
                                                        {column.tasks.map((task, index) => (
                                                            <Draggable
                                                                key={task.id}
                                                                draggableId={task.id}
                                                                index={index}

                                                            >
                                                                {(provided: any) => (
                                                                    <div className="taskCard"
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        onMouseDown={() => handleMouseDown(task.id)}
                                                                    >
                                                                        <div className="taskHeading">
                                                                            <p>{task.title}</p>
                                                                            <Dropdown className='taskIcon' onMouseDown={(e) => e.stopPropagation()}>
                                                                                <Dropdown.Toggle id="dropdown-basic">
                                                                                    <FontAwesomeIcon icon={faEllipsis} />
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu>
                                                                                    <Dropdown.Item onClick={() => viewTasks(task.id)}>
                                                                                        <FontAwesomeIcon icon={faEye} /> Detail
                                                                                    </Dropdown.Item>
                                                                                    <Dropdown.Item onClick={() => EditTasks(task.id)}>
                                                                                        <FontAwesomeIcon icon={faPen} /> Edit
                                                                                    </Dropdown.Item>
                                                                                    <Dropdown.Item onClick={() => deleteTasks(task.id)}>
                                                                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                                                                    </Dropdown.Item>
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        </div>
                                                                        {task.task_image ? <div className="taskImg">
                                                                            <img src={`${API}/${task.task_image}`} alt='task' />
                                                                        </div> : ""}

                                                                        <div className="taskDate">
                                                                            <p className={getDueDateStatus(task.dueDate) === "Yesterday" ? "pastDate" : getDueDateStatus(task.dueDate) === "Today" ? "dueDate" : "futureDate"}>
                                                                                <FontAwesomeIcon icon={faClock} />
                                                                                <span>{getDueDateStatus(task.dueDate)}</span>
                                                                            </p>
                                                                        </div>
                                                                        <div className="taskMember">
                                                                            {task.assigned_members && task.assigned_members.split(',').map((filePath: any, index: number) => (
                                                                                <>
                                                                                    {filePath.trim() ? <img key={index} src={`${API}/${filePath.trim()}`} alt="" />
                                                                                        : <img src={memberIcon} alt='task' />}
                                                                                </>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        <div className="addTask">
                                                            <button onClick={() => addTask(column.title)}><FontAwesomeIcon icon={faPlus} /> Add a Task</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    </Col>
                                ))}
                            </DragDropContext>
                        </Row>
                    </Container>
                </div>
                <AddTask show={show} status={status} setShow={setShow} handleClose={handleClose} />
                <ViewTask taskShow={taskShow} setTaskShow={setTaskShow} taskId={taskId} handleTaskClose={handleTaskClose} />
                <DeleteModal deleteShow={deleteShow} deleteApi={taskRemove} handleDeleteClose={handleDeleteClose} />
                <EditTask taskEditShow={taskEditShow} setTaskEditShow={setTaskEditShow} taskId={taskId} handleEditTaskClose={handleEditTaskClose} />
            </Layout >
        </>
    )
}

export default Task