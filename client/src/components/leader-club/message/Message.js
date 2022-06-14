import React, { useState, useEffect, useContext, useRef } from 'react'
import "./Message.css"
import {
  Snackbar, Alert,
} from '@mui/material';
import MessagesList from './Message-List';
import Input from './Input';
import PreviewFileDialog from '../../dialog/PreviewFileDialog';
import io from 'socket.io-client';
import { ENDPT } from '../../../helper/Helper'
import { UserContext } from '../../../UserContext';
import axiosInstance from '../../../helper/Axios';
import SeverityOptions from '../../../helper/SeverityOptions'

let socket;

const Message = ({ club_id }) => {
  const inputFile = useRef(null);
  const { user } = useContext(UserContext);
  const [file, setFile] = useState();
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [options, setOptions] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  const showSnackbar = (message, options) => {
    setOptions(options)
    setAlertMessage(message)
    setOpenSnackbar(true)
  }

  function isFileImage(file) {
    const fileType = file.type;
    return fileType.includes('spreadsheetml.sheet')
      || fileType.includes('ms-excel')
      || fileType.includes('image');
  }

  const handleFileChange = (event) => {
    if (isFileImage(event.target.files[0])) {
      setFile(event.target.files[0]);
      setOpenDialog(true)
    } else {
      showSnackbar('Tệp tải lên nên có định dạng excel, image.', SeverityOptions.warning)
    }
  };

  const handleSendFile = async () => {
    var formData = new FormData();
    formData.append("file", file);

    axiosInstance.post('/upload',
      formData, {
      headers: { "Content-Type": "multipart/form-data", }
    }).then(response => {
      socket.emit('sendMessage',
        user._id,
        file.type.includes('image') ? 'image' : 'file',
        response.data.original_filename,
        response.data.url,
        club_id,
        () => { }
      )
    }).catch(err => {
      showSnackbar(err.response.data.error, SeverityOptions.error)
    }).finally(() => {
      setFile(null)
    })
  }

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      //console.log(message)
      socket.emit('sendMessage', user._id, 'text', '', message, club_id, () => setMessage(''))
    }
  }

  useEffect(() => {
    socket = io(ENDPT);
    socket.emit('join', { user_id: user?._id, room_id: club_id })
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [])

  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message])
    })
  }, [messages]);

  useEffect(() => {
    socket.emit('get-messages-history', club_id)
    socket.on('output-messages', messages => {
      console.log(messages)
      setMessages(messages)
    })
  }, [])

  return (
    <div className='div-message-body'>
      <Snackbar
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={options}>{alertMessage}</Alert>
      </Snackbar>
      <PreviewFileDialog
        open={openDialog}
        setOpen={setOpenDialog}
        title="Xác nhận nội dung"
        file={file}
        resetFile={() => inputFile.current.value = ""}
        contentText={`Bạn có chắc muốn gửi tệp \b${file?.name}\b?`}
        handleAgree={handleSendFile}
      />
      {user && (<>
        <div className='div-mess'>
          <div className='header-mess'>
            <div className='name-mess'>Tin nhắn chung</div>
          </div>
          <div className='body-mess'>
            <MessagesList user={user} messages={messages} />
          </div>
          <div className='div-chat'>
            <div className='chat-todo'>
              <i onClick={() => inputFile.current.click()} class="fa-solid fa-file-image"></i>
              <input style={{ display: 'none' }}
                type="file"
                ref={inputFile}
                onChange={handleFileChange} />
            </div>
            <div className='div-text-chat'>
              <Input
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
              />
            </div>

          </div>
        </div>
      </>)}
    </div>
  )
}
export default Message




