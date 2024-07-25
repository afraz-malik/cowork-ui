import React, { useRef, useState, useEffect } from 'react'
import trash from '../../Assets/Images/icon/trash-02 (1).svg'
import changeLogo from '../../Assets/Images/icon/memberLargeIcon.png'
import uploadFile from '../../Assets/Images/icon/uploadIcon.svg'
import PhoneInput from 'react-phone-input-2'
import { singleJwtMember } from '../../api/member'
import { isAuthenticate } from '../../api/auth'
import { DESKIE_API as API } from '../../config'
import { updateAdmin } from '../../api/admin'
import { showNotifications } from '../../CommonFunction/toaster'
import { ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import memberIcon from '../../Assets/Images/icon/memberLargeIcon.png'
import ConfirmationModal from '../../Component/ConfirmationModal/ConfirmationModal'
import ReactQuill from 'react-quill'

interface AccountProps {
  settingTab: (type: string) => void
}

const Membership = ({ settingTab }: AccountProps) => {
  const navigate = useNavigate()
  const [imageLogo, setImageLogo] = useState('')
  const [logoFile, setLogoFile] = useState('')
  const [uploadedLogo, setUploadedLogo] = useState('')
  const [userImage, setUserImage] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [adminId, setAdminId] = useState('')
  const [emptyImg, setEmptyImg] = useState('')
  const [confirmationShow, setConfirmationShow] = useState(false)
  const [content, setContent] = useState('')

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value)
  }
  const wrapperRef = useRef<HTMLInputElement>(null)
  function onFileLogoDrop(event: any) {
    setLogoFile(URL.createObjectURL(event.target.files[0]))
    setUploadedLogo(event.target.files[0])
  }
  let auth = isAuthenticate()
  useEffect(() => {
    singleJwtMember(auth.token).then((data) => {
      if (data.statusCode === 200) {
        setAdminId(data.data.data.id)
        setUserImage(data.data.data.avatar)
        setFirstName(data.data.data.first_name)
        setLastName(data.data.data.last_name)
        setEmail(data.data.data.email)
        setPhoneNumber(data.data.data.phone)
      }
    })
  }, [])

  const adminUpdate = () => {
    let adminInfo = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phoneNumber,
      avatar: uploadedLogo,
    }
    if (imageLogo === 'logo') {
      adminInfo.avatar = 'empty'
    }
    updateAdmin(adminId, adminInfo).then((data) => {
      if (data.statusCode === 200) {
        showNotifications('success', data.message)
        localStorage.removeItem('company')
        return navigate(`/`)
      } else if (data.statusCode === 201) {
        showNotifications('success', data.message)
      }
    })
  }

  const removeImage = () => {
    setLogoFile('')
    setUploadedLogo('')
    setUserImage('')
    setImageLogo('logo')
  }
  var modules: any = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
        { align: [] },
      ],
      [
        {
          color: [
            '#000000',
            '#e60000',
            '#ff9900',
            '#ffff00',
            '#008a00',
            '#0066cc',
            '#9933ff',
            '#ffffff',
            '#facccc',
            '#ffebcc',
            '#ffffcc',
            '#cce8cc',
            '#cce0f5',
            '#ebd6ff',
            '#bbbbbb',
            '#f06666',
            '#ffc266',
            '#ffff66',
            '#66b966',
            '#66a3e0',
            '#c285ff',
            '#888888',
            '#a10000',
            '#b26b00',
            '#b2b200',
            '#006100',
            '#0047b2',
            '#6b24b2',
            '#444444',
            '#5c0000',
            '#663d00',
            '#666600',
            '#003700',
            '#002966',
            '#3d1466',
            'custom-color',
          ],
        },
      ],
    ],
  }
  var formats: any = [
    'header',
    'height',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'color',
    'bullet',
    'indent',
    'link',
    'align',
    'size',
  ]
  const handleProcedureContentChange = (content: string) => {
    setContent(content)
  }

  return (
    <>
      <div className='mainContent'>
        <ToastContainer />
        <div className='settingPage'>
          <div className='companyOptions'>
            <button onClick={() => settingTab('account')}>
              Personal Profile
            </button>
            <button onClick={() => settingTab('profile')}>
              Company Profile
            </button>
            <button onClick={() => settingTab('finance')}>Finance</button>
            <button onClick={() => settingTab('users')}>Users</button>
            <button onClick={() => settingTab('custom')}>Customization</button>
            <button className='activeBtn' onClick={() => settingTab('member')}>
              MemberShip Agreement
            </button>
          </div>
          <div className='companyProfile'>
            <div className='profileHeading'>
              <h6>Membership Agreement</h6>
              <p>
                This is the document your members will agree to when signing up
              </p>
            </div>
            <div className='profileSave'>
              <button className='cancel'>Cancel</button>
              <button
                className='save'
                onClick={() => setConfirmationShow(true)}
              >
                Save
              </button>
            </div>
          </div>
          {/* <div className='companyName'>
            <p>Profile Picture</p>
            <div className='rightFileSetting'>
              <div className='profileImageBox'>
                {imageLogo && imageLogo.length > 0 ? (
                  <img
                    src={changeLogo}
                    className='changeLogo'
                    alt='change-logo'
                  />
                ) : (
                  <>
                    {logoFile && logoFile.length > 0 ? (
                      <img
                        src={logoFile}
                        className='changeLogo'
                        alt='change-logo'
                      />
                    ) : userImage.length ? (
                      <img
                        src={`${API}/${userImage}`}
                        className='changeLogo'
                        alt='change-logo'
                      />
                    ) : (
                      <img
                        src={memberIcon}
                        className='changeLogo'
                        alt='change-logo'
                      />
                    )}
                  </>
                )}
                <img
                  src={trash}
                  className='trash'
                  alt='delete'
                  onClick={removeImage}
                />
              </div>
              <div ref={wrapperRef} className='drop-file-input'>
                <div className='drop-file-input__label'>
                  <img src={uploadFile} alt='' />
                  <p>
                    <span>Click to upload</span> or drag and drop
                  </p>
                </div>
                <input type='file' onChange={onFileLogoDrop} />
              </div>
            </div>
          </div> */}
          {/* <div className='contactDetails border-bottom-0 pb-0'>
            <p>Contact Details</p>
            <div className='rightSideSetting'>
              <div className='companyInput profileName'>
                <span>First Name</span>
                <input
                  type='text'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder='First Name'
                  className='form-control'
                />
              </div>
              <div className='companyInput profileName'>
                <span>Last Name</span>
                <input
                  type='text'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder='Last Name'
                  className='form-control'
                />
              </div>
              <div className='companyInput profileEmail'>
                <span>Email Address</span>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='_________@____.____'
                  className='form-control'
                />
              </div>
              <div className='mt-2 phone phoneInput'>
                <label>Phone Number</label>
                <PhoneInput
                  country={'us'}
                  value={phoneNumber}
                  disableCountryCode={false}
                  onChange={(value) => handlePhoneChange(value)}
                />
              </div>
            </div>
          </div> */}
          <div>
            <ReactQuill
              theme='snow'
              modules={modules}
              formats={formats}
              placeholder='Enter a description...'
              onChange={handleProcedureContentChange}
              value={content}
            />
          </div>
        </div>
      </div>
      <ConfirmationModal
        ConfirmationShow={confirmationShow}
        afterConfirmationApi={adminUpdate}
        handleConfirmationClose={() => setConfirmationShow(false)}
      />
    </>
  )
}

export default Membership
