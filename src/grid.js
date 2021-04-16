import Transport from './transport.js'
import ParameterContainer from './parameter_container.js'
import Clip from './clip.js'
import Color from './color.js'
import React from 'react'
import PropTypes from 'prop-types';

class ColorItem {
  constructor(id, value) {
    this.id = id;
    this.value = value;
  }
}

/**
  * Component rendering the entire composition
  */
class Grid extends React.Component {
    /**
      * Constructor
      */
    constructor(props) {
        super(props);
        this.transport = new Transport(props.host, props.port);
        this.parameters = new ParameterContainer(this.transport);
        this.transport.on_message((message) => this.handle_message(message));
        this.state = {
            active_color: "1",
            colors: [],
            layers: []
        };
        this.state.colors.push(new ColorItem("1", "#4E4E4E"));
        this.state.colors.push(new ColorItem("2", "#C35839"));
        this.state.colors.push(new ColorItem("3", "#81B035"));
        this.state.colors.push(new ColorItem("4", "#00B285"));
        this.state.colors.push(new ColorItem("5", "#0077AF"));
        this.state.colors.push(new ColorItem("6", "#C22596"));
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

    set_color(id)
    {
        this.setState({
           'active_color': id
        });
    }

    is_active_color(id)
    {
      return this.state.active_color === id;
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
      * Connect a clip, possibly causing it to be displayed
      *
      * @param  id  The id of the clip to trigger
      */
    connect_clip(id, down) {
        // TODO: fix this weirdness with toggling 'selected', we should
        // find a better name for this parameter, because setting it to
        // false will not stop it being selected.
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/clips/by-id/${id}/connect`,
            value:      down,
        });
    }

    /**
      * Select a clip, triggering it for display
      *
      * @param  id  The id of the clip to trigger
      */
    select_clip(id) {
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/clips/by-id/${id}/select`,
        });
    }

    /**
      * Generate the component output
      */
    render() {


        let all_clips = [];
        for (let i=0;i<this.state.layers.length;++i)
        {
          for (let c=0;c<this.state.layers[i].clips.length;++c) 
          {
              let clip = this.state.layers[i].clips[c];
              if (clip.name.value.length > 0)
              {                  
                  if (this.state.active_color === "1" || clip.colorid.value === this.state.active_color)
                    all_clips.push(clip);
              }
          }
        }

        const colors = this.state.colors.map((color) =>
        <Color
            id={color.id}
            key={color.id}
            value={color.value}            
            selected={this.is_active_color(color.id)}
            select={() => this.set_color(color.id)}
        />
        );

        const clips = all_clips.map((clip) =>
        <Clip
            id={clip.id}
            key={clip.id}
            name={clip.name}
            src={this.clip_url(clip.id, clip.thumbnail.last_update)}
            connect_down={() => this.connect_clip(clip.id, true)}
            connect_up={() => this.connect_clip(clip.id, false)}
            select={() => this.select_clip(clip.id)}
            selected={clip.selected}
            parameters={this.parameters}
        />      
        );

        return (
            <React.Fragment>
                <div className="grid">
                    <div className="colors">
                      {colors}
                    </div>
                    <div className="clips">
                        {clips}
                    </div>
                </div>
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
