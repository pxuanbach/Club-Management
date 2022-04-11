import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Message from './Message';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Message />, document.getElementById('root'));
registerServiceWorker();