import React, { useState } from 'react';
import Parameter from './parameter.js'

/**
  * Render a single effect in the
  * effect chain (renderpass)
  */
function Effect(props) {
    const [ expanded, setExpanded ] = useState(true);

    const name = props.name;
    const params = Object.entries(props.mixer || {}).concat(Object.entries(props.params).concat(Object.entries(props.effect || {})));

    const parameters = params.map((value) => {
        const name = value[0];
        const param = value[1];

        // do not render parameters that are supposed to be hidden
        // (should we be doing this in the frontend?)
        if (param.view && param.view.visible === false) {
            return null;
        }

        return (
            <div key={`parameter_wrapper_${param.id}`}>
                <span className="label">{name}</span>
                <Parameter
                    parameters={props.parameters}
                    key={param.id}
                    id={param.id}
                    initial={param}
                />
            </div>
        )
    });

    return (
        <React.Fragment>
            <div className="title">
                <span
                    onClick={() => setExpanded(!expanded)}
                    className={`arrow ${expanded ? 'down' : 'right'}`}
                ></span>
                {name}
            </div>
            {expanded && 
                <div className="content">
                    {parameters}
                </div>
            }
        </React.Fragment>
    )
}

export default Effect
