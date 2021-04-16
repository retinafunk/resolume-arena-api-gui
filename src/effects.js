import React from 'react'
import ReactDOM from 'react-dom'
import Effect from './effect.js'
import Parameter from './parameter.js'


class Effects extends React.Component {
    constructor(props) {
        super(props);
        this.element = document.createElement('div');
    }

    componentDidMount() {
        this.props.root.appendChild(this.element);
    }

    componentWillUnmount() {
        this.props.root.removeChild(this.element);
    }

    render() {
        // do we even have a video to render effects for?
        if (!this.props.video) {
            return null;
        }

        // the elements to show
        const elements = this.props.video.effects.map((value) => {
            return (
                <Effect
                    key={`effect_${value.name}`}
                    name={value.name}
                    mixer={value.mixer}
                    params={value.params}
                    effect={value.effect}
                    parameters={this.props.parameters}
                />
            );
        });

        const effects = (
            <div className="effects">
                <div className="title">{this.props.name}</div>
                <div className="content">
                    <div>
                        <span className="label">Opacity</span>
                        <Parameter
                            parameters={this.props.parameters}
                            key={this.props.video.opacity.id}
                            id={this.props.video.opacity.id}
                            initial={this.props.video.opacity}
                        />
                    </div>
                    <div>
                        <span className="label">Width</span>
                        <Parameter
                            parameters={this.props.parameters}
                            key={this.props.video.width.id}
                            id={this.props.video.width.id}
                            initial={this.props.video.width}
                        />
                    </div>
                    <div>
                        <span className="label">Height</span>
                        <Parameter
                            parameters={this.props.parameters}
                            key={this.props.video.height.id}
                            id={this.props.video.height.id}
                            initial={this.props.video.height}
                        />
                    </div>
                    {elements}
                </div>
            </div>
        );

        return ReactDOM.createPortal(
            effects,
            this.element
        );
    }
}

export default Effects
