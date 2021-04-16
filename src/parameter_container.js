/**
  * Class maintaining a collection of monitored
  * parameters. It can be used by registering a
  * callback to be invoked for a given parameter.
  */
class ParameterContainer
{
    /**
      * Constructor
      *
      * @param  transport   The transport for communicating with arena
      */
    constructor(transport) {
        this.transport = transport;
        this.parameters = {};

        transport.on_message((message) => {
            // the event types we listen to
            const event_types = ['parameter_get', 'parameter_set', 'parameter_update', 'parameter_subscribed'];

            // is this a message containing parameter data
            if (!event_types.includes(message.type) || typeof message.id !== 'number' || typeof message.value === 'undefined') {
                return;
            }

            // retrieve the storage for the given parameter
            let parameter = this.parameters[message.id];

            // do we have handlers for the given parameter?
            if (typeof parameter === 'undefined') {
                return;
            }

            // store updated parameter data
            parameter.data = message;

            // invoke all the handlers
            for (const callback of parameter.callbacks) {
                callback(message);
            }
        });
    }

    /**
      * Send an update request for a parameter to the server
      *
      * @param  id      The parameter id
      * @param  value   The new value for the parameter
      */
    update_parameter(id, value) {
        // send message over the transport
        this.transport.send_message({
            action:     'set',
            parameter:  '/parameter/by-id/' + id,
            value:      value,
        });
    }

    /**
      * Start monitoring a parameter
      *
      * @param  id      The parameter id
      * @param  handler The handler to invoke when the parameter changes
      * @param  value   The initial value for the parameter, ignored if the parameter is already known
      */
    register_monitor(id, handler, value) {
        // check if we are already monitoring the parameter
        if (typeof this.parameters[id] === 'undefined') {
            this.parameters[id] = {
                data:       value,
                callbacks:  [handler],
            };

            // ask the server to update us on the parameter data
            this.transport.send_message({
                action:     'subscribe',
                parameter:  '/parameter/by-id/' + id,
            });
        } else {
            // add the handler to the existing list
            this.parameters[id].callbacks.push(handler);

            // notify immediately with the current value
            handler(this.parameters[id].data);
        }
    }

    /**
      * Stop monitoring a parameter
      *
      * @param  id      The parameter id
      * @param  handler The previously registered handler to remove
      */
    unregister_monitor(id, handler) {
        // retrieve the handlers for this parameter
        const parameter = this.parameters[id];
        const index = parameter.callbacks.indexOf(handler);

        // did we not find the handler?
        if (index === -1) {
            return;
        }

        // remove the handler from the list
        parameter.callbacks.splice(index, 1);

        // was this the last handler?
        if (parameter.callbacks.length === 0) {
            // remove the parameter data from storage
            delete this.parameters[id];

            // ask the server to stop updating us on the parameter data
            this.transport.send_message({
                action:     'unsubscribe',
                parameter:  '/parameter/by-id/' + id,
            });
        }
    }
};

export default ParameterContainer;
