import React, { useState, useEffect, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Button, TextareaAutosize } from '@mui/material'
import {Container, Draggable} from 'react-smooth-dnd'
import './Column.scss'
import Card from './Card'
import {mapOrder} from './utilities/sort'
import {cloneDeep} from 'lodash'

const ITEM_HEIGHT = 48;
const Column = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const { column, onCardDrop, onUpdateColumn } = props
    const cards = mapOrder(column.cards,column.cardOrder, 'id')

    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

    const newCardTextareaRef = useRef(null)

    const [newCardTitle, setNewCardTitle] = useState('')
    const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value)



    useEffect(() => {
        if(newCardTextareaRef && newCardTextareaRef.current){
            newCardTextareaRef.current.focus()
            newCardTextareaRef.current.select()
        }
    }, [openNewCardForm])

    const addNewCard = () => {
        if(!newCardTitle) {
            newCardTextareaRef.current.focus()
            return
        }

        const newCardToAdd = {
            id: Math.random().toString(36).substr(2, 5),
            boardId: column.boardId,
            columnId: column.id,
            title: newCardTitle.trim(),
            cover:null
        }
        let newColumn = cloneDeep(column)
        newColumn.cards.push(newCardToAdd)
        newColumn.cardOrder.push(newCardToAdd.id)

        onUpdateColumn(newColumn)
        setNewCardTitle('')
        toggleOpenNewCardForm()
 
    }


    return (
        <div className='column'>
        <header className='column-drag-handle'>
            <div className='column-title'>
                {column.title} 
            </div>   
            <div className='column-dropdown-actions'>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                    'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                    }}
                >
                   
                    <MenuItem  onClick={handleClose}>
                        Thêm thẻ
                    </MenuItem>
                    <MenuItem  onClick={handleClose}>
                        Xóa thẻ
                    </MenuItem>
                    <MenuItem  onClick={handleClose}>
                        Xóa tất cả thẻ
                    </MenuItem>
                    

                </Menu>
            </div>
        </header>
        <div className='card-list'>
            <Container
                groupName="dat-columns"
                onDrop={dropResult => onCardDrop(column.id, dropResult)}
                getChildPayload={index => cards[index]}
                dragClass="card-ghost"
                dropClass="card-ghost-drop"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'card-drop-preview'
                }}
                dropPlaceholderAnimationDuration={200}
            >
                {cards.map((card,index) => ( 
                    <Draggable key={index}>
                        <Card card={card} />
                    </Draggable>  
                ))}
            </Container>
            {openNewCardForm &&
                <div className='add-new-card-area'>
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Enter a title for this card..."
                        className='textarea-enter-new-card'
                        ref={newCardTextareaRef}
                        value={newCardTitle}
                        onChange={onNewCardTitleChange}
                        onKeyDown={event => (event.key === 'Enter') && addNewCard()}
                        
                    />
                </div>
            }
        </div>
        <footer>
            {openNewCardForm &&
                <div className='add-new-card-actions'>
                    <Button variant="contained" onClick={addNewCard}>Thêm thẻ</Button>
                    <span className='cancel-icon'  onClick={toggleOpenNewCardForm}>
                        <i className="fa fa-trash icon" />
                    </span>
                </div>
            }
            {!openNewCardForm &&
                <div className='footer-actions' onClick={toggleOpenNewCardForm}>
                    <i className="fa fa-plus" /> Thêm thẻ khác
                </div>
            }
        </footer>
    </div>
  )
}

export default Column