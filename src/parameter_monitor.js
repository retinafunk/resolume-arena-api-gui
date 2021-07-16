import React, { useState, useContext, useEffect } from 'react';
import { ResolumeContext } from './resolume_provider.js'


/**
 *  Internal monitor class
 *
 *  Monitors a single parameter and invokes onChange
 *  when the parameter value changes.
 */
function Monitor(props) {
    const { parameters }            = useContext(ResolumeContext);
    const { parameter, onChange }   = props;

    // register the monitor, the returned function is invoked when the
    // component leaves scope, or when the parameter id prop is changed
    useEffect(() => {
        parameters.register_monitor(parameter.id, onChange, parameter);
        return () => { parameters.unregister_monitor(parameter.id, onChange); };
    }, [parameter.id]);

    // we don't render anything from here
    return (null);
}

const ParameterMonitor = {
    Single: function({ parameter, render }) {
        const [ state, setState ] = useState(parameter);

        return (
            <React.Fragment>
                <Monitor parameter={parameter} onChange={setState} key={parameter.id} />
                {render(state)}
            </React.Fragment>
        );
    },

    Multiple: function({ parameters, render }) {
        const [ state, setState ] = useState({});

        const onChange = parameter => {
            setState(prevState => {
                const update = { [parameter.id]: parameter };
                return { ...prevState, ...update };
            })
        };

        const monitored = Object.values(parameters).map(parameter => (
            <Monitor parameter={parameter} onChange={onChange} key={parameter.id} />
        ));

        // merge parameters with updated state
        // use spread syntax to ensure copies of the object
        let merged = { ...parameters };
        for (const id in state) {
            const parameter = state[id];

            if (parameter !== undefined) {
                merged[id] = { ...parameter };
            }
        }

        return (
            <React.Fragment key={merged}>
                {monitored}
                {render(merged)}
            </React.Fragment>
        );
    }
};


export default ParameterMonitor;
