import React, { useContext } from 'react'
import { ResolumeContext } from './resolume_provider.js'
import PropTypes from 'prop-types';

/**
  * Component for rendering a clip, responds to clicks
  * to trigger the clip.
*/
function Clip(props) {
    // get access to the resolume provider for triggering actions
    const context = useContext(ResolumeContext);

    // define select and connection functions
    const select    = ()        => { context.action('trigger', `/composition/clips/by-id/${props.id}/select`);          }
    const connect   = (down)    => { context.action('trigger', `/composition/clips/by-id/${props.id}/connect`, down);   };

    /**
      * Connected has 5 possible states 
      * "Empty", "Disconnected", "Previewing", "Connected", "Connected & previewing"
      */
    const connected = props.connected.index >= 3;
    const name      = props.name.value.length > 23 ? props.name.value.substring(0,22) + "..." : props.name.value;
    const src       = context.clip_url(props.id, props.last_update);

    return (
        <div>              
            <div className={`clip ${connected ? 'connected' : 'none'}`}>
                <img className="thumbnail"
                    src={src}
                    onMouseDown={() => connect(true)}
                    onMouseUp={() => connect(false)}
                    alt={props.name.value}
                />                
            </div>              
            <div className={`handle ${props.selected.value ? 'selected' : ''}`} onMouseDown={select}>
                {name}
            </div>
        </div>
    )
}

/**
  * Property declaration for Clip component
  */
Clip.propTypes = {
    last_update: PropTypes.string.isRequired,
    name: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
}

export default Clip;
