import React from 'react';
import ReactDOM from 'react-dom';
import Composition from './composition.js'
import './index.css';

// ========================================

function get_option(production, development, fallback) {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
        return production;
    } else if (development) {
        return development;
    } else {
        return fallback;
    }
}

const host = get_option(location.hostname, process.env.REACT_APP_HOST, '127.0.0.1');
const port = parseInt(get_option(location.port, process.env.REACT_APP_PORT, 8080), 10);

ReactDOM.render(
    <Composition host={host} port={port} />,
    document.getElementById('grid')
);
