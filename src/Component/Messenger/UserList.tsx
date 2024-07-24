import * as React from 'react'
import avatar from '../../Assets/Images/icon/blank-profile.jpg'
import avatar1 from '../../Assets/Images/icon/Avatar.png'
import avatar2 from '../../Assets/Images/icon/Avatar.png'
import cuate from '../../Assets/Images/background/cuate.svg'
import { USER } from '../../CommonFunction/types'
import { DESKIE_API as API } from '../../config'

// interface UserListProps {
//   to: USER[]
// }

const UserList = ({ ...props }) => {
  const { to } = props

  return (
    <>
      {to.length === 0 ? (
        <div className='messageImage'>
          <img alt='message' loading='lazy' src={cuate} />
          <p className='mt-3' style={{ fontSize: '14px' }}>
            No messages yet
          </p>
        </div>
      ) : to.length === 1 ? (
        <>
          <div className='u1div'>
            {to[0].avatar ? (
              <img
                alt=''
                loading='lazy'
                // src={`${API}/image/avatar/${to[0].avatar}`}
                src={`${API}/${to[0].avatar}`}
                className='u1img'
              />
            ) : (
              <img
                loading='lazy'
                className='avatar-icon1'
                alt=''
                src={avatar}
              />
            )}

            <div className='u1div-2'>{to[0].name}</div>
            <div className='u1div-3'>{to[0].role}</div>
          </div>
        </>
      ) : (
        <>
          <div className='u2div'>
            <div className='u2div-2 avatar'>
              {to.map((e: USER, i: number) => (
                <>
                  {e.avatar ? (
                    <img
                      loading='lazy'
                      className='u2img avatar-icon1'
                      alt=''
                      src={`${API}/${e.avatar}`}
                    />
                  ) : (
                    <img
                      loading='lazy'
                      className='u2img avatar-icon1'
                      alt=''
                      src={avatar}
                    />
                  )}
                </>
              ))}
            </div>
            <div className='u2div-3'>
              {to.map((e: USER, i: number) => (
                <label>
                  {e.name}
                  {i + 1 !== to.length ? ', ' : ''}
                </label>
              ))}
            </div>
            <div className='u2div-4'>Members (Group)</div>
          </div>
        </>
      )}
    </>
  )
}

export default UserList
