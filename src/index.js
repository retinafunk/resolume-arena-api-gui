import React from 'react';
import ReactDOM from 'react-dom';
import ResolumeProvider from './resolume_provider.js';
import Grid from './grid.js'
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

const host = get_option(location.hostname, process.env.REACT_APP_HOST, '192.168.178.20');
const port = parseInt(get_option(location.port, process.env.REACT_APP_PORT, 7676), 10);

ReactDOM.render(
    <ResolumeProvider host={host} port={port}>
        <Grid host={host} port={port} />
    </ResolumeProvider>,
    document.getElementById('grid')
);
