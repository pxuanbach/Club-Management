import React, { useState, useEffect } from 'react'
import {Container, Draggable} from 'react-smooth-dnd'
import './FormActivity.scss'
import Column from './Column'
import {mapOrder} from './utilities/sort'
import { initialData } from './action/initialData'
import {isEmpty} from 'lodash'

const FormActivity = ({ setShowForm }) => {
  const [board, setBoard] = useState({})
  const [columns,setColumns] = useState([])

  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
    if(boardFromDB){
      setBoard(boardFromDB)
      //sort column


      setColumns(mapOrder(boardFromDB.columns,boardFromDB.columnOrder,'id'))
    }
  },[])

  if(isEmpty(board)){
    return <div className='not-found' style={{'padding':'60px', 'color':'blue'}}>Board not found</div>
  }
  const onColumnDrop = (dropResult) => {
    console.log(dropResult)
  }
  return (
    <div  className='div-detail-activity'>
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
              <Column column={column} />
            </Draggable>
          ))}
        </Container>
      </div>
    </div>
  )
}

export default FormActivity




