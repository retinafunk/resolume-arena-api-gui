import React, { useContext ,useState} from 'react'
import Clip from './clip.js'
import './clips.css'
import {ResolumeContext} from "./resolume_provider";
import { Range,Direction  } from 'react-range';


function Clips({ active_color, clips, colorids,layerIndex }) {

    const context = useContext(ResolumeContext);

    const [sliderValues,setSliderValues]=useState([]);

    console.log('Clips',clips);
    // active_color === 1 means to show all clips
    const filtered_clips = clips.filter(
        clip => active_color === 0 || active_color === colorids[clip.colorid.id].index
    );

    const output = filtered_clips.map((clip) =>
        <Clip
            id={clip.id}
            key={clip.id}
            name={clip.name}
            last_update={clip.thumbnail.last_update}
            selected={clip.selected}
            connected={clip.connected}
        />
    );

    const clearLayer = () => {
        context.action('trigger',`/composition/layers/${layerIndex}/clear`);
    }

    return (
        <React.Fragment>
            <div className="clips relative flex gap-4 overflow-x-scroll snap-mandatory snap-x h-1/3 border border-4 border-dotted border-teal-700 overflow-hidden  ">
                {output}
                <button className="fixed right-0 w-12 h-12 bg-black" onClick={() => clearLayer()}>X</button>
                <div className="fixed left-0">
                    
                </div>
            </div>

            {filtered_clips.length === 0 &&
                <div className="message">
                    <h1>Assign the color to a clip in Arena / Avenue and it will be shown here.</h1>                  
                </div>
            }
        </React.Fragment>
    );
}

export default Clips;
