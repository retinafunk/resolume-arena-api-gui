/**
  * Class maintaining the websocket transport
  * to the arena webserver
  */
class Transport {
    constructor(host, port) {
        // initialize empty listeners
        this.listeners = [];

        // in case of connection failure, we will retry
        // to connect with an increasing timeout
        this.reconnect_timeout = 1;
        this.reconnect_timer = 0;

        // initialize and connect the websocket
        this.open_websocket = () => {
            console.log("trying connection to", host);

            // create the websocket
            this.ws = new WebSocket("ws://"+host+":"+port+"/api/v1");

            // we don't have a current connect timer
            this.reconnect_timer = 0;

            this.ws.onclose = (event) => {
                // ignore the callback if another callback
                // already scheduled a reconnect operation
                if (this.reconnect_timer) {
                    return;
                }

                console.log('connection closed, reconnecting in ' + this.reconnect_timeout + ' seconds');

                // re-attempt connection after the timeout and increase timeout
                this.reconnect_timer = setTimeout(this.open_websocket, this.reconnect_timeout * 1000);
                this.reconnect_timeout *= 2;
            };

            // handle connection failure
            this.ws.onerror = (event) => {
                // ignore the callback if another callback
                // already scheduled a reconnect operation
                if (this.reconnect_timer) {
                    return;
                }

                console.log('failed to connect, retrying in ' + this.reconnect_timeout + ' seconds');

                // re-attempt connection after the timeout and increase timeout
                this.reconnect_timer = setTimeout(this.open_websocket, this.reconnect_timeout * 1000);
                this.reconnect_timeout *= 2;
            };

            // handler for connection success
            this.ws.onopen = () => {
                console.log('websocket connection established');
                this.reconnect_timeout = 1;
            };

            // handle incoming messages
            this.ws.onmessage = (data) => {
                try {
                    const message = JSON.parse(data.data);
                    console.log('receiving message', message);
                    for (const listener of this.listeners) {
                        listener(message);
                    }
                } catch (error) {
                    console.log('invalid message', data.data);
                }
            };
        };

        // now open the websocket
        this.open_websocket();
    }

    /**
      * If we are not currently connected, immediately
      * try a reconnect and reset the timeout
      */
    reconnect_now() {
        // do we have a current timer for performing reconnect?
        if (this.reconnect_timer) {
            window.clearTimeout(this.reconnect_timer);
            this.open_websocket();

            this.reconnect_timer = 0;
        }
    }

    /**
      * Register a callback handler to
      * retrieve messages sent by the server
      *
      * @param  callback    The callback to invoke
      */
    on_message(callback) {
        this.listeners.push(callback);
    }

    /**
      * Send a message to the server
      *
      * @param  message     The message to send
      */
    send_message(message) {
        console.log('sending message', message);
        this.ws.send(JSON.stringify(message));
    }
}

export default Transport;
