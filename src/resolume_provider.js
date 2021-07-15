import React, { useState, createContext } from 'react';
import Transport from './transport.js'
import ParameterContainer from './parameter_container.js'

export const ResolumeContext = createContext();

function ResolumeProvider(props) {
    const [ composition, setComposition ]   = useState({ decks: [], layers: [], columns: [], layergroups: [] });
    const [ transport ]                     = useState(() => { return new Transport(props.host, props.port) });
    const [ parameters ]                    = useState(() => { return new ParameterContainer(transport) });

    transport.on_message(message => {
        // TODO: properly check the type, right now it's only for param updates
        if (typeof message.type !== 'string') {
            console.log('state update', message);
            setComposition(message);
        }
    });

    const properties = { composition, transport, parameters };

    return (
        <ResolumeContext.Provider value={properties}>
            {props.children}
        </ResolumeContext.Provider>
    )
}

export default ResolumeProvider;
