import React from 'react'
import PropTypes from 'prop-types';
import Color from './color.js'

class Colors extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            active_color: "1"
        };

        this.on_update = (parameter) => {       
            this.setState({  });
        };
    }

    componentDidMount() {
        /* Watch colorid of all clips */
        for (let clip of this.props.clips)
            this.props.parameters.register_monitor(clip.colorid.id, this.on_update, clip.colorid);
    }

    componentWillUnmount() {
        /* Stop watching colorid's */
        for (let clip of this.props.clips)
            this.props.parameters.unregister_monitor(clip.colorid.id, this.on_update);
    }
    
    render() {
        
        /* Create array of color filter options */
        let color_filters = [];
        for (let i=0;i<6;++i)
        {
          color_filters[i] = {
             "id": String(i+1),
             "count": 0
          };
        }

        /* Count clips that match the different color filter options */
        for (let clip of this.props.clips) {
            color_filters[0].count++;
            color_filters[clip.colorid.index].count++;
        }

        const colors = color_filters.map((color) =>
            <Color
                key={color.id}
                id={color.id}
                count={color.count}        
                selected={this.props.is_active_color(color.id)}
                select={() => this.props.set_color(color.id)}
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
}

/**
  * Property declaration for Colors component
  */
Colors.propTypes = {
    clips: PropTypes.array.isRequired,
}

export default Colors;
