import React from 'react'
import { ResolumeContext } from './resolume_provider.js'
import PropTypes from 'prop-types';

/**
  * Component for rendering a clip, responds to clicks
  * to trigger the clip.
*/
class Clip extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: props.selected.value };

        // the handler function for updates to the
        // selected property of a clip
        this.on_update = (parameter) => {
            // extract selection value
            const selected = parameter.value;
            // update state
            this.setState({ selected });
        };
    }

    componentDidMount() {
        this.context.parameters.register_monitor(this.props.selected.id, this.on_update, this.props.selected);
    }

    componentWillUnmount() {
        this.context.parameters.unregister_monitor(this.props.selected.id, this.on_update);
    }

    render() {
        /**
          * Connected has 5 possible states 
          * "Empty", "Disconnected", "Previewing", "Connected", "Connected & previewing"
          */
        const connected = this.props.connected.index >= 3;
        const name = this.props.name.value.length > 23 ? this.props.name.value.substring(0,22) + "..." : this.props.name.value;
        return (
            <div>              
              <div className={`clip ${connected ? 'connected' : ''}`}>
                  <img className="thumbnail"
                      src={this.props.src}
                      onMouseDown={this.props.connect_down}
                      onMouseUp={this.props.connect_up}
                      alt={this.props.name.value}
                  />                
              </div>              
              <div className={`handle ${this.props.selected.value ? 'selected' : ''}`} onMouseDown={this.props.select}>
                {name}
              </div>                
            </div>
            
        )
    }
}

/**
 *  Declare the context type used
 */
Clip.contextType = ResolumeContext;

/**
  * Property declaration for Clip component
  */
Clip.propTypes = {
    src: PropTypes.string.isRequired,
    select: PropTypes.func.isRequired,
    name: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
}

export default Clip;
