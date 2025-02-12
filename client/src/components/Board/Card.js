import "../../styles/Card.css"

import React, { Component } from "react"
import { Draggable } from "react-beautiful-dnd"
import { connect } from "react-redux"

import CardEditor from "./CardEditor"

class Card extends Component {
    state = {
        hover: false,
        editing: false,
    }

    startHover = () => this.setState({ hover: true })
    endHover = () => this.setState({ hover: false })

    startEditing = () =>
        this.setState({
            hover: false,
            editing: true,
            cardPetName: this.props.card.cardPetName,
            text: this.props.card.text,
        })

    endEditing = () => this.setState({ hover: false, editing: false })

    editCard = async text => {
        const { card, dispatch } = this.props

        this.endEditing()

        dispatch({
            type: "CHANGE_CARD_TEXT",
            payload: { cardId: card._id, cardText: text, cardPetName: text },
        })
    }

    deleteCard = async () => {
        const { listId, card, dispatch } = this.props

        if (window.confirm("Are you sure to delete this card?")) {
            dispatch({
                type: "DELETE_CARD",
                payload: { cardId: card._id, listId },
            })
        }
    }

    render() {
        const { card, index } = this.props
        const { hover, editing } = this.state

        if (!editing) {
            return (
                <Draggable draggableId={card._id} index={index}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="Card"
                            onMouseEnter={this.startHover}
                            onMouseLeave={this.endHover}
                        >
                            {hover && (
                                <div className="Card-Icons">
                                    <div className="Card-Icon" onClick={this.startEditing}>
                                        <ion-icon name="create" />
                                    </div>
                                </div>
                            )}
                            {card.cardPetName}
                            {card.text}
                        </div>
                    )}
                </Draggable>
            )
        } else {
            return (
                <CardEditor text={card.text} photo={card.photo} onDelete={this.deleteCard} onCancel={this.endEditing} />
            )
        }
    }
}

const mapStateToProps = (state, ownProps) => ({
    card: state.cardsById[ownProps.cardId],
})

export default connect(mapStateToProps)(Card)
