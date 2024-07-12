import avatar from "../../Assets/Images/icon/blank-profile.jpg";
import onlineShow from "../../Assets/Images/icon/online.svg";
import { CHAT_FILE, CHAT_TEXT } from "../../CommonFunction/constant";
import { convertTimeToReadable, fromNow } from "../../CommonFunction/Function";
import { DESKIE_API as API } from '../../config';


const ToMessage = ({ ...props }) => {
    const { file_path } = props
    const types = ['png', 'jpg', 'jpeg', '3gp', 'svg']
    const nofilePath = `${process.env.REACT_APP_DOCOTEAM_API_URL}/icon/icon-file.svg`

    const isImage = (file: string) => {
        const exts = file.split(".")
        const ext = exts.pop()

        if (!ext) return false
        else return types.includes(ext)
    }

    return (
        <>
            {
                props.mode === CHAT_TEXT ?
                    (<div className="message7">
                        <div className="message8">
                            <div className="hi-im-working-on-the-final-sc-wrapper">
                                <div className="hihow-are-things">
                                    {props.message}
                                </div>
                            </div>
                            <div className="wrapper6">
                                <div className="div16">{convertTimeToReadable(props.created_at)}</div>
                            </div>
                        </div>
                        {/* <img className="avatar-icon1" alt="" src={`${API}/image/avatar/${props.avatar}`} /> */}

                        <div className="avatar">
                            {props.avatar ? <img className="avatar-icon1" alt="" src={`${API}/${props.avatar}`} />
                                : <img className="avatar-icon1" alt="" src={avatar} />
                            }
                            {props.online_status ? (<div className="avatar-online-indicator">
                                <img alt="" src={onlineShow} />
                            </div>) : <></>}
                        </div>
                    </div>) : (
                        <div className="message7">
                            <div className="message8">
                                <div className="message5">
                                    <img
                                        className="mask-group-icon"
                                        alt=""
                                        src={isImage(props.file_path) ? `${process.env.REACT_APP_DOCOTEAM_API_URL}/${props.file_path}` : nofilePath}
                                    />
                                </div>
                                <div className="wrapper5">
                                    <div className="div16">{convertTimeToReadable(props.created_at)}</div>
                                </div>
                            </div>
                        </div>)
            }
        </>
    )
}

export default ToMessage