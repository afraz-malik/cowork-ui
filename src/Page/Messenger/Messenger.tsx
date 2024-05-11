
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import "./Messenger.css";
import Layout from '../../Component/Layout/Layout';
import avatar from "../../Assets/Images/icon/blank-profile.jpg";
import assign from "../../Assets/Images/icon/assign.png";
import emoji from "../../Assets/Images/icon/face-smile.png";
import fileShare from "../../Assets/Images/icon/link-01.png";
import onlineShow from "../../Assets/Images/icon/online.png";
import more from "../../Assets/Images/icon/more.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';

import FromMessage from './FromMessage';
import ToMessage from "./ToMessage"
import { SocketContext } from '../../CommonFunction/SocketContext';
import UploadFileForChat from '../../Component/UploadFile/UploadFileForChat';
import { CHATTER, USER } from '../../CommonFunction/types';
import { CHAT_GROUP, CHAT_SINGLE, CHAT_TEXT, GROUP_ICON } from '../../CommonFunction/constant';
import { getChatHistory, getChatters } from '../../api/message';
import { convertTimeToReadable, enhanceGroupUserName, enhanceToGroupUserName, formattedDateForChatHeadWithCurrent, fromNow } from "../../CommonFunction/Function";
import UsersList from '../../Component/Messenger/UserList';
import { getUsers } from '../../api/admin';
import { DESKIE_API as API } from '../../config';
import groupImage from "../../Assets/Images/icon/group.png";

const initUser = {
    email: "",
    name: "",
    avatar: "",
    role: "",
    online_status: 0,
}

interface MSG {
    sender: string,
    recipient: string,
    message: string,
    type: boolean,
    mode: boolean,
    file_path: string,
    created_at: string,
}

const Messenger = () => {
    const dropdownContent = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<MSG[]>([]);
    const [input, setInput] = useState<string>('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [users, setUsers] = useState<CHATTER[]>([])
    const [toUsers, setToUsers] = useState<USER[]>([]) // users to be showed in the dropdown
    const [dropdownUsers, setDropdownUsers] = useState<USER[]>([])
    const [currentUser, setCurrentUser] = useState<USER>(initUser)
    const [chatter, setChatter] = useState<CHATTER | null>(null) // chatter  
    const [to, setTo] = useState<USER[]>([]) // users to be showed in the "To" menu
    const [showDropdown, setShowDropdown] = useState(false)

    const [uploadShow, setUploadShow] = useState(false);
    const handleUploadClose = () => setUploadShow(false);

    const navigate = useNavigate()
    const socket = useContext(SocketContext);
    // const socket = useRef<Socket | null>(null);

    // handle to show the dropdown 
    const closeDropdown = (e: MouseEvent) => {
        if (dropdownContent.current && !dropdownContent.current.contains(e.target as Node)) {
            setShowDropdown(false)
        }
    }

    // handle to click the to users item
    const handleToUser = (user: USER) => {
        setDropdownUsers((prev) => prev.filter((e, i) => e !== user))
        setTo((prev) => [...prev, user])
    }

    // handle to click cancel of the to users
    const handleCancelToUsers = (user: USER) => {
        setDropdownUsers((prev) => [...prev, user])
        setTo((prev) => prev.filter((e, i) => e !== user))
    }

    useEffect(() => {
        document.addEventListener("mousedown", closeDropdown)
        return () => {
            document.removeEventListener("mousedown", closeDropdown)
        }
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages, input]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const messageStart = () => {
        if (!input.trim()) return

        if (to.length === 0) {
            alert("Please select the receiver")
            return
        }
        // setChatMessage(prevMessages => [...prevMessages, input]);
        const sockData = {
            sender: currentUser.email,
            name: currentUser.name,
            // reciever: from.email,
            recipient: to,
            mode: CHAT_TEXT,
            type: to.length > 1 ? CHAT_GROUP : CHAT_SINGLE,
            message: input,
            group_id: chatter?.group_id,
            created_at: Date()
        }

        socket?.emit("senderMessage", sockData)
        // if (to.length > 1) handleFromSet(null)
        setInput('');
    }

    // handle for clicking the "Enter"
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") messageStart()
    }


    // handle to click the receivers
    const handleFromSet = (e: CHATTER | null) => {
        if (e) {
            setChatter(e)
            const user = { email: e.recipient, avatar: e.avatar, name: e.name, role: e.role, online_status: 1 }
            setTo([user])
            // setToUsers(users.filter((user, i) => user !== e))
        } else {
            setChatter(null)
            setMessages([])
            setTo([])

            setDropdownUsers(toUsers)

            setShowDropdown(true)
        }
        // bring the chat history & set the message pool
    }

    const updateContacts = async () => {
        const company = localStorage.getItem("company")
        if (!!company) {
            const storage = await JSON.parse(company)
            // set chatters that have chatted before
            const chatters = await getChatters(storage.user.email)
            setUsers(chatters)

            // set users that can send msg
            const chattersEmail = chatters.map((e: any, i: number) => e.recipient)
            const tempUsers = await getUsers()
            const tusers = tempUsers.filter((e: any, i: number) => (e.email !== storage.user.email) && !chattersEmail.includes(e.email))
            setToUsers(tusers)
        }
    }

    const handleToReceiveSocket = async (payload: any) => {
        const single = chatter && !payload.group_id && chatter.recipient === payload.sender
        const group = chatter && payload.group_id && chatter.group_id === payload.group_id
        if (single || group) {
            setMessages((prev) => [...prev, payload])
        }
        await updateContacts()
    }

    const handleToSenderSocket = async (payload: any) => {
        if (!chatter) {
            const tchatter = payload as CHATTER
            const chatter = { ...tchatter, avatar: payload.avatar ? payload.avatar : GROUP_ICON }
            const tuser = {
                email: payload.recipient,
                name: payload.name ? payload.name : payload.group_name,
                role: payload.role,
                group_id: payload.group_id,
                online_status: 1,
                avatar: payload.avatar ? payload.avatar : GROUP_ICON
            }
            setChatter(chatter)
            setTo([tuser])
        }
        updateContacts()
        setMessages((prev) => [...prev, payload])
        // await updateContacts()
    }

    useEffect(() => {
        socket.off("toSender");
        socket.off("toReciever");

        socket.on("toSender", async (payload) => {
            await handleToSenderSocket(payload)
        });

        socket.on("toReciever", async (payload: any) => {
            await handleToReceiveSocket(payload)
        });

        if (!chatter) return;

        const fetchData = async () => {

            let overload = {
                from: chatter?.sender,
                to: chatter?.recipient,
                group_id: chatter?.group_id
            }

            const payload = await getChatHistory(overload)

            // setMessages((prev)=>[...prev, payload.data])
            setMessages(payload.data)

        }

        fetchData();


    }, [chatter])

    useEffect(() => {
        async function fetchData() {
            const company = localStorage.getItem("company")
            if (!!company) {
                const storage = await JSON.parse(company)
                setCurrentUser(storage.user);

                await updateContacts()

                socket.emit("userLogin", storage.user);

                socket.on("online", (payload: any) => {
                    socket?.emit("changeOnlineStatus", { email: payload.email })
                });

                socket.on("userOnline", async (payload: any) => {
                    await updateContacts()
                });

                socket.on("userOffline", async (payload: any) => {
                    await updateContacts()
                });

                socket.on("toReciever", async (payload: any) => {
                    await handleToReceiveSocket(payload)
                });

                socket.on("toSender", async (payload) => {
                    await handleToSenderSocket(payload)
                });

            } else {

                navigate("/login");
                return
            }
        }

        fetchData();

    }, [])

    return (
        <Layout>
            <div className='mainContent'>
                <div className="chat">
                    <div className="contacts">
                        <div className="all-messages-parent">
                            <div className="all-messages">All Messages</div>
                            <div className="button">
                                {/* <img className="info-circle-icon" alt="" src={plusBtn} /> */}
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                        </div>
                        <div className="contacts-child" />
                        <div className="contact">
                            <div className={"contact1 " + (!chatter ? "chatter-select" : "")} onClick={() => handleFromSet(null)}>
                                <div className="avatar-parent">
                                    <div className="avatar">
                                        <img className="avatar-icon1" alt="" src={assign} />
                                    </div>
                                    <div className="text">
                                        <div className="bogdan-krivenchenko">New Message</div>
                                    </div>
                                </div>
                            </div>
                            {users.map((e, i) =>
                            (<div className={"contact1 " + ((!e.group_id && (e.recipient === chatter?.recipient)) || (e.group_id && (e.group_id === chatter?.group_id)) ? "chatter-select" : "")} key={i}>
                                {/* <>{e.group_id}</> */}
                                <div className="avatar-parent"
                                    onClick={() => handleFromSet(e)}>
                                    <div className="avatar">
                                        {/* <img className="avatar-icon1" alt="" src={`${API}/image/avatar/${e.avatar}`} /> */}
                                        {e.avatar ? <img className="avatar-icon1" alt="" src={`${API}/${e.avatar}`} />
                                            : <img className="avatar-icon1" alt="" src={avatar} />}

                                        {e.online_status ? (<div className="avatar-online-indicator">
                                            <img alt="" src={onlineShow} />
                                        </div>) : ""}
                                    </div>
                                    <div className="text">
                                        <div className="bogdan-krivenchenko">{e.group_id ? enhanceGroupUserName(e.name!) : e.name}</div>
                                        <div className="hi-how-are">
                                            {e.message}
                                        </div>
                                    </div>
                                </div>
                                <div className="parent">
                                    <div className="div16">{convertTimeToReadable(e.created_at)}</div>
                                    <div className="ellipse" />
                                </div>
                            </div>)
                            )}
                        </div>
                    </div>
                    <div className="chat1">
                        <div className="user-header dropdown">
                            {showDropdown ?
                                <div className="dropdown-content" ref={dropdownContent}>
                                    {dropdownUsers.map((e, i) => ( // dropdown
                                        <div className='item avatar1' onClick={() => handleToUser(e)}>
                                            {e.avatar ? <img className='avatar-icon1' src={`${API}/${e.avatar}`} alt='' width={"48px"} />
                                                : <img className='avatar-icon1' src={avatar} alt='' width={"48px"} />
                                            }

                                            <div className='label'>{e.name}</div>
                                        </div>
                                    ))}
                                </div> : <></>}
                            {to.length === 1 ? to.map((e, i) => (
                                <div className="user-parent">
                                    <div className="user">
                                        <div className="avatar-parent6">
                                            <div className="avatar1">
                                                {e.avatar ? <img className="avatar-icon1" alt="" src={`${API}/${e.avatar}`} />
                                                    : <img className="avatar-icon1" alt="" src={avatar} />
                                                }
                                                <div className="avatar-online-indicator">
                                                    <img alt="" src={"onlineShow"} />
                                                </div>
                                            </div>
                                            <div className="dropdown">
                                            <div className="sarah-kline">{e.name && e.role === "group" ? enhanceToGroupUserName(e.name) : e.name}</div>
                                                <div className="member">{e.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <img className="more-icon" alt="" src={more} />
                                </div>)) : (
                                <div className="div-1">
                                    <div className="div-2">To:
                                    </div>

                                    {to ? to.map((e, i) => (<div className="div-3">
                                        {e.avatar ? <img className="img" alt="" src={`${API}/${e.avatar}`} />
                                            : <img className="img" alt="" src={avatar} />
                                        }
                                        <div className="div-4">{e.name}</div>
                                        <img
                                            onClick={() => handleCancelToUsers(e)}
                                            alt=''
                                            // loading="lazy"
                                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c96975ae083222964c83f8a433cc705fcd29254bae86a76c45c56676067976ea?"
                                            className="img-2"
                                        />
                                    </div>)) : (<></>)}

                                </div>
                            )}

                        </div>
                        <div className="chat2" ref={chatContainerRef}>
                            <div className="friday-january-26th-parent">
                                {messages.length ? <></> : <div className="friday-january-26th">{formattedDateForChatHeadWithCurrent()}</div>}
                                {!chatter ? <UsersList to={to} /> : <></>}
                                {/* {chatter && to.length < 2 ? messages.map((e, i) => { */}
                                {chatter ? messages.map((e, i) => {
                                    return e.sender === currentUser.email ? <ToMessage key={i} {...e} online_status={true} avatar={currentUser.avatar} /> :
                                        <FromMessage key={i} {...e} online_status={chatter?.online_status} avatar={chatter?.avatar} />
                                }) : <></>}
                            </div>
                            <div className="avatar-parent7">
                                {/* <img className="avatar-icon" alt="" src={`${API}/image/avatar/${currentUser.avatar}`} /> */}

                                {currentUser.avatar ? <img className="avatar-icon" alt="" src={`${API}/${currentUser.avatar}`} />
                                    : <img className="avatar-icon" alt="" src={avatar} />
                                }
                                <div className="input-field">
                                    <div className="input-with-label">
                                        <div className="label1">Email Address</div>
                                        <div className="input">
                                            <img
                                                className="search-md-icon"
                                                alt=""
                                                src="/searchmd.svg"
                                            />
                                            <div className="content3">
                                                <textarea className="text9 form-control"
                                                    value={input}
                                                    onKeyDown={handleKeyPress}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    placeholder='Send a message...' />
                                            </div>
                                            <FontAwesomeIcon className="info-circle-icon" onClick={messageStart} icon={faPaperPlane} />
                                            <img
                                                className="info-circle-icon"
                                                alt=""
                                                src={emoji}
                                            />
                                            <img
                                                onClick={() => setUploadShow(true)}
                                                className="info-circle-icon"
                                                alt=""
                                                src={fileShare}
                                            />
                                        </div>
                                    </div>
                                    <div className="hint-text">
                                        This is a hint text to help user.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <UploadFileForChat chatter={chatter} from={currentUser} to={to} uploadShow={uploadShow} setUploadShow={setUploadShow} handleUploadClose={handleUploadClose} />
        </Layout>
    )
}

export default Messenger