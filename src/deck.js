import React from 'react'
import Parameter from './parameter.js'
import PropTypes from 'prop-types'

/**
  * Component rendering a deck within the composition
  */
function Deck(props) {
    return (
        <div
            className={`deck ${props.selected ? 'selected' : ''}`}
            onClick={props.select}
        >
            <Parameter
                parameters={props.parameters}
                initial={props.name}
                key={props.name.id}
                id={props.name.id}
            />
        </div>
    );
}

/**
  * Property declaration for Deck component
  */
Deck.propTypes = {
    selected: PropTypes.bool.isRequired,
    select: PropTypes.func.isRequired
}

export default Deck;
