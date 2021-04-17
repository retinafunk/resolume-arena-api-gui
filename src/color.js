import React from 'react'
import PropTypes from 'prop-types';

class Color extends React.Component {


    render() {
        
        var cln = "clr" + this.props.id;

        return (
            <div className="filter-container">
            <div id="filter" className={cln} onMouseDown={this.props.select}>
            {this.props.count}
            {this.props.selected &&
                <div>#</div>
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
    id: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
}

export default Color;
