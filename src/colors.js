import React from 'react'
import PropTypes from 'prop-types';
import Color from './color.js'


function Colors({ colorids, active_color, set_color }) {
    /* Create array of color filter options */
    let color_filters = [];
    for (let i=0;i<6;++i) {
        color_filters[i] = {
            id: String(i+1),
            count: 0
        };
    }

    /* Count colors that match the different color filter options */
    for (const colorid of Object.values(colorids)) {
        color_filters[0].count++;
        color_filters[colorid.index].count++;
    }

    const colors = color_filters.map((color) =>
        <Color
            key={color.id}
            id={color.id}
            count={color.count}        
            selected={active_color === color.id}
            select={() => set_color(color.id)}
        />
    );

    return (
        <div>              
          <div className="colors">
            <div className="filter-container">
                {colors}
            </div>
          </div>              
        </div>
    );
}

/**
  * Property declaration for Colors component
  */
Colors.propTypes = {
    active_color: PropTypes.string.isRequired,
    set_color: PropTypes.func.isRequired,
    colorids: PropTypes.object.isRequired,
}

export default Colors;
