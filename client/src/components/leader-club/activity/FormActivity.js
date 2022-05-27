import React, { useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Snackbar, Alert } from '@mui/material';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import './FormActivity.scss'
import Column from './Column'
import { applyDrag } from './utilities/dragDrop'
import 'font-awesome/css/font-awesome.min.css'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../../helper/Axios'


const FormActivity = ({ match }) => {
  const { activityId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showSnackbar = (message) => {
    setAlertMessage(message)
    setOpenSnackbar(true);
  }

  const getColumnsActivity = (activityId) => {
    axiosInstance.get(`/activity/one/${activityId}`)
      .then(response => {
        //response.data
        setBoard(response.data)
        setColumns(response.data.boards)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })
  }

  useEffect(() => {
    getColumnsActivity(activityId)
  }, [])

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)
    //console.log('new columns', newColumns)
    setIsLoading(true);
    axiosInstance.patch(`/activity/updateboards/${activityId}`, 
    JSON.stringify({
      "boards": newColumns
    }), {
      headers: { 'Content-Type': 'application/json'}
    })
      .then(response => {
        //response.data
        console.log('new board', response.data)
        setColumns(response.data.boards)
        setBoard(response.data)
        setIsLoading(false)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })
  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      setIsLoading(true)
      let newColumns = [...columns]
      //console.log('Drop result', dropResult)
      let currentColumn = newColumns.find(c => c._id === columnId)
      //console.log('Current column', currentColumn)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)

      if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
        //move inside it's columns
        console.log('1')
        console.log(newColumns)
      } else {
        //move between two columns
        console.log('2')
      }

      setColumns(newColumns)
      //console.log(board)
      setIsLoading(false)

    }
  }

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(i => i.id === columnIdToUpdate)

    if (newColumnToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      console.log(newColumnToUpdate)
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }

  return (
    <BlockUi tag="div" blocking={isLoading} className='div-detail-activity'>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error">{alertMessage}</Alert>
      </Snackbar>
      <div className='div-back'>
        <Link className="btn-back"
          style={{ color: 'white' }}
          to={`${match}`}
        >
          <i class="fa-solid fa-angle-left"></i>
          Trở về
        </Link>
      </div>
      <div className='board-columns'>
        <Container
          orientation='horizontal'
          onDrop={onColumnDrop}
          getChildPayload={index => columns[index]}
          dragHandleSelector=".column-drag-handle"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'column-drop-preview'
          }}

        >
          {columns.map((column, index) => (
            <Draggable key={index}>
              <Column
                column={column}
                onCardDrop={onCardDrop}
                onUpdateColumn={onUpdateColumn}
              />
            </Draggable>
          ))}
        </Container>

      </div>
    </BlockUi>
  )
}

export default FormActivity




