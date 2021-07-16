import React from 'react';
import Clip from './clip.js'
import './clips.css'


function Clips({ active_color, clips, colorids }) {
    // active_color === 1 means to show all clips
    const filtered_clips = clips.filter(
        clip => active_color === "1" || active_color === colorids[clip.colorid.id].value
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

    return (
        <React.Fragment>
            <div className="clips">
                {output}
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
