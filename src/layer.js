import Clip from './clip.js'
import React from 'react'
import Parameter from './parameter.js'
import PropTypes from 'prop-types';

/**
  * Render a layer, including all its associated clips
  */
function Layer(props) {
    const clips = props.clips.map((clip) => 
        <Clip
            id={clip.id}
            key={clip.id}
            src={props.clip_url(clip.id, clip.thumbnail.last_update)}
            name={clip.name}
            video={clip.video}
            connect_down={() => props.connect_clip(clip.id, true)}
            connect_up={() => props.connect_clip(clip.id, false)}
            select={() => props.select_clip(clip.id)}
            selected={clip.selected}
            parameters={props.parameters}
            beatsnap={clip.beatsnap}
            target={clip.target}
            triggerstyle={clip.triggerstyle}
            faderstart={clip.faderstart}
            ignorecolumntrigger={clip.ignorecolumntrigger}
        />
    );

    return (
        <div className={`layer ${props.selected ? 'selected' : ''}`}>            
            <div><input type="button" value="Clear" onClick={props.clear}/></div>
            <div className="control" onClick={props.select}>
                <Parameter
                    parameters={props.parameters}
                    initial={props.name}
                    key={props.name.id}
                    id={props.name.id}
                />
            </div>
            {clips}
        </div>
    );
}

/**
  * Property declaration for Layer component
  */
Layer.propTypes = {
    clips: PropTypes.array.isRequired,
    selected: PropTypes.bool.isRequired,
    select: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    parameters: PropTypes.object.isRequired
}

export default Layer;
