import React from 'react'
import PropTypes from 'prop-types';

class Color extends React.Component {

    render() {
        return (
            <div className="filter-container">
            <div className="color" style={{backgroundColor: `${this.props.value}`}} onMouseDown={this.props.select}>

            {this.props.selected &&
                <p>selected</p>
            }                 
            </div>
        </div>
        )
    }
}

/**
  * Property declaration for Clip component
  */
Color.propTypes = {
    id: PropTypes.number.isRequired,
}

export default Color;
