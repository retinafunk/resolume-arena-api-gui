import React from 'react'
import PropTypes from 'prop-types';

class Color extends React.Component {

    render() {        
        let cln = "clr" + this.props.id;
        let idn = this.props.selected ? "filter-selected" : "filter-unselected";
        return (
            <div className={idn}>             
                <div className={`filter ${cln}`} onMouseDown={this.props.select}>
                    {this.props.count}            
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
