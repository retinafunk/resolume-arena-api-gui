import React from 'react'
import PropTypes from 'prop-types';

/**
  * Component for rendering a clip, responds to clicks
  * to activate the clip. Renders the clip name below.
  */
class Clip extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: props.selected.value };

        // the handler function for updates to the
        // selected property - e.g. when a clip
        // gets triggered by the user or autopilot
        this.on_update = (parameter) => {
            // extract selection value
            const selected = parameter.value;
            // update state
            this.setState({ selected });
        };
    }

    /**
      * Handle the component being mounted into
      * the browsers DOM
      */
    componentDidMount() {
        this.props.parameters.register_monitor(this.props.selected.id, this.on_update, this.props.selected);
    }

    /**
      * Handle the component being unmounted from
      * the browsers DOM
      */
    componentWillUnmount() {
        this.props.parameters.unregister_monitor(this.props.selected.id, this.on_update);
    }

    render() {
        return (
            <div id="clip" className={this.props.connected.index >= 3 ? 'connected' : ''}>
                <img className="thumbnail"
                    src={this.props.src}
                    onMouseDown={this.props.connect_down}
                    onMouseUp={this.props.connect_up}
                    alt={this.props.name.value}
                />                
                <div id="title" className={this.props.selected.value ? 'selected' : ''} onMouseDown={this.props.select}>{this.props.name.value}</div>
            </div>
        )
    }
}

/**
  * Property declaration for Clip component
  */
Clip.propTypes = {
    src: PropTypes.string.isRequired,
    select: PropTypes.func.isRequired,
    name: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    parameters: PropTypes.object.isRequired,
}

export default Clip;
