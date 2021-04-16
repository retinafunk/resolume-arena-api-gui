import Parameter from './parameter.js'
import Effects from './effects.js'
import React from 'react'
import PropTypes from 'prop-types';
import ContextMenu from './context_menu.js';


// we need to draw outside of our container, but instead
// draw elsewhere in the html hierarchy
const effect_root = document.getElementById('effects');


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
        const menu_options = {
            'Beat Snap':                this.props.beatsnap,
            'Target':                   this.props.target,
            'Trigger Style':            this.props.triggerstyle,
            'Fader Start':              this.props.faderstart,
            'Ignore Column Trigger':    this.props.ignorecolumntrigger,
        };

        return (
            <div className="clip">
                <img
                    src={this.props.src}
                    onMouseDown={this.props.connect_down}
                    onMouseUp={this.props.connect_up}
                    alt={this.props.name.value}
                />

                <ContextMenu
                    name={this.props.name.value}
                    options={menu_options}
                    parameters={this.props.parameters}
                >
                    <div onClick={this.props.select}>
                        <Parameter
                            parameters={this.props.parameters}
                            readonly={true}
                            initial={this.props.name}
                            key={this.props.name.id}
                            id={this.props.name.id}
                        />
                    </div>
                </ContextMenu>

                {this.state.selected &&
                    <Effects
                        video={this.props.video}
                        parameters={this.props.parameters}
                        name="Clip"
                        root={effect_root}
                    />
                }
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
    parameters: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired
}

export default Clip;
