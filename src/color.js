import React from 'react'
import PropTypes from 'prop-types';

class Color extends React.Component {

    render() {        
        const cln = "clr" + this.props.id;
        const idn = this.props.selected ? "filter-selected" : "filter-unselected";
        return (
            <div className={idn}>             
                <div className={`filter ${cln}`} onMouseDown={this.props.select}>
                    <div className="count">
                        {this.props.count}     
                    </div>       
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
