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

        // register state handler
        transport.on_connection_state_change(is_connected => {
            console.log(is_connected);

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

    transport.on_message(message => {
        // TODO: properly check the type, right now it's only for param updates
        if (typeof message.type !== 'string') {
            console.log('state update', message);
            setComposition(message);
        }
    });

    const properties = { composition, transport, parameters, connected, product };

    return (
        <ResolumeContext.Provider value={properties}>
            {props.children}
        </ResolumeContext.Provider>
    )
}

export default ResolumeProvider;
