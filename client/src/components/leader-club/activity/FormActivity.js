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
import { cloneDeep } from 'lodash';


const FormActivity = ({ match, isLeader }) => {
  const { activityId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showSnackbar = (message) => {
    setAlertMessage(message)
    setOpenSnackbar(true);
  }

  const handleUpdateBoards = (newColumns) => {
    setIsLoading(true)
    axiosInstance.patch(`/activity/updateboards/${activityId}`,
      JSON.stringify({
        "boards": newColumns
      }), {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        //response.data
        console.log('new board', response.data)
        setColumns(response.data.boards)
        setIsLoading(false)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })
  }

  const handleUpdateColumn = async (updateColumn, card = null) => {
    setIsLoading(true)
    await axiosInstance.patch(`/activity/updatecolumn/${activityId}`,
      JSON.stringify({
        "column": updateColumn,
        "card": card
      }), {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        //response.data
        setColumns(response.data.boards)
        setIsLoading(false)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      }) 
      setIsLoading(false)
  }

  const handleCreateCard = (activityId, columnId, title) => {
    setIsLoading(true)
    axiosInstance.post(`/activity/createcard`,
      JSON.stringify({
        "activityId": activityId,
        "columnId": columnId,
        "title": title
      }), {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        //response.data
        setColumns(response.data.boards)
        setIsLoading(false)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })
  }

  const getColumnsActivity = (activityId) => {
    setIsLoading(true);
    axiosInstance.get(`/activity/one/${activityId}`)
      .then(response => {
        //response.data
        setColumns(response.data.boards)
        setIsLoading(false);
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
    handleUpdateBoards(newColumns)
  }

  const onCardDrop = (columnId, dropResult) => {
    //console.log('Drop result', dropResult)
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = cloneDeep(columns)
      //console.log('New column', newColumns)
      
      let currentColumn = newColumns.find(c => c._id === columnId)
      
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      //console.log('Current column 2', currentColumn)

      if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
        //replace card in activity.boards[index].cards
        handleUpdateColumn(currentColumn).catch(() => setColumns(newColumns))
      } else {
        if (dropResult.addedIndex !== null) {
          console.log('Current column add', currentColumn)
          let currentCard = cloneDeep(dropResult.payload)
          currentCard.columnId = currentColumn._id;
          console.log('new card in column', currentCard)
          //api update column 
          handleUpdateColumn(currentColumn, currentCard).catch(() => setColumns(newColumns))
        }
      }
      //setColumns(newColumns)
    }
  }

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate._id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(i => i._id === columnIdToUpdate)
    console.log(newColumns)

    if (newColumnToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      console.log(newColumnToUpdate)
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    setColumns(newColumns)
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
              isLeader={isLeader}
                column={column}
                onCardDrop={onCardDrop}
                onUpdateColumn={onUpdateColumn}
                handleCreateCard={handleCreateCard}
              />
            </Draggable>
          ))}
        </Container>

      </div>
    </BlockUi>
  )
}

export default FormActivity




