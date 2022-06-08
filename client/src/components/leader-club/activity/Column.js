import React, { useState, useEffect, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Button, TextareaAutosize } from '@mui/material'
import { Container, Draggable } from 'react-smooth-dnd'
import './Column.scss'
import Card from './Card'
import { useParams } from 'react-router-dom'

const ITEM_HEIGHT = 48;
const Column = (props) => {
    const { activityId } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { column, onCardDrop, onUpdateColumn, handleCreateCard, isLeader } = props
    let cards = column.cards

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

    const newCardTextareaRef = useRef(null)

    const [newCardTitle, setNewCardTitle] = useState('')
    const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value)

    const addNewCard = () => {
        if (!newCardTitle) {
            newCardTextareaRef.current.focus()
            return
        }

        console.log(column._id, activityId, newCardTitle.trim())
        handleCreateCard(activityId, column._id, newCardTitle.trim())

        setNewCardTitle('')
        toggleOpenNewCardForm()
    }

    const handleDeleteAllCard = (e) => {
        e.preventDefault();

        handleClose()
    }

    useEffect(() => {
        if (newCardTextareaRef && newCardTextareaRef.current) {
            newCardTextareaRef.current.focus()
            newCardTextareaRef.current.select()
        }
    }, [openNewCardForm])

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
                                width: 'max-content',
                            },
                        }}
                    >
                        <MenuItem onClick={() => {
                            toggleOpenNewCardForm();
                            handleClose()
                        }}>
                            Thêm thẻ
                        </MenuItem>
                        <MenuItem onClick={handleDeleteAllCard}>
                            Xóa tất cả thẻ
                        </MenuItem>
                    </Menu>
                </div>
            </header>
            <div className='card-list'>
                <Container
                    groupName="dat-columns"
                    onDrop={dropResult => onCardDrop(column._id, dropResult)}
                    getChildPayload={index => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-preview'
                    }}
                    dropPlaceholderAnimationDuration={200}
                    shouldAcceptDrop={() => { return isLeader; }}
                >
                    {cards.map((card, index) => (
                        <Draggable disabled={isLeader} key={index}>
                            <Card
                                card={card}
                                isLeader={isLeader}
                            />
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
                {isLeader ?
                    <>
                        {openNewCardForm &&
                            <div className='add-new-card-actions'>
                                <Button variant="contained" onClick={addNewCard}>Thêm thẻ</Button>
                                <span className='cancel-icon' onClick={toggleOpenNewCardForm}>
                                    <i className="fa fa-trash icon" />
                                </span>
                            </div>
                        }
                        {!openNewCardForm &&
                            <div className='footer-actions' onClick={toggleOpenNewCardForm}>
                                <i className="fa fa-plus" /> Thêm thẻ khác
                            </div>
                        }
                    </> : <></>}
            </footer>
        </div>
    )
}

export default Column