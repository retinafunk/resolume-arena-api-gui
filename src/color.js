import React from 'react'
import PropTypes from 'prop-types';


function Color({ id, count, select, selected }) {
    const cln = "clr" + String(id+1);
    const idn = selected ? "filter-selected" : "filter-unselected";

    return (
        <div className={idn}>
            <div className={`filter ${cln}`} onMouseDown={select}>
                <div className="count">
                    {count}
                </div>
            </div>
        </div>
    )
}

/**
  * Property declaration for Color component
  */
Color.propTypes = {
    id: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    select: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
}

export default Color;
