import React from 'react'
import PropTypes from 'prop-types';
import Color from './color.js'

class Colors extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active_color: "1",
            subscriptions: []
        };

        this.on_update = (parameter) => {       
            // update the parameter state
            this.setState(state => {
                // find the clip using this color id
                const subscriptions = state.subscriptions;
                const clip = subscriptions.find(clip => clip.colorid.id === parameter.id);

                // we should, as a rule, be able to find the matching clip
                // but who knows, if a clip changes at just the right moment
                if (clip === undefined) {
                    console.log("Failed to find clip for parameter", parameter, state.subscriptions);
                    return;
                }

                // update the clip parameter data
                clip.colorid = parameter;

                // signal clip update to parent
                this.props.update_clip(clip);

                // now use the updated state
                return { subscriptions };
            });
        };
    }

    /**
     *  Add subscriptions to newly added parameters
     *  and remove those from parameters no longer
     *  available to us
     */
    resolveSubscriptions() {
        // avoid endless update loop: abort if subscriptions
        // were previously resolved and no changes are detected
        if (this.props.clips === this.state.subscriptions) {
            return;
        }

        // generate a sorted list of clips that should be monitored
        const subscriptions = this.props.clips.sort((lhs, rhs) => lhs.id - rhs.id);

        // generate list of new clips and clips that need to be removed
        const fresh = subscriptions.filter(clip => !this.state.subscriptions.find(match => clip.id === match.id));
        const stale = this.state.subscriptions.filter(clip => !subscriptions.find(match => clip.id === match.id));

        // subscribe to fresh parameters
        for (const clip of fresh) {
            console.log("Subscribing to fresh clip", clip);
            this.props.parameters.register_monitor(clip.colorid.id, this.on_update, clip.colorid);
        }

        // unsubscribe the stale parameters
        for (const clip of stale) {
            console.log("Unsubscribing from stale clip", clip)
            this.props.parameters.unregister_monitor(clip.colorid.id, this.on_update);
        }

        // update state with new clip data
        this.setState({ subscriptions });
    }

    componentDidMount() {
        this.resolveSubscriptions();
    }

    componentDidUpdate() {
        this.resolveSubscriptions();
    }

    componentWillUnmount() {
        /* Stop watching colorid's */
        for (let clip of this.props.clips)
            this.props.parameters.unregister_monitor(clip.colorid.id, this.on_update);
    }
    
    render() {
        /* Create array of color filter options */
        let color_filters = [];
        for (let i=0;i<6;++i)
        {
          color_filters[i] = {
             "id": String(i+1),
             "count": 0
          };
        }

        /* Count clips that match the different color filter options */
        for (const clip of this.state.subscriptions) {
            color_filters[0].count++;
            color_filters[clip.colorid.index].count++;
        }

        const colors = color_filters.map((color) =>
            <Color
                key={color.id}
                id={color.id}
                count={color.count}        
                selected={this.props.is_active_color(color.id)}
                select={() => this.props.set_color(color.id)}
            />
        );

        return (
            <div>              
              <div className="colors">
                <div className="filter-container">
                    {colors}
                </div>
              </div>              
            </div>
        );

    }
}

/**
  * Property declaration for Colors component
  */
Colors.propTypes = {
    clips: PropTypes.array.isRequired,
}

export default Colors;
