import React, { useState, createContext } from 'react';
import Transport from './transport.js'
import ParameterContainer from './parameter_container.js'

export const ResolumeContext = createContext();

function ResolumeProvider(props) {
    // the default product info if we are not connected to a backend
    const default_product = {
        name: '(disconnected)',
        major: 0,
        minor: 0,
        micro: 0,
        revision: 0
    };

    // the default composition to use when disconnected
    const default_composition = {
        decks: [],
        layers: [],
        columns: [],
        layergroups: []
    };

    // store the composition, give an initial value
    const [ composition, setComposition ]   = useState(default_composition);
    const [ connected, setConnected ]       = useState(false);
    const [ product, setProduct ]           = useState(default_product);

    // create a new transport and register connection state listeners
    const create_transport = () => {
        // create the transport
        let transport = new Transport(props.host, props.port);

        // maintain updated state
        transport.on_message(message => {
            // TODO: properly check the type, right now it's only for param updates
            if (typeof message.type !== 'string') {
                console.log('state update', message);
                setComposition(message);
            }
        });

        // register state handler
        transport.on_connection_state_change(is_connected => {
            // update connection state
            setConnected(is_connected);

            // revert to default product info on disconnection
            if (is_connected) {
                let xhr = new XMLHttpRequest();

                xhr.addEventListener('load', event => {
                    const product = JSON.parse(xhr.responseText);
                    setProduct(product)
                });

                xhr.open('GET', `//${props.host}:${props.port}/api/v1/product`);
                xhr.send();
            } else {
                setComposition(default_composition);
                setProduct(default_product);
            }
        });

        // register state change handler
        return transport;
    };

    const [ transport ]     = useState(create_transport);
    const [ parameters ]    = useState(() => { return new ParameterContainer(transport) });

    // execute an action on a parameter
    const action = (type, path, value) => {
        // create the message
        let message = {
            action:     type,
            parameter:  path
        };

        // if a value is given it should be added to the message
        if (value !== undefined) {
            message.value = value;
        }

        // now send the message over the transport
        transport.send_message(message);
    };

    const clip_url = (id, last_update) => {
        // is this the default clip (i.e. it has never been updated from its dummy
        if (last_update === "0") {
            return `//${props.host}:${props.port}/api/v1/composition/thumbnail/dummy`;
        } else {
            return `//${props.host}:${props.port}/api/v1/composition/clips/by-id/${id}/thumbnail/${last_update}`;
        }
    };

    const properties = {
        action,         // execute an action
        composition,    // the current composition state
        connected,      // whether we are currently connected to the server
        parameters,     // the parameter collection
        product,        // information on the product we are connected to
        transport,      // the transport for communicating with the backend
        clip_url        // get the url for a given clip
    };

    return (
        <ResolumeContext.Provider value={properties}>
            {props.children}
        </ResolumeContext.Provider>
    )
}

export default ResolumeProvider;
