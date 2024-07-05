import avatar from "../../Assets/Images/icon/blank-profile.jpg";
import onlineShow from "../../Assets/Images/icon/online.svg";
import { CHAT_TEXT } from "../../CommonFunction/constant";
import { DESKIE_API as API } from '../../config';
import { convertTimeToReadable } from "../../CommonFunction/Function";

const FromMessage = ({ ...props }) => {
    const {file_path} = props
    const types = ['png', 'jpg', 'jpeg', '3gp', 'svg']
    const nofilePath = `${process.env.REACT_APP_DOCOTEAM_API_URL}/icon/icon-file.svg`

    const isImage = (file:string) => {
        const exts = file.split(".")
        const ext = exts.pop()
        
        if (!ext) return false
        else return types.includes(ext)
    }
    
    return (
        <>
            {props.mode === CHAT_TEXT ? (
                <div className="div24">
                    <div className="message">
                        <div className="avatar1">
                            {/* <img className="avatar-icon1" alt="" src={`${API}/image/avatar/${props.avatar}`} /> */}
                            {props.avatar ? <img className="avatar-icon1" alt="" src={`${API}/${props.avatar}`} />
                                        : <img className="avatar-icon1" alt="" src={avatar} />
                                        }
                            { props.online_status ? (<div className="avatar-online-indicator">
                                <img alt="" src={onlineShow} />
                            </div>) : <></>}
                        </div>
                        <div className="message1">
                            <div className="hihow-are-things-with-our-ill-wrapper">
                                <div className="hihow-are-things">
                                    {props.message}
                                </div>
                            </div>
                            <div className="wrapper3">
                                <div className="div16">{convertTimeToReadable(props.created_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="div24">
                    <div className="message1">
                        <a className="message6" download={props.file_path} href={`${process.env.REACT_APP_DOCOTEAM_API_URL}/${props.file_path}`}>
                            <img
                                className="mask-group-icon"
                                alt=""
                                src={isImage(props.file_path) ? `${process.env.REACT_APP_DOCOTEAM_API_URL}/${props.file_path}` : nofilePath}
                            />
                        </a>
                        <div className="wrapper5">
                            <div className="div16">{convertTimeToReadable(props.created_at)}</div>
                        </div>
                    </div>
                </div>
            )}
        </>

    )
}

export default FromMessage