import React, { useState, useEffect } from 'react'
import Layout from '../../Component/Layout/Layout';
import "./Announcement.css";
import postLogo from "../../Assets/Images/icon/adminIcon.png";
import blankLove from "../../Assets/Images/post/heart.png";
import message from "../../Assets/Images/post/message-dots-square.png";
import clickLove from "../../Assets/Images/post/heart(1).png";
import dotLine from "../../Assets/Images/post/dots-horizontal.png";
import avatar from "../../Assets/Images/icon/memberAvatar.png";
import uploadImage from "../../Assets/Images/post/image-03.png";
import UploadFile from './UploadFile';
import { v4 as uuidv4 } from 'uuid';
import { commentCommentReply, commentLike, commentLikeUpdate, commentReplyLike, commentReplyLikeUpdate, getPostList, likesPost, likesPostEdit, postAdd, replyComment } from '../../api/announcement';
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { DESKIE_API as API } from '../../config';
import { Dropdown } from 'react-bootstrap';
import arrow from "../../Assets/Images/icon/downArrowBlack.png";
import { singleJwtMember } from '../../api/member';
import { isAuthenticate } from '../../api/auth';
import { postComment } from './../../api/announcement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import InputEmoji from "react-input-emoji";
import { singleProfile } from '../../api/settings';

const Announcement = () => {
  const [file, setFile] = useState("");
  const [uploadShow, setUploadShow] = useState(false);
  const handleUploadClose = () => setUploadShow(false);
  const [post, setPost] = useState("");
  const [count, setCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [postList, setPostList] = useState([]);
  const [comment, setComment] = useState("");
  const [commentNext, setCommentNext] = useState("");
  const [placeholder, setPlaceholder] = useState("Write your comment");
  const [replyAdd, setReplyAdd] = useState("");
  const [replyCommentAdd, setReplyCommentAdd] = useState("");
  const [commentReply, setCommentReply] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userImage, setUserImage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [lightIconImage, setLightIconImage] = useState("");
  const [darkIconImage, setDarkIconImage] = useState("");
  let auth = isAuthenticate();

  const handleStateSelect = (id: string, state: string) => {
    setSelectedState(state);
    setRole(id);
  };

  const uploadFiles = () => {
    setUploadShow(true);
  }

  useEffect(() => {
    getPostList(auth.user.id).then((data) => {
      setPostList(data.posts);
    })
  }, [count]);


  useEffect(() => {
    singleJwtMember(auth.token).then((data) => {
      if (data.statusCode === 200) {
        if (data.data.data.member_image) {
          setUserImage(data.data.data.member_image);
        }
        else {
          setUserImage(data.data.data.avatar);
        }
        setFirstName(data.data.data.first_name);
        setLastName(data.data.data.last_name);
        if (data.data.data.role === "user") {
          setRole(data.data.data.id);
        }
        setUserRole(data.data.data.role);
        setUserId(data.data.data.id);
      }
    })

    singleProfile().then((data) => {
      if (data.statusCode === 200) {
        setCompanyName(data.data.company_name);
        setLightIconImage(data.data.company_icon_light);
        setDarkIconImage(data.data.company_icon_dark);
      }
    })

  }, []);

  // add post
  const addPost = () => {
    let postInfo = {
      "id": uuidv4(),
      "post": post,
      "post_image": file,
      "user_id": role
    }
    postAdd(postInfo).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications('error', data.message);
      }
      else {
        showNotifications('success', 'Post add successfully');
        setFile("");
        setPost("");
        setUploadedFiles([])
        setCount(count + 1)
      }
    })
  }

  function getTimeDifferenceString(providedTimeStr: any) {
    var providedTime: any = new Date(providedTimeStr);
    var currentTime: any = new Date();
    var timeDifference: any = currentTime - providedTime;
    var minutes = Math.floor(timeDifference / (1000 * 60));
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 30);
    var years = Math.floor(months / 12);

    // Generate the human-readable time difference string
    if (years > 0) {
      return years === 1 ? "1 year ago" : years + " years ago";
    } else if (months > 0) {
      return months === 1 ? "1 month ago" : months + " months ago";
    } else if (days > 0) {
      return days === 1 ? "1 day ago" : days + " days ago";
    } else if (hours > 0) {
      // Convert hours to HH:MM:SS format
      var formattedHours = hours.toString().padStart(2, "0");
      var formattedMinutes = (minutes % 60).toString().padStart(2, "0");
      var formattedSeconds = (timeDifference % 60).toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      // Return just now or minutes
      return minutes <= 1 ? "just now" : minutes + " minutes ago";
    }
  }

  const commentPost = (post_id: string) => {
    let postInfo = {
      "id": uuidv4(),
      "user_id": auth.user.id,
      "post_id": post_id,
      "comment": comment
    }
    if (comment.length) {
      postComment(postInfo).then((data) => {
        if (data.statusCode !== 201) {
          showNotifications('error', data.message);
        }
        else {
          showNotifications('success', 'Comment add successfully');
          setComment("Write your comment");
          setPlaceholder("");
          setCount(count + 1)
        }
      })
    }
  }

  const replyCommentPost = (post_id: string, comment_id: string) => {
    let postInfo = {
      "id": uuidv4(),
      "user_id": auth.user.id,
      "post_id": post_id,
      "comment_id": comment_id,
      "comment": commentReply
    }
    if (commentReply.length) {
      replyComment(postInfo).then((data) => {
        if (data.statusCode !== 201) {
          showNotifications('error', data.message);
        }
        else {
          showNotifications('success', 'Comment reply successfully');
          setCommentReply("");
          setPlaceholder("");
          setCount(count + 1)
        }
      })
    }
  }

  const replyCommentReply = (post_id: string, comment_id: string, reply_id: string) => {
    let postInfo = {
      "id": uuidv4(),
      "post_id": post_id,
      "comment_id": comment_id,
      "comment_reply_id": reply_id,
      "comment": commentNext,
      "user_id": auth.user.id,
    }
    if (commentNext.length) {
      commentCommentReply(postInfo).then((data) => {
        if (data.statusCode !== 201) {
          showNotifications('error', data.message);
        }
        else {
          showNotifications('success', 'Reply comment successfully');
          setCommentNext("");
          setPlaceholder("");
          setCount(count + 1)
        }
      })
    }
  }
  const handleInputFocus = () => {
    setPlaceholder("");
  };

  function handleEnter(text: any, post_id: string) {
    commentPost(post_id);
  }
  function handleCommentEnter(post_id: any, comment_id: string) {
    replyCommentPost(post_id, comment_id);
  }
  function handleCommentReplyEnter(post_id: string, comment_id: string, reply_id: string) {
    replyCommentReply(post_id, comment_id, reply_id);
  }
  // post like
  const postLikes = (post_id: string) => {
    let postInfo = {
      "id": uuidv4(),
      "user_id": auth.user.id,
      "post_id": post_id,
      "like": true
    }
    likesPost(postInfo).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications('error', data.message);
      }
      else {
        showNotifications('success', 'post like successfully');
        setCount(count + 1)
      }
    })
  }
  // update post like
  const updatePostLikes = (post_id: string, post_like: boolean) => {
    let postInfo = {
      "user_id": auth.user.id,
      "post_id": post_id,
      "like": !post_like
    }
    likesPostEdit(postInfo).then((data) => {
      if (data.statusCode !== 200) {
        showNotifications('error', data.message);
      }
      else {
        setCount(count + 1)
      }
    })
  }
  // comment like
  const commentLikes = (comment_id: string) => {
    let postInfo = {
      "id": uuidv4(),
      "user_id": auth.user.id,
      "comment_id": comment_id,
      "like": true
    }
    commentLike(postInfo).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications('error', data.message);
      }
      else {
        showNotifications('success', 'Comment like successfully');
        setCount(count + 1)
      }
    })
  }
  // update post like
  const updateCommentLikes = (comment_id: string, post_like: boolean) => {
    let postInfo = {
      "user_id": auth.user.id,
      "comment_id": comment_id,
      "like": !post_like
    }
    commentLikeUpdate(postInfo).then((data) => {
      if (data.statusCode !== 200) {
        showNotifications('error', data.message);
      }
      else {
        setCount(count + 1)
      }
    })
  }
  // comment reply like
  const commentReplyLikes = (comment_reply_id: string) => {
    let postInfo = {
      "id": uuidv4(),
      "user_id": auth.user.id,
      "comment_reply_id": comment_reply_id,
      "like": true
    }
    commentReplyLike(postInfo).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications('error', data.message);
      }
      else {
        showNotifications('success', 'Comment like successfully');
        setCount(count + 1)
      }
    })
  }
  // update comment reply like
  const updateCommentReplyLikes = (comment_reply_id: string, post_like: boolean) => {
    let postInfo = {
      "user_id": auth.user.id,
      "comment_reply_id": comment_reply_id,
      "like": !post_like
    }
    commentReplyLikeUpdate(postInfo).then((data) => {
      if (data.statusCode !== 200) {
        showNotifications('error', data.message);
      }
      else {
        setCount(count + 1)
      }
    })
  }

  const autoResize = () => {
    const textarea = document.getElementById('postTextarea') as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <>
      <Layout>
        <ToastContainer />
        <div className='mainContent'>
          <div className='d-flex justify-content-center'>
            <div className="announcementAdmin">
              {/* post upload */}
              <div className="new-post">
                <div className="frame-div">
                  {userImage && userImage.length ? <img src={`${API}/${userImage}`} className="avatar-icon" style={{ objectFit: "cover" }} alt="logo" />
                    : <img src={avatar} className="avatar-icon" alt="bell" style={{ objectFit: "cover" }} />
                  }
                  <div className="input-with-label3">
                    <div className="input3">
                      <textarea id="postTextarea" value={post} onChange={(e) => { setPost(e.target.value); autoResize(); }} placeholder="Post a new announcement" />
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-end w-100'>
                  <div className="postIconImage">
                    <div className="image" onClick={uploadFiles}>
                      <img className="heart-icon" alt="" src={uploadImage} />
                      <div className="comments">Upload Image/Video</div>
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        {userRole === "admin" ? <>
                          {selectedState ? `${selectedState} ` : 'Posting As'} <img src={arrow} alt="arrow" />
                        </> : <>
                          {firstName} {lastName} (You)
                        </>}
                      </Dropdown.Toggle>
                      {userRole === "admin" ? <>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleStateSelect(userId, `${firstName} ${lastName}`)}>
                            {firstName} {lastName} (You)
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleStateSelect('company', `${companyName}`)}>
                            {companyName}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </> : <></>}
                    </Dropdown>
                    <button type='submit' className='btn btn-info' onClick={addPost}>Publish</button>
                  </div>
                </div>
              </div>

              {/* post list */}
              {postList && postList.map((data: any) =>
                <div className="post-parent">
                  <div className="post">
                    <div className="user">
                      <div className="postLogo">
                        {data.userInfo ? <img className="" alt="post" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} src={`${API}/${data.userInfo.member_image ? data.userInfo.member_image : data.userInfo.avatar}`} />
                          : <img className="vector-icon" alt="" src={`${API}/${darkIconImage ? darkIconImage : postLogo}`} />
                        }
                      </div>
                      <div className="beehive-coworking-parent">
                        <div className="elviro-anasta">{data.userInfo ? <>{data.userInfo.first_name} {data.userInfo.last_name}</> : `${companyName}`}</div>
                        <div className="mins-ago">{getTimeDifferenceString(data.created_at)}</div>
                      </div>
                      <img className="line-chart-up-04-icon" alt="" src={dotLine} />
                    </div>

                    <div className="the-modern-workplace">
                      {data.post}
                    </div>

                    {data.post_image ? <div className="images">
                      <img src={`${API}/${data.post_image}`} className="wtqzczkosgc-1-icon" alt="post" />
                    </div> : ""}

                    <div className="feedback">
                      <div className="like" onClick={data.user_has_liked === null ? () => postLikes(data.id) : () => updatePostLikes(data.id, data.user_has_liked)}>
                        {data.user_has_liked ? <img className="heart-icon" alt="" src={clickLove} />
                          : <img className="heart-icon" alt="" src={blankLove} />}
                        <div className="comments">{data.likes_count} like</div>
                      </div>
                      <div className="feedback-child" />
                      <div className="like">
                        <img className="heart-icon" alt="" src={message} />
                        <div className="comments">{data.commentCount} Comments</div>
                      </div>
                    </div>
                    {/* previous comment */}
                    {data.comments && data.comments.map((comment: any) =>
                      <div className='commentShow'>
                        <div className="comment">
                          <div className="commentImg">
                            {comment.avatar ? <img src={`${API}/${comment.avatar}`} className="avatar-icon" style={{ objectFit: "cover" }} alt="logo" />
                              : <img src={avatar} className="avatar-icon" alt="bell" style={{ objectFit: "cover" }} />
                            }
                          </div>
                          <div className="commentText">
                            <h6>{comment.first_name} <span>{getTimeDifferenceString(comment.created_at)}</span></h6>
                            <p dangerouslySetInnerHTML={{ __html: comment.comment }} />
                          </div>
                          <div className="newComment">
                            <button onClick={() => setReplyAdd(comment.id)}>Reply</button>
                            <button onClick={comment.user_has_liked === null ? () => commentLikes(comment.id) : () => updateCommentLikes(comment.id, comment.user_has_liked)}>
                              {comment.user_has_liked ? <img className="heart-icon" alt="" src={clickLove} />
                                : <img className="heart-icon" alt="" src={blankLove} />} <br />
                              {comment.likes_count}
                            </button>
                          </div>
                        </div>
                        {comment.commentReply && comment.commentReply.map((reply: any) => <>
                          <div className="commentReply">
                            <div className="commentImg">
                              {/* {reply.id} */}
                              {reply.avatar ? <img src={`${API}/${reply.avatar}`} className="avatar-icon" style={{ objectFit: "cover" }} alt="logo" />
                                : <img src={avatar} className="avatar-icon" alt="bell" style={{ objectFit: "cover" }} />
                              }
                            </div>
                            <div className="commentText">
                              <h6>{reply.first_name} <span>{getTimeDifferenceString(reply.created_at)}</span></h6>
                              <p dangerouslySetInnerHTML={{ __html: reply.comment }} />
                            </div>
                            <div className="newComment">
                              <button onClick={() => setReplyCommentAdd(reply.id)}>Reply</button>
                              <button onClick={reply.user_has_liked === null ? () => commentReplyLikes(reply.id) : () => updateCommentReplyLikes(reply.id, reply.user_has_liked)}>
                                {reply.user_has_liked ? <img className="heart-icon" alt="" src={clickLove} />
                                  : <img className="heart-icon" alt="" src={blankLove} />} <br />
                                {reply.likes_count}
                              </button>
                            </div>
                          </div>

                          {/* comment comment */}
                          {reply.replyCommentComment && reply.replyCommentComment.map((nestedReply: any) =>
                            <div className="commentReply" style={{ marginLeft: "68px" }}>
                              <div className="commentImg">
                                {/* {reply.id} */}
                                {nestedReply.avatar ? <img src={`${API}/${nestedReply.avatar}`} className="avatar-icon" style={{ objectFit: "cover" }} alt="logo" />
                                  : <img src={avatar} className="avatar-icon" alt="bell" style={{ objectFit: "cover" }} />
                                }
                              </div>
                              <div className="commentText">
                                <h6>{nestedReply.first_name} <span>{getTimeDifferenceString(nestedReply.created_at)}</span></h6>
                                <p dangerouslySetInnerHTML={{ __html: nestedReply.comment }} />
                              </div>
                            </div>
                          )}
                          {/* comment comment reply */}
                          {reply.id === replyCommentAdd ? <div className="avatar-parent" style={{ paddingLeft: "68px" }}>
                            {userImage && userImage.length ? <img src={`${API}/${userImage}`} className="avatar-icon" style={{ objectFit: "cover" }} alt="logo" />
                              : <img src={avatar} className="avatar-icon" alt="bell" style={{ objectFit: "cover" }} />}
                            <div className="commentInput">
                              <InputEmoji value={placeholder} onFocus={handleInputFocus} onChange={(e) => setCommentNext(e)} cleanOnEnter={true} onEnter={(text: any) => handleCommentReplyEnter(data.id, comment.id, reply.id)} shouldReturn={true} shouldConvertEmojiToImage={true} />
                              <FontAwesomeIcon className="info-circle-icon" onClick={() => replyCommentReply(data.id, comment.id, reply.id)} icon={faPaperPlane} />
                            </div>
                          </div> : ""}

                        </>)}



                        {/* reply comment */}
                        {comment.id === replyAdd ? <div className="avatar-parent">
                          {userImage && userImage.length ? <img src={`${API}/${userImage}`} className="avatar-icon" style={{ objectFit: "cover" }} alt="logo" />
                            : <img src={avatar} className="avatar-icon" alt="bell" style={{ objectFit: "cover" }} />}
                          <div className="commentInput">
                            <InputEmoji value={placeholder} onFocus={handleInputFocus} onChange={(e) => setCommentReply(e)} cleanOnEnter={true} onEnter={(text: any) => handleCommentEnter(data.id, comment.id)} shouldReturn={true} shouldConvertEmojiToImage={true} />
                            <FontAwesomeIcon className="info-circle-icon" onClick={() => replyCommentPost(data.id, comment.id)} icon={faPaperPlane} />
                          </div>
                        </div> : ""}
                        {/* reply comment */}
                      </div>
                    )}
                    {/* previous comment */}
                    {/* comment */}
                    <div className="avatar-parent">
                      {userImage && userImage.length ? <img src={`${API}/${userImage}`} className="avatar-icon" style={{ objectFit: "cover" }} alt="logo" />
                        : <img src={avatar} className="avatar-icon" alt="bell" style={{ objectFit: "cover" }} />
                      }
                      <div className="commentInput">
                        <InputEmoji value={placeholder} onFocus={handleInputFocus} onChange={(e) => setComment(e)} cleanOnEnter={true} onEnter={(text: any) => handleEnter(text, data.id)} shouldReturn={true} shouldConvertEmojiToImage={true} />
                        <FontAwesomeIcon className="info-circle-icon" onClick={() => commentPost(data.id)} icon={faPaperPlane} />
                      </div>
                    </div>
                    {/* comment */}
                  </div>
                </div>)}


            </div>
          </div>
        </div>

        <UploadFile setFile={setFile} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} uploadShow={uploadShow} setUploadShow={setUploadShow} handleUploadClose={handleUploadClose} />


      </Layout>
    </>
  )
}

export default Announcement