import { ResolumeContext } from './resolume_provider.js'
import ParameterMonitor from './parameter_monitor.js'
import Clips from './clips.js'
import Colors from './colors.js'
import React, { useState, useEffect, useContext } from 'react'

function Grid() {
    const context                               = useContext(ResolumeContext);
    const [ active_color, set_active_color ]    = useState(0);

    /**
     *  Extract all the clips from the layers and filter them
     *  on their connection state. There are 5 possible states:
     * "Empty", "Disconnected", "Previewing", "Connected", "Connected & previewing"
     */
    const clips = 
        Array.prototype.concat.apply([],                            // concatenate all arrays (which contain clips)
            context.composition.layers.map(layer => layer.clips)    // extract array of layers into an array of array of clips
        ).filter(clip => clip.connected.index !== 0);               // filter out all clips which have connected.index set to 0

    // extract the colors ids and put them in a map to be monitored
    const colorids = Object.fromEntries(clips.map(clip => [ clip.colorid.id, clip.colorid ]));

    return (
        <ParameterMonitor.Multiple parameters={colorids} render={colorids => {
            return (
                <React.Fragment>
                    {context.composition.name &&
                        <ParameterMonitor.Single parameter={context.composition.name} render={name => {
                            useEffect(() => { document.title = `Resolume ${context.product.name} - ${name.value}`; });
                            return (null);
                        }} />
                    }

                    <Colors
                        set_color={set_active_color}
                        active_color={active_color}
                        colorids={colorids}
                    />

                    <Clips
                        active_color={active_color}
                        clips={clips}
                        colorids={colorids}
                    />
                </React.Fragment>
            );
        }} />
    );
}

export default Grid;
