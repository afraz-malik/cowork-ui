import React, { useState, useEffect } from 'react'
import Layout from '../../Component/Layout/Layout'
import './Announcement.css'
import postLogo from '../../Assets/Images/icon/adminIcon.svg'
import blankLove from '../../Assets/Images/post/heart.svg'
import message from '../../Assets/Images/post/message-dots-square.svg'
import clickLove from '../../Assets/Images/post/heart(1).svg'
import dotLine from '../../Assets/Images/post/dots-horizontal.svg'
import avatar from '../../Assets/Images/icon/memberAvatar.svg'
import trashBlack from '../../Assets/Images/icon/trash-black.svg'
import UploadFile from './UploadFile'
import { v4 as uuidv4 } from 'uuid'
import {
  commentCommentReply,
  commentLike,
  commentLikeUpdate,
  commentReplyLike,
  commentReplyLikeUpdate,
  deletePost,
  getPostList,
  likesPost,
  likesPostEdit,
  postAdd,
  replyComment,
} from '../../api/announcement'
import { showNotifications } from '../../CommonFunction/toaster'
import { ToastContainer } from 'react-toastify'
import { DESKIE_API as API } from '../../config'
import { Dropdown } from 'react-bootstrap'
import arrow from '../../Assets/Images/icon/downArrowBlack.svg'
import { singleJwtMember } from '../../api/member'
import { isAuthenticate } from '../../api/auth'
import { postComment } from './../../api/announcement'
import InputEmoji from 'react-input-emoji'
import { singleProfile } from '../../api/settings'
import publish from '../../Assets/Images/icon/mail.svg'
import LightBox from '../../Component/LightBox/LightBox'
import trash from '../../Assets/Images/post/trash-02.svg'
import emojiIcon from '../../Assets/Images/post/emoji_emotions.svg'
import uploadIcon from '../../Assets/Images/post/add_photo_alternate.svg'
import commentMessage from '../../Assets/Images/post/local_post_office.svg'

const Announcement = () => {
  const [uploadId, setUploadId] = useState('')
  // post
  const [file, setFile] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadShow, setUploadShow] = useState(false)
  const handleUploadClose = () => setUploadShow(false)
  // comment
  const [commentFile, setCommentFile] = useState<any>({})
  const [commentFileId, setCommentFileId] = useState<any>({})
  const [uploadedCommentFiles, setUploadedCommentFiles] = useState<File[]>([])
  const [uploadCommentShow, setUploadCommentShow] = useState(false)
  const handleUploadCommentClose = () => {
    setUploadCommentShow(false)
  }

  // comment reply
  const [commentReplyFile, setCommentReplyFile] = useState<any>({})
  const [commentReplyFileId, setCommentReplyFileId] = useState<any>({})
  const [uploadedReplyFiles, setUploadedReplyFiles] = useState<File[]>([])
  const [uploadReplyShow, setUploadReplyShow] = useState(false)
  const handleUploadReplyClose = () => {
    setUploadReplyShow(false)
  }

  // comment reply reply
  const [doubleReplyFile, setDoubleReplyFile] = useState<any>({})
  const [doubleReplyFileId, setDoubleReplyFileId] = useState<any>({})
  const [uploadedDoubleFiles, setUploadedDoubleFiles] = useState<File[]>([])
  const [uploadDoubleShow, setUploadDoubleShow] = useState(false)
  const handleUploadDoubleClose = () => {
    setUploadDoubleShow(false)
  }

  const [post, setPost] = useState('')
  const [count, setCount] = useState(0)
  const [postList, setPostList] = useState([])
  const [comment, setComment] = useState('')
  const [commentNext, setCommentNext] = useState('')
  const [placeholder, setPlaceholder] = useState('Write your comment')
  const [replyAdd, setReplyAdd] = useState('')
  const [replyCommentAdd, setReplyCommentAdd] = useState('')
  const [commentReply, setCommentReply] = useState('')
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [userImage, setUserImage] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [userId, setUserId] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [lightIconImage, setLightIconImage] = useState('')
  const [darkIconImage, setDarkIconImage] = useState('')
  const [lightBoxFile, setLightBoxFile] = useState('')
  const [lightBoxVisible, setLightBoxVisible] = useState(false)
  const [lightBoxShow, setLightBoxShow] = useState(false)
  const handleLightBoxClose = () => setLightBoxShow(false)
  let auth = isAuthenticate()

  const handleStateSelect = (id: string, state: string) => {
    setSelectedState(state)
    setRole(id)
  }

  const uploadFiles = () => {
    setUploadShow(true)
  }

  useEffect(() => {
    getPostList(auth.user.id).then((data) => {
      setPostList(data.posts)
    })
  }, [count])

  useEffect(() => {
    singleJwtMember(auth.token).then((data) => {
      if (data.statusCode === 200) {
        if (data.data.data.member_image) {
          setUserImage(data.data.data.member_image)
        } else {
          setUserImage(data.data.data.avatar)
        }
        setFirstName(data.data.data.first_name)
        setLastName(data.data.data.last_name)
        if (data.data.data.role === 'user') {
          setRole(data.data.data.id)
        }
        setUserRole(data.data.data.role)
        setUserId(data.data.data.id)
      }
    })

    singleProfile().then((data) => {
      if (data.statusCode === 200) {
        setCompanyName(data.data.company_name)
        setLightIconImage(data.data.company_icon_light)
        setDarkIconImage(data.data.company_icon_dark)
      }
    })
  }, [])

  // add post
  const addPost = () => {
    let postInfo = {
      id: uuidv4(),
      post: post,
      post_image: file,
      user_id: role,
    }
    postAdd(postInfo).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications('error', data.message)
      } else {
        showNotifications('success', 'Post add successfully')
        setFile('')
        setPost('')
        setUploadedFiles([])
        setCount(count + 1)
      }
    })
  }

  function getTimeDifferenceString(providedTimeStr: any) {
    var providedTime = new Date(providedTimeStr)
    var currentTime = new Date()
    var timeDifference = currentTime.getTime() - providedTime.getTime() // use getTime() to get timestamps in milliseconds

    var minutes = Math.floor(timeDifference / (1000 * 60))
    var hours = Math.floor(minutes / 60)
    var days = Math.floor(hours / 24)
    var months = Math.floor(days / 30)
    var years = Math.floor(months / 12)

    var remainingMinutes = minutes % 60

    // Generate the human-readable time difference string
    if (years > 0) {
      return years === 1 ? '1 year ago' : years + ' years ago'
    } else if (months > 0) {
      return months === 1 ? '1 month ago' : months + ' months ago'
    } else if (days > 0) {
      return days === 1 ? '1 day ago' : days + ' days ago'
    } else if (hours > 0) {
      let hourString = hours === 1 ? '1 hour' : hours + ' hours'
      return `${hourString} ago`
    } else if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : minutes + ' minutes ago'
    } else {
      return 'just now'
    }
  }

  const commentPost = (post_id: string) => {
    let postInfo = {
      id: uuidv4(),
      user_id: auth.user.id,
      post_id: post_id,
      comment_image: commentFile,
      comment: comment,
    }
    if (comment.length || commentFile.name.length) {
      postComment(postInfo).then((data) => {
        if (data.statusCode !== 201) {
          showNotifications('error', data.message)
        } else {
          showNotifications('success', 'Comment add successfully')
          setComment('')
          setPlaceholder('')
          setCount(count + 1)
          setCommentFileId('')
          setCommentFile('')
          setUploadedCommentFiles([])
        }
      })
    }
  }

  const replyCommentPost = (post_id: string, comment_id: string) => {
    let postInfo = {
      id: uuidv4(),
      user_id: auth.user.id,
      post_id: post_id,
      comment_id: comment_id,
      comment_image: commentReplyFile,
      comment: commentReply,
    }
    if (commentReply.length || commentReplyFile.name.length) {
      replyComment(postInfo).then((data) => {
        if (data.statusCode !== 201) {
          showNotifications('error', data.message)
        } else {
          showNotifications('success', 'Comment reply successfully')
          setCommentReply('')
          setPlaceholder('')
          setCount(count + 1)
          setCommentReplyFileId('')
          setCommentReplyFile('')
          setUploadedReplyFiles([])
        }
      })
    }
  }

  const replyCommentReply = (
    post_id: string,
    comment_id: string,
    reply_id: string
  ) => {
    let postInfo = {
      id: uuidv4(),
      post_id: post_id,
      comment_id: comment_id,
      comment_reply_id: reply_id,
      comment: commentNext,
      comment_image: doubleReplyFile,
      user_id: auth.user.id,
    }
    if (commentNext.length || doubleReplyFile.name.length) {
      commentCommentReply(postInfo).then((data) => {
        if (data.statusCode !== 201) {
          showNotifications('error', data.message)
        } else {
          showNotifications('success', 'Reply comment successfully')
          setCommentNext('')
          setPlaceholder('')
          setCount(count + 1)
          setDoubleReplyFileId('')
          setDoubleReplyFile('')
          setUploadedDoubleFiles([])
        }
      })
    }
  }
  const handleInputFocus = () => {
    setPlaceholder('')
  }

  function handleEnter(text: any, post_id: string) {
    commentPost(post_id)
  }
  function handleCommentEnter(post_id: any, comment_id: string) {
    replyCommentPost(post_id, comment_id)
  }
  function handleCommentReplyEnter(
    post_id: string,
    comment_id: string,
    reply_id: string
  ) {
    replyCommentReply(post_id, comment_id, reply_id)
  }
  // post like
  const postLikes = (post_id: string) => {
    let postInfo = {
      id: uuidv4(),
      user_id: auth.user.id,
      post_id: post_id,
      like: true,
    }
    likesPost(postInfo).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications('error', data.message)
      } else {
        showNotifications('success', 'post like successfully')
        setCount(count + 1)
      }
    })
  }
  // update post like
  const updatePostLikes = (post_id: string, post_like: boolean) => {
    let postInfo = {
      user_id: auth.user.id,
      post_id: post_id,
      like: !post_like,
    }
    likesPostEdit(postInfo).then((data) => {
      if (data.statusCode !== 200) {
        showNotifications('error', data.message)
      } else {
        setCount(count + 1)
      }
    })
  }
  // comment like
  const commentLikes = (comment_id: string) => {
    let postInfo = {
      id: uuidv4(),
      user_id: auth.user.id,
      comment_id: comment_id,
      like: true,
    }
    commentLike(postInfo).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications('error', data.message)
      } else {
        showNotifications('success', 'Comment like successfully')
        setCount(count + 1)
      }
    })
  }
  // update post like
  const updateCommentLikes = (comment_id: string, post_like: boolean) => {
    let postInfo = {
      user_id: auth.user.id,
      comment_id: comment_id,
      like: !post_like,
    }
    commentLikeUpdate(postInfo).then((data) => {
      if (data.statusCode !== 200) {
        showNotifications('error', data.message)
      } else {
        setCount(count + 1)
      }
    })
  }
  // comment reply like
  const commentReplyLikes = (comment_reply_id: string) => {
    let postInfo = {
      id: uuidv4(),
      user_id: auth.user.id,
      comment_reply_id: comment_reply_id,
      like: true,
    }
    commentReplyLike(postInfo).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications('error', data.message)
      } else {
        showNotifications('success', 'Comment like successfully')
        setCount(count + 1)
      }
    })
  }
  // update comment reply like
  const updateCommentReplyLikes = (
    comment_reply_id: string,
    post_like: boolean
  ) => {
    let postInfo = {
      user_id: auth.user.id,
      comment_reply_id: comment_reply_id,
      like: !post_like,
    }
    commentReplyLikeUpdate(postInfo).then((data) => {
      if (data.statusCode !== 200) {
        showNotifications('error', data.message)
      } else {
        setCount(count + 1)
      }
    })
  }

  const autoResize = () => {
    const textarea = document.getElementById(
      'postTextarea'
    ) as HTMLTextAreaElement
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }

  const lightBox = (fileName: string) => {
    setLightBoxShow(true)
    setLightBoxFile(fileName)
    setLightBoxVisible(true)
  }

  // post archive
  const postArchive = (postId: string) => {
    let postArchive = {
      archive: true,
    }
    deletePost(postId, postArchive).then((data) => {
      if (data.statusCode !== 200) {
        showNotifications('error', data.message)
      } else {
        showNotifications('success', 'Post delete successfully')
        setCount(count + 1)
      }
    })
  }

  const handleEmojiButtonClick = () => {
    // Handle emoji button click
    console.log('Emoji button clicked')
  }

  const emojiButtonElement: any = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px', // Adjust margin as needed
      }}
    >
      <img
        src={emojiIcon}
        alt='Custom Emoji'
        style={{ width: '24px', height: '24px', cursor: 'pointer' }}
        onClick={handleEmojiButtonClick}
      />
    </div>
  )

  const closeLightBox = () => {
    setLightBoxVisible(false)
  }

  return (
    <>
      <ToastContainer />
      <div className='mainContent'>
        <div className='d-flex justify-content-center'>
          <div className='announcementAdmin'>
            {/* post upload */}
            <div className='new-post'>
              <div className='frame-div'>
                {userImage && userImage.length ? (
                  <img
                    src={`${API}/${userImage}`}
                    className='avatar-icon'
                    style={{ objectFit: 'cover' }}
                    alt='logo'
                  />
                ) : (
                  <img
                    src={avatar}
                    className='avatar-icon default'
                    alt='bell'
                    style={{ objectFit: 'cover' }}
                  />
                )}
                <div className='input-with-label3'>
                  {/* <div className="postEmoji">
                      <img className="heart-icon" alt="emoji" src={emojiIcon} />
                    </div> */}
                  <div className='input3'>
                    <textarea
                      id='postTextarea'
                      value={post}
                      onChange={(e) => {
                        setPost(e.target.value)
                        autoResize()
                      }}
                      placeholder='Write a new post'
                      rows={3}
                    />
                  </div>
                  <div className='image' onClick={uploadFiles}>
                    <img className='heart-icon' alt='upload' src={uploadIcon} />
                  </div>
                </div>
              </div>
              <div className='d-flex justify-content-end w-100'>
                <div className='postIconImage'>
                  <Dropdown>
                    <Dropdown.Toggle id='dropdown-basic'>
                      {userRole === 'admin' ? (
                        <>
                          {selectedState ? `${selectedState} ` : 'Posting As'}{' '}
                          <img src={arrow} alt='arrow' />
                        </>
                      ) : (
                        <>
                          {firstName} {lastName} (You)
                        </>
                      )}
                    </Dropdown.Toggle>
                    {userRole === 'admin' ? (
                      <>
                        <Dropdown.Menu className='postingAs'>
                          <Dropdown.Item
                            className='admin'
                            onClick={() =>
                              handleStateSelect(
                                userId,
                                `${firstName} ${lastName}`
                              )
                            }
                          >
                            {userImage && userImage.length ? (
                              <img
                                src={`${API}/${userImage}`}
                                style={{ objectFit: 'cover' }}
                                alt='logo'
                              />
                            ) : (
                              <img
                                src={avatar}
                                className='default'
                                alt='bell'
                                style={{ objectFit: 'cover' }}
                              />
                            )}{' '}
                            {firstName} {lastName}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleStateSelect('company', `${companyName}`)
                            }
                          >
                            <img
                              alt=''
                              src={`${API}/${
                                darkIconImage ? darkIconImage : postLogo
                              }`}
                            />{' '}
                            {companyName}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </>
                    ) : (
                      <></>
                    )}
                  </Dropdown>
                  <button
                    type='submit'
                    className='btn btn-info'
                    onClick={addPost}
                  >
                    <img src={publish} alt='publish' /> Publish
                  </button>
                </div>
              </div>
            </div>

            {/* post list */}
            {postList &&
              postList.map((data: any, i) => (
                <div key={`post` + i} className='post-parent'>
                  <div className='post'>
                    <div className='user'>
                      <div className='postLogo'>
                        {data.userInfo ? (
                          data.userInfo.member_image ? (
                            <img
                              className=''
                              alt='post'
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                              src={`${API}/${data.userInfo.member_image}`}
                            />
                          ) : (
                            <img
                              src={avatar}
                              className='avatar-icon default'
                              alt='bell'
                              style={{ objectFit: 'cover' }}
                            />
                          )
                        ) : (
                          <img
                            className='vector-icon'
                            alt=''
                            src={`${API}/${
                              darkIconImage ? darkIconImage : postLogo
                            }`}
                          />
                        )}
                      </div>
                      <div className='beehive-coworking-parent'>
                        <div className='elviro-anasta'>
                          {data.userInfo ? (
                            <>
                              {data.userInfo.first_name}{' '}
                              {data.userInfo.last_name}
                            </>
                          ) : (
                            `${companyName}`
                          )}
                        </div>
                        <div className='mins-ago'>
                          {getTimeDifferenceString(data.created_at)}
                        </div>
                      </div>
                      <div className='trashPost'>
                        <Dropdown>
                          <Dropdown.Toggle
                            id='dropdown-basic'
                            className='custom-dropdown-toggle'
                          >
                            <img
                              className='line-chart-up-04-icon'
                              alt=''
                              src={dotLine}
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className='postDelete'>
                            <Dropdown.Item
                              className='custom-dropdown-toggle'
                              onClick={() => postArchive(data.id)}
                            >
                              <img
                                className='line-chart-up-04-icon'
                                alt=''
                                src={trash}
                              />{' '}
                              Delete Post{' '}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>

                    <div className='the-modern-workplace'>{data.post}</div>

                    {data.post_image ? (
                      <div className='images'>
                        <img
                          src={`${API}/${data.post_image}`}
                          onClick={() => lightBox(data.post_image)}
                          className='wtqzczkosgc-1-icon'
                          alt='post'
                        />
                      </div>
                    ) : (
                      ''
                    )}

                    <div className='feedback'>
                      <div
                        className='like'
                        onClick={
                          data.user_has_liked === null
                            ? () => postLikes(data.id)
                            : () =>
                                updatePostLikes(data.id, data.user_has_liked)
                        }
                      >
                        {data.user_has_liked ? (
                          <img className='heart-icon' alt='' src={clickLove} />
                        ) : (
                          <img className='heart-icon' alt='' src={blankLove} />
                        )}
                        <div className='comments'>
                          {data.likes_count}{' '}
                          {data.likes_count === 1 ? 'like' : 'likes'}
                        </div>
                      </div>
                      <div className='feedback-child' />
                      <div className='like'>
                        <img className='heart-icon' alt='' src={message} />
                        <div className='comments'>
                          {data.commentCount}{' '}
                          {data.commentCount === 1 ? 'Comment' : 'Comments'}
                        </div>
                      </div>
                    </div>
                    {/* previous comment */}
                    {data.comments &&
                      data.comments.map((comment: any, j: number) => (
                        <div key={`comment` + j} className='commentShow'>
                          <div className='comment'>
                            <div className='commentImg'>
                              {comment.avatar ? (
                                <img
                                  src={`${API}/${comment.avatar}`}
                                  className='avatar-icon'
                                  style={{ objectFit: 'cover' }}
                                  alt='logo'
                                />
                              ) : (
                                <img
                                  src={avatar}
                                  className='avatar-icon default'
                                  alt='bell'
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                            </div>
                            <div className='commentText'>
                              <h6>
                                {comment.first_name}{' '}
                                <span>
                                  {getTimeDifferenceString(comment.created_at)}
                                </span>
                              </h6>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: comment.comment,
                                }}
                              />
                              {comment.comment_image ? (
                                <img
                                  src={`${API}/${comment.comment_image}`}
                                  width='150px'
                                  height='120px'
                                  style={{ borderRadius: '25px' }}
                                  alt='comment'
                                />
                              ) : (
                                ''
                              )}
                            </div>
                            <div className='newComment'>
                              <button
                                className='px-3'
                                onClick={() => setReplyAdd(comment.id)}
                              >
                                Reply
                              </button>
                              <button
                                style={{
                                  paddingLeft: '16px',
                                  paddingRight: '0',
                                }}
                                onClick={
                                  comment.user_has_liked === null
                                    ? () => commentLikes(comment.id)
                                    : () =>
                                        updateCommentLikes(
                                          comment.id,
                                          comment.user_has_liked
                                        )
                                }
                              >
                                {comment.user_has_liked ? (
                                  <img
                                    className='heart-icon'
                                    alt=''
                                    src={clickLove}
                                  />
                                ) : (
                                  <img
                                    className='heart-icon'
                                    alt=''
                                    src={blankLove}
                                  />
                                )}{' '}
                                <br />
                                {comment.likes_count}
                              </button>
                            </div>
                          </div>
                          {comment.commentReply &&
                            comment.commentReply.map(
                              (reply: any, k: number) => (
                                <div key={`commentReply` + k}>
                                  <div className='commentReply'>
                                    <div className='commentImg'>
                                      {/* {reply.id} */}
                                      {reply.avatar ? (
                                        <img
                                          src={`${API}/${reply.avatar}`}
                                          className='avatar-icon'
                                          style={{ objectFit: 'cover' }}
                                          alt='logo'
                                        />
                                      ) : (
                                        <img
                                          src={avatar}
                                          className='avatar-icon default'
                                          alt='bell'
                                          style={{ objectFit: 'cover' }}
                                        />
                                      )}
                                    </div>
                                    <div className='commentText'>
                                      <h6>
                                        {reply.first_name}{' '}
                                        <span>
                                          {getTimeDifferenceString(
                                            reply.created_at
                                          )}
                                        </span>
                                      </h6>
                                      <p
                                        dangerouslySetInnerHTML={{
                                          __html: reply.comment,
                                        }}
                                      />
                                      {reply.comment_image ? (
                                        <img
                                          src={`${API}/${reply.comment_image}`}
                                          width='150px'
                                          height='120px'
                                          style={{ borderRadius: '25px' }}
                                          alt='comment'
                                        />
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                    <div className='newComment'>
                                      <button
                                        className='px-3'
                                        onClick={() =>
                                          setReplyCommentAdd(reply.id)
                                        }
                                      >
                                        Reply
                                      </button>
                                      <button
                                        style={{
                                          paddingLeft: '16px',
                                          paddingRight: '0',
                                        }}
                                        onClick={
                                          reply.user_has_liked === null
                                            ? () => commentReplyLikes(reply.id)
                                            : () =>
                                                updateCommentReplyLikes(
                                                  reply.id,
                                                  reply.user_has_liked
                                                )
                                        }
                                      >
                                        {reply.user_has_liked ? (
                                          <img
                                            className='heart-icon'
                                            alt=''
                                            src={clickLove}
                                          />
                                        ) : (
                                          <img
                                            className='heart-icon'
                                            alt=''
                                            src={blankLove}
                                          />
                                        )}{' '}
                                        <br />
                                        {reply.likes_count}
                                      </button>
                                    </div>
                                  </div>

                                  {/* comment comment */}
                                  {reply.replyCommentComment &&
                                    reply.replyCommentComment.map(
                                      (nestedReply: any, l: number) => (
                                        <div
                                          key={`lastComment` + l}
                                          className='commentReply'
                                          style={{ marginLeft: '68px' }}
                                        >
                                          <div className='commentImg'>
                                            {/* {reply.id} */}
                                            {nestedReply.avatar ? (
                                              <img
                                                src={`${API}/${nestedReply.avatar}`}
                                                className='avatar-icon'
                                                style={{ objectFit: 'cover' }}
                                                alt='logo'
                                              />
                                            ) : (
                                              <img
                                                src={avatar}
                                                className='avatar-icon default'
                                                alt='bell'
                                                style={{ objectFit: 'cover' }}
                                              />
                                            )}
                                          </div>
                                          <div className='commentText'>
                                            <h6>
                                              {nestedReply.first_name}{' '}
                                              <span>
                                                {getTimeDifferenceString(
                                                  nestedReply.created_at
                                                )}
                                              </span>
                                            </h6>
                                            <p
                                              dangerouslySetInnerHTML={{
                                                __html: nestedReply.comment,
                                              }}
                                            />
                                            {nestedReply.comment_image ? (
                                              <img
                                                src={`${API}/${nestedReply.comment_image}`}
                                                width='150px'
                                                height='120px'
                                                style={{ borderRadius: '25px' }}
                                                alt='comment'
                                              />
                                            ) : (
                                              ''
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  {/* comment comment reply */}
                                  {reply.id === replyCommentAdd ? (
                                    <div
                                      className='avatar-parent'
                                      style={{ paddingLeft: '68px' }}
                                    >
                                      {userImage && userImage.length ? (
                                        <img
                                          src={`${API}/${userImage}`}
                                          className='avatar-icon'
                                          style={{ objectFit: 'cover' }}
                                          alt='logo'
                                        />
                                      ) : (
                                        <img
                                          src={avatar}
                                          className='avatar-icon default'
                                          alt='bell'
                                          style={{ objectFit: 'cover' }}
                                        />
                                      )}
                                      <div className='commentInput'>
                                        <InputEmoji
                                          value={placeholder}
                                          onFocus={handleInputFocus}
                                          onChange={(e) => setCommentNext(e)}
                                          cleanOnEnter={true}
                                          onEnter={(text: any) =>
                                            handleCommentReplyEnter(
                                              data.id,
                                              comment.id,
                                              reply.id
                                            )
                                          }
                                          shouldReturn={true}
                                          shouldConvertEmojiToImage={true}
                                        />
                                        {doubleReplyFileId[reply.id] ? (
                                          <div className='commentImg'>
                                            <p>
                                              {doubleReplyFileId[reply.id] &&
                                                `${doubleReplyFileId[
                                                  reply.id
                                                ].slice(
                                                  0,
                                                  5
                                                )}${doubleReplyFileId[
                                                  reply.id
                                                ].substring(
                                                  doubleReplyFileId[
                                                    reply.id
                                                  ].lastIndexOf('.')
                                                )}`}
                                            </p>
                                            <img
                                              src={trashBlack}
                                              alt='trash'
                                              onClick={() => {
                                                setDoubleReplyFile('')
                                                setDoubleReplyFileId('')
                                                setUploadedDoubleFiles([])
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          ''
                                        )}
                                        <img
                                          src={uploadIcon}
                                          onClick={() => {
                                            setUploadId(reply.id)
                                            setUploadDoubleShow(true)
                                          }}
                                          alt='upload'
                                        />
                                        &nbsp;
                                        <img
                                          onClick={() =>
                                            replyCommentReply(
                                              data.id,
                                              comment.id,
                                              reply.id
                                            )
                                          }
                                          src={commentMessage}
                                          alt='comment'
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              )
                            )}

                          {/* reply comment */}
                          {comment.id === replyAdd ? (
                            <div className='avatar-parent'>
                              {userImage && userImage.length ? (
                                <img
                                  src={`${API}/${userImage}`}
                                  className='avatar-icon'
                                  style={{ objectFit: 'cover' }}
                                  alt='logo'
                                />
                              ) : (
                                <img
                                  src={avatar}
                                  className='avatar-icon default'
                                  alt='bell'
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                              <div className='commentInput'>
                                <InputEmoji
                                  value={placeholder}
                                  onFocus={handleInputFocus}
                                  onChange={(e) => setCommentReply(e)}
                                  cleanOnEnter={true}
                                  onEnter={(text: any) =>
                                    handleCommentEnter(data.id, comment.id)
                                  }
                                  shouldReturn={true}
                                  shouldConvertEmojiToImage={true}
                                />
                                {commentReplyFileId[comment.id] ? (
                                  <div className='commentImg'>
                                    <p>
                                      {commentReplyFileId[comment.id] &&
                                        `${commentReplyFileId[comment.id].slice(
                                          0,
                                          5
                                        )}${commentReplyFileId[
                                          comment.id
                                        ].substring(
                                          commentReplyFileId[
                                            comment.id
                                          ].lastIndexOf('.')
                                        )}`}
                                    </p>
                                    <img
                                      src={trashBlack}
                                      alt='trash'
                                      onClick={() => {
                                        setCommentReplyFile('')
                                        setCommentReplyFileId('')
                                        setUploadedReplyFiles([])
                                      }}
                                    />
                                  </div>
                                ) : (
                                  ''
                                )}
                                <img
                                  src={uploadIcon}
                                  onClick={() => {
                                    setUploadId(comment.id)
                                    setUploadReplyShow(true)
                                  }}
                                  alt='upload'
                                />
                                &nbsp;
                                <img
                                  onClick={() =>
                                    replyCommentPost(data.id, comment.id)
                                  }
                                  src={commentMessage}
                                  alt='comment'
                                />
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                          {/* reply comment */}
                        </div>
                      ))}
                    {/* previous comment */}
                    {/* comment */}
                    <div className='avatar-parent'>
                      {userImage && userImage.length ? (
                        <img
                          src={`${API}/${userImage}`}
                          className='avatar-icon'
                          style={{ objectFit: 'cover' }}
                          alt='logo'
                        />
                      ) : (
                        <img
                          src={avatar}
                          className='avatar-icon default'
                          alt='bell'
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                      <div className='commentInput'>
                        {/* <CustomEmojiButton /> */}
                        <InputEmoji
                          value={placeholder}
                          onFocus={handleInputFocus}
                          onChange={(e) => setComment(e)}
                          cleanOnEnter={true}
                          onEnter={(text: any) => handleEnter(text, data.id)}
                          shouldReturn={true}
                          shouldConvertEmojiToImage={true}
                          buttonElement={emojiButtonElement}
                        />
                        {commentFileId[data.id] ? (
                          <div className='commentImg'>
                            <p>
                              {commentFileId[data.id] &&
                                `${commentFileId[data.id].slice(
                                  0,
                                  5
                                )}${commentFileId[data.id].substring(
                                  commentFileId[data.id].lastIndexOf('.')
                                )}`}
                            </p>
                            <img
                              src={trashBlack}
                              alt='trash'
                              onClick={() => {
                                setCommentFile('')
                                setCommentFileId('')
                                setUploadedCommentFiles([])
                              }}
                            />
                          </div>
                        ) : (
                          ''
                        )}
                        <img
                          src={uploadIcon}
                          onClick={() => {
                            setUploadId(data.id)
                            setUploadCommentShow(true)
                          }}
                          alt='upload'
                        />
                        &nbsp;
                        <img
                          onClick={() => commentPost(data.id)}
                          src={commentMessage}
                          alt='comment'
                        />
                      </div>
                    </div>
                    {/* comment */}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* post */}
      <UploadFile
        setFile={setFile}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        uploadShow={uploadShow}
        setUploadShow={setUploadShow}
        handleUploadClose={handleUploadClose}
      />
      {/* comment */}
      <UploadFile
        id={uploadId}
        setCommentFileId={setCommentFileId}
        setFile={setCommentFile}
        uploadedFiles={uploadedCommentFiles}
        setUploadedFiles={setUploadedCommentFiles}
        uploadShow={uploadCommentShow}
        setUploadShow={setUploadCommentShow}
        handleUploadClose={handleUploadCommentClose}
      />
      {/* comment reply */}
      <UploadFile
        id={uploadId}
        setCommentFileId={setCommentReplyFileId}
        setFile={setCommentReplyFile}
        uploadedFiles={uploadedReplyFiles}
        setUploadedFiles={setUploadedReplyFiles}
        uploadShow={uploadReplyShow}
        setUploadShow={setUploadReplyShow}
        handleUploadClose={handleUploadReplyClose}
      />
      {/* comment reply reply */}
      <UploadFile
        id={uploadId}
        setCommentFileId={setDoubleReplyFileId}
        setFile={setDoubleReplyFile}
        uploadedFiles={uploadedDoubleFiles}
        setUploadedFiles={setUploadedDoubleFiles}
        uploadShow={uploadDoubleShow}
        setUploadShow={setUploadDoubleShow}
        handleUploadClose={handleUploadDoubleClose}
      />

      {lightBoxVisible && (
        <LightBox
          lightBoxFile={lightBoxFile}
          lightBoxShow={lightBoxShow}
          setLightBoxShow={setLightBoxShow}
          handleLightBoxClose={closeLightBox}
        />
      )}
    </>
  )
}

export default Announcement
