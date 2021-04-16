import Transport from './transport.js'
import ParameterContainer from './parameter_container.js'
import Column from './column.js'
import Deck from './deck.js'
import Layer from './layer.js'
import Effects from './effects.js'
import React from 'react'
import PropTypes from 'prop-types';

// composition effect controls are rendered elseewhere
const effect_root = document.getElementById('composition');

/**
  * Component rendering the entire composition
  */
class Composition extends React.Component {
    /**
      * Constructor
      */
    constructor(props) {
        super(props);
        this.transport = new Transport(props.host, props.port);
        this.parameters = new ParameterContainer(this.transport);
        this.transport.on_message((message) => this.handle_message(message));
        this.state = {
            decks: [],
            columns: [],
            layers: [],
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
      * Connect the column with the given id
      *
      * @param  id  The id of the column to select
      */
    connect_column(id) {
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/columns/by-id/${id}/connect`,
            value:      true,
        });

        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/columns/by-id/${id}/connect`,
            value:      false,
        });
    }

    /**
      * Select the layer with the given id
      *
      * @param  id  The id of the layer to select
      */
    select_layer(id) {
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/layers/by-id/${id}/select`,
        });
    }

    /**
      * Clear the layer with the given id
      *
      * @param  id  The id of the layer to clear
      */
    clear_layer(id) {
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/layers/by-id/${id}/clear`,
        });
    }

    /**
      * Select the deck with the given id
      *
      * @param  id  The id of the deck to select
      */
    select_deck(id) {
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/decks/by-id/${id}/select`,
        });
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
        const columns = this.state.columns.map(column =>
            <Column
                key={column.id}
                name={column.name}
                connect={() => this.connect_column(column.id)}
                connected={column.connected.value}
                parameters={this.parameters}
            />
        );

        const layers = this.state.layers.map((layer, index) =>
            <Layer
                key={layer.id}
                name={layer.name}
                clips={layer.clips}
                select={() => this.select_layer(layer.id)}
                clear={() => this.clear_layer(layer.id)}
                clip_url={(id, last_update) => this.clip_url(id, last_update)}
                connect_clip={(id, down) => this.connect_clip(id, down)}
                select_clip={(id) => this.select_clip(id)}
                selected={layer.selected.value}
                parameters={this.parameters}
            />
        ).reverse();

        const decks = this.state.decks.map(deck =>
            <Deck
                key={deck.id}
                name={deck.name}
                select={() => this.select_deck(deck.id)}
                selected={deck.selected.value}
                parameters={this.parameters}
            />
        );

        return (
            <React.Fragment>
                <div className="composition">
                    <div className="columns">
                        {columns}
                    </div>
                    {layers}
                    <div className="decks">
                        {decks}
                    </div>
                </div>

                <Effects
                    video={this.state.video}
                    parameters={this.parameters}
                    name="Composition"
                    root={effect_root}
                />
            </React.Fragment>
        );
    }
}

/**
  * Property declaration for Composition component
  */
Composition.propTypes = {
    host: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired
}

export default Composition;
