import React, { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import folder from '../../Assets/Images/icon/folder.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { getMemberList, searchMember, singleJwtMember } from '../../api/member'
import { DESKIE_API as API } from '../../config'
import { showNotifications } from '../../CommonFunction/toaster'
import { shareUpdate } from '../../api/files'
import { isAuthenticate } from '../../api/auth'
import memberIcon from '../../Assets/Images/icon/memberAvatar.png'
import { adminList } from '../../api/admin'

interface ShareFileProps {
  handleShareClose: () => void
  shareShow: boolean
  setShareShow: (type: boolean) => void
  filesId: string
  sharesShow?: any
  setSharesShow?: any
  shares?: any
  setShares?: any
}

const ShareFile = ({
  filesId,
  shareShow,
  setShareShow,
  handleShareClose,
  sharesShow,
  setSharesShow,
  setShares,
  shares,
}: ShareFileProps) => {
  const [userImage, setUserImage] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loginId, setLoginId] = useState('')
  const [sharesList, setSharesList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [userRole, setUserRole] = useState('')
  const [filteredSharesList, setFilteredSharesList] = useState([])

  let auth = isAuthenticate()
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
        setUserRole(data.data.data.role)
        setLoginId(data.data.data.id)
      }
    })
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memberData, adminData] = await Promise.all([
          getMemberList(10, 1),
          adminList(),
        ])
        let combinedData: any = [
          ...memberData.members.map((member: any) => ({
            ...member,
            type: 'member',
          })),
          ...adminData.map((admin: any) => ({
            ...admin,
            type: 'admin',
            member_image: admin.avatar,
          })),
        ]

        // Optional: Filter out items based on some criteria, for example, userRole and loginId
        // if (userRole === 'user') {
        //     combinedData = combinedData.filter((item: any) => item.id !== loginId);
        // }

        // if (userRole === 'admin') {
        //     combinedData = combinedData.filter((item: any) => item.id !== loginId);
        // }

        setSharesList(combinedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [userRole])

  useEffect(() => {
    if (searchTerm) {
      const filteredData = sharesList.filter((item: any) =>
        item.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredSharesList(filteredData)
    } else {
      setFilteredSharesList([])
    }
  }, [searchTerm, sharesList])

  const shareList = (share: any) => {
    const shareExists = shares?.some(
      (existingShare: any) => existingShare.id === share.id
    )
    if (!shareExists) {
      setShares([...shares, share])
    } else {
      showNotifications('error', 'Share already exists in the list')
    }
  }

  const removeShare = (memberId: string) => {
    setShares((prevShares: any) =>
      prevShares.filter((item: any) => item.id !== memberId)
    )
  }

  const updateShares = () => {
    if (shares) {
      const ids = shares.map((obj: any) => obj.id)

      const share = `${ids}`
      shareUpdate(filesId, { share }).then((data) => {
        if (data.statusCode !== 200) {
          showNotifications('error', data.message)
        } else {
          const subMessage =
            shares[0].first_name +
            ' ' +
            shares[0].last_name +
            (shares.length > 1
              ? ', ' + shares[1].first_name + ' ' + shares[1].last_name
              : '') +
            (shares.length > 2 ? ' and ' + (shares.length - 2) + ' more' : '')

          showNotifications('success', 'File Shared', subMessage)
          setShareShow(false)
          setShares([])
          setSearchTerm('')
        }
      })
    }
  }

  useEffect(() => {
    if (sharesShow?.length) {
      const shareList = sharesShow.split(',')
      shareList.forEach((shareId: any) => {
        const matchingShare = sharesList.find(
          (share: any) => share.id === shareId
        )
        if (matchingShare) {
          setShares((prevShares: any) => {
            if (!prevShares.find((share: any) => share.id === matchingShare)) {
              return [...prevShares, matchingShare]
            }
            return prevShares
          })
        }
      })
    }
  }, [sharesShow])

  return (
    <>
      <Modal show={shareShow} onHide={handleShareClose} centered size='lg'>
        <div className='addMemberForm'>
          <button className='closeModal' onClick={handleShareClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <Row>
            <Col md={12}>
              <div className='addMemberHeading'>
                <img src={folder} alt='member' />
                <p>Share File</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <div className='sharing'>
                <p>Who has access to this file:</p>
                <div className='adminOption'>
                  {userImage && userImage ? (
                    <img
                      src={`${API}/${userImage}`}
                      alt='admin'
                      className={userRole === 'admin' ? 'adminBorder' : ''}
                    />
                  ) : (
                    <img src={memberIcon} alt='' />
                  )}
                  <div className='adminName'>
                    <p>
                      {firstName} {lastName} (you)
                    </p>
                    <span>{userRole === 'admin' ? 'ADMIN' : 'MEMBER'}</span>
                  </div>
                </div>
                <div className='shareMember'>
                  <div className='content'>
                    <ul>
                      <li className={userRole === 'admin' ? 'adminBorder' : ''}>
                        {userImage && userImage ? (
                          <img
                            src={`${API}/${userImage}`}
                            className={
                              userRole === 'admin' ? 'adminBorder' : ''
                            }
                            alt='admin'
                          />
                        ) : (
                          <img
                            className={
                              userRole === 'admin' ? 'adminBorder' : ''
                            }
                            src={memberIcon}
                            alt=''
                          />
                        )}
                        <span>{firstName}</span>
                        <FontAwesomeIcon icon={faXmark} />{' '}
                      </li>
                      {shares &&
                        shares
                          .filter((member: any) => member.id !== loginId)
                          .map((member: any) => (
                            <li
                              key={member.id}
                              className={
                                member.type === 'admin'
                                  ? 'adminBordered'
                                  : 'adminBorderless'
                              }
                            >
                              {member.member_image ? (
                                <img
                                  src={`${API}/${member.member_image}`}
                                  alt=''
                                  className={
                                    member.type === 'admin'
                                      ? 'adminBordered'
                                      : 'adminBorderless'
                                  }
                                />
                              ) : (
                                <img
                                  src={memberIcon}
                                  alt=''
                                  className={
                                    member.type === 'admin'
                                      ? 'adminBordered'
                                      : 'adminBorderless'
                                  }
                                />
                              )}
                              <span>{member.first_name}</span>
                              <FontAwesomeIcon
                                onClick={() => removeShare(member.id)}
                                icon={faXmark}
                              />
                            </li>
                          ))}
                      <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type='text'
                        spellCheck='false'
                        placeholder='Who would you like to share this with?'
                      />
                    </ul>
                  </div>
                  <div>
                    <ul className='searchMemberList'>
                      {filteredSharesList &&
                        filteredSharesList
                          .filter((member: any) => member.id !== loginId)
                          .map((member: any, index: number) => (
                            <li
                              key={`member` + index}
                              onClick={() => shareList(member)}
                              className={
                                member.type === 'admin'
                                  ? 'adminBordered'
                                  : 'adminBorderless'
                              }
                            >
                              {member.member_image ? (
                                <img
                                  src={`${API}/${member.member_image}`}
                                  className={
                                    member.type === 'admin'
                                      ? 'adminBordered'
                                      : 'adminBorderless'
                                  }
                                  alt=''
                                />
                              ) : (
                                <img
                                  src={memberIcon}
                                  className={
                                    member.type === 'admin'
                                      ? 'adminBordered'
                                      : 'adminBorderless'
                                  }
                                  alt=''
                                />
                              )}

                              <span>{member.first_name}</span>
                            </li>
                          ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className='uploadBtn'>
                <button
                  className='btn save'
                  type='submit'
                  onClick={updateShares}
                >
                  Save
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  )
}

export default ShareFile
