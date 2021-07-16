import { ResolumeContext } from './resolume_provider.js'
import ParameterMonitor from './parameter_monitor.js'
import Clips from './clips.js'
import Colors from './colors.js'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types';

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active_color: "1"
        };
    }

    /**
      * Get the URI to show a given clip
      *
      * @param  id          The id of the clip to display
      * @param  last_update The timestamp the thumbnail was last updated
      */
    clip_url(id, last_update) {
        // is this the default clip (i.e. it has never been updated from its dummy
        if (last_update === "0") {
            return `http://${this.props.host}:${this.props.port}/api/v1/composition/thumbnail/dummy`;
        } else {
            return `http://${this.props.host}:${this.props.port}/api/v1/composition/clips/by-id/${id}/thumbnail/${last_update}`;
        }
    }

    /**
      * Connect a clip
      *
      * @param  id  The id of the clip to connect
      */
    connect_clip(id, down) {
        this.context.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/clips/by-id/${id}/connect`,
            value:      down,
        });
    }

    /**
      * Select a clip
      *
      * @param  id  The id of the clip to select
      */
    select_clip(id) {
        this.context.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/clips/by-id/${id}/select`,
        });
    }

    /**
      * Set active color filter
      *
      * @param  value  The color to set as active color (filter)
      */
    set_active_color(value) {
        this.setState( { active_color: value });
    }

    render() {
        // convert composition state to an array of clips that are
        // filled with something (an audio- and/or video stream)
        const clips = (() => {
            // extract the clips from the composition state
            let clips = [];

            for (const layer of this.context.composition.layers) {
                for (const clip of layer.clips) {
                    /**
                      * Connected has 5 possible states
                      * "Empty", "Disconnected", "Previewing", "Connected", "Connected & previewing"
                      */
                    if (clip.connected.index !== 0) {
                        clips.push(clip);
                    }
                }
            }

            return clips;
        })();

        // extract the colors ids and put them in a map to be monitored
        const colorids = Object.fromEntries(clips.map(clip => [ clip.colorid.id, clip.colorid ]));

        return (
            <ParameterMonitor.Multiple parameters={colorids} render={colorids => {
                return (
                    <React.Fragment>
                        {this.context.composition.name &&
                            <ParameterMonitor.Single parameter={this.context.composition.name} render={name => {
                                useEffect(() => { document.title = `Resolume ${this.context.product.name} - ${name.value}`; });
                                return (null);
                            }} />
                        }

                        <Colors
                            set_color={(value) => this.set_active_color(value)}
                            active_color={this.state.active_color}
                            colorids={colorids}
                        />

                        <Clips
                            active_color={this.state.active_color}
                            clips={clips}
                            colorids={colorids}
                            clip_url={(id, last_update) => this.clip_url(id, last_update)}
                            connect_clip={(id, down) => this.connect_clip(id, down)}
                            select_clip={id => this.select_clip(id)}
                        />
                    </React.Fragment>
                );
            }} />
        );
    }
}

/**
 *  Declare the context type used
 */
Grid.contextType = ResolumeContext;

/**
  * Property declaration for Grid component
  */
Grid.propTypes = {
    host: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired
}

export default Grid;
