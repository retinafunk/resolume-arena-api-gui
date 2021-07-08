import Transport from './transport.js'
import ParameterContainer from './parameter_container.js'
import Clip from './clip.js'
import Colors from './colors.js'
import React from 'react'
import PropTypes from 'prop-types';

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.transport = new Transport(props.host, props.port);
        this.parameters = new ParameterContainer(this.transport);
        this.transport.on_message((message) => this.handle_message(message));
        this.state = {
            layers: [],
            active_color: "1"
        };
    }

    /**
      * Handle incoming messages
      *
      * @param  message The message coming from the server
      */
    handle_message(message) {
        // TODO: properly check the type, right now it's only for param updates
        if (typeof message.type !== 'string') {
            this.setState(message);
        }
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
      * @param  id  The id of the clip to trigger
      */
    connect_clip(id, down) {
        this.transport.send_message({
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
        this.transport.send_message({
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
        this.setState( {active_color: value });
    }    

    is_active_color(value) {
        return this.state.active_color === value;
    }

    render() {

        /* Gather all clips that are not empty */
        let active_clips = [];

        for (let layer of this.state.layers) {
          for (let clip of layer.clips) {
            /**
             * Connected has 5 possible states 
             * "Empty", "Disconnected", "Previewing", "Connected", "Connected & previewing"
            */
            if (clip.connected.index !== 0)
            active_clips.push(clip);
          }
        }

        /* Pass clips to Colors component, it will watch the colorid parameter of the individual clips 
         * and report back when active color changes
        */
        const colors = (  
          <Colors
              key="Colors"
              set_color={(value) => this.set_active_color(value)}
              is_active_color={(value) => this.is_active_color(value)}
              clips={active_clips}
          />
        );
        
        /* Check all clips and see which ones match the current active color filter setting */
        let filtered_clips = [];
        
        for (let clip of active_clips) {
            if (this.state.active_color === "1" || clip.colorid.value === this.state.active_color)
              filtered_clips.push(clip);
        }

        const clips = filtered_clips.map((clip) =>
          <Clip
              id={clip.id}
              key={clip.id}
              name={clip.name}
              src={this.clip_url(clip.id, clip.thumbnail.last_update)}
              connect_down={() => this.connect_clip(clip.id, true)}
              connect_up={() => this.connect_clip(clip.id, false)}
              select={() => this.select_clip(clip.id)}
              selected={clip.selected}
              connected={clip.connected}
              parameters={this.parameters}
          />      
        );

        return (
            <React.Fragment>
                {colors}                   
                <div className="grid">
                  {clips}
                </div>
                {filtered_clips.length === 0 &&
                  <div className="message">
                    <h1>Assign the color to a clip in Arena / Avenue and it will be shown here.</h1>                  
                  </div>
                }
            </React.Fragment>
        );        
    }
}

/**
  * Property declaration for Composition component
  */
Grid.propTypes = {
    host: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired
}

export default Grid;
