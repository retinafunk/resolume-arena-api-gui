import React from 'react'
import Parameter from './parameter.js'
import PropTypes from 'prop-types'

/**
  * Component rendering a column within the composition
  */
function Column(props) {
    return (
        <div
            className={`column ${props.connected ? 'connected' : ''}`}
            onClick={props.connect}
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
  * Property declaration for Column component
  */
Column.propTypes = {
    connected: PropTypes.bool.isRequired,
    connect: PropTypes.func.isRequired
}

export default Column;
