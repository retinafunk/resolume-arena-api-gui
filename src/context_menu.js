import React from 'react'


/**
  * Component for rendering a parameter option
  * in a menu
  */
class MenuOption extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parameter: props.param,
            expand: false,
        };

        this.on_update = (update) => {
            let parameter = Object.assign({}, this.state.parameter, update);
            this.setState({ parameter });
        };

        this.expand = () => {
            this.setState({ expand: true });
        };

        this.close = () => {
            this.setState({ expand: false });
        }
    }

    /**
      * Register the parameter when the component
      * is added to the DOM
      */
    componentDidMount() {
        this.props.parameters.register_monitor(this.props.param.id, this.on_update, this.props.param);
    }

    /**
      * Unregister the parameter when the component
      * is about to be removed from the DOM
      */
    componentWillUnmount() {
        this.props.parameters.unregister_monitor(this.props.param.id, this.on_update);
    }

    /**
      * Handle an update to the parameter value
      *
      * @param  value   The new value for the parameter
      */
    handle_update(value) {
        this.props.parameters.update_parameter(this.props.param.id, value);
    }

    /**
      * Render the option
      */
    render() {
        const options = this.props.param.options.map((option, index) => {
            return (
                <div
                    className={`option ${index === this.state.parameter.index ? 'selected' : ''}`}
                    onClick={() => this.handle_update(index)}
                >
                    {option}
                </div>
            )
        });

        return (
            <div className="option" onMouseEnter={this.expand} onMouseLeave={this.close}>
                {this.props.name}
                {this.state.expand && 
                    <div className="sub-menu">{options}</div>
                }
            </div>
        )
    }
}


/**
  * Component for rendering a context menu
  */
class ContextMenu extends React.Component
{
    constructor(props) {
        super(props);
        this.state = { open: false };

        this.close_menu = (event) => {
            event.preventDefault();
            document.removeEventListener("click", this.close_menu);
            this.setState({ open: false });
        }

        this.open_menu = (event) => {
            event.preventDefault();
            document.addEventListener("click", this.close_menu);

            this.setState({
                open: true,
                x: event.pageX,
                y: event.pageY,
            });
        };
    }

    /**
      * Render the menu content
      */
    render() {
        const options = Object.entries(this.props.options).map((value) => {
            const name      = value[0];
            const option    = value[1];

            return (
                <MenuOption
                    name={name}
                    param={option}
                    parameters={this.props.parameters}
                    key={`menu_option_${option.id}`}
                />
            )
        });

        return (
            <React.Fragment>
                <span onContextMenu={this.open_menu}>
                    {this.props.children}
                </span>

                {this.state.open && 
                    <div className="context-menu" style={{ top: this.state.y, left: this.state.x }}>
                        <div className="label">{this.props.name}</div>
                        {options}
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default ContextMenu;
