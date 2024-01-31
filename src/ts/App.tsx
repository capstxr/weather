import React from 'react';

import '../css/App.scss';
import '../css/colors.css';

import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import Home from './pages/home/home';

function App() {
    return (

    <Router>
        <Routes>
            <Route
                path='/'
                element={
                    <Home name='Helsinki'/>
                }
            />
        </Routes>
    </Router>

    );
}

export default App;
