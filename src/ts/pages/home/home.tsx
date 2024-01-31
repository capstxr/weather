import React, { useState, useEffect } from 'react';

import { Search } from 'react-bootstrap-icons';

import '../../components/search/search.scss';

import Forecast from '../forecast/forecast';

interface Props {
    name: string;
}

const Home = (props: Props) => {
    var { name } = props;

    var [ search, setSearch ] = useState(''),
        [ closed, setClosed ] = useState('closed'),
        [ visible, setVisible ] = useState(''),
        [ foreCast, setForeCast ] = useState<any>('');

    const onSearchChange = (val: string) => {
        setSearch(val);

        if (val.length > 0) {
            setVisible('visible');
        } else {
            setVisible('');
        }
    }

    const toggleSearch = () => {
        if (closed == 'closed') {
            setClosed('');
        } else {
            setClosed('closed');
        }
    }

    const update = () => {
        setSearch(search);
        name = search;

        setForeCast(<Forecast name={name}/>)
    }

    useEffect(() => {
        setSearch(name);
        setForeCast(<Forecast name={name}/>)
    }, [name]);    

    return (
        <main className="wrapper">
            <header id="header" className={closed}>
                <div className="location">
                    <img
                        src="./images/location.svg"
                        alt=""
                    />

                    <span className="name">
                        {search}
                    </span>

                    <button
                        className="open-search"
                        onClick={toggleSearch}
                    >
                        <img
                            src="./images/opt.svg"
                            alt=""
                        />
                    </button>
                </div>

                <div className={`search-container`}>
                    <div className="search-bar-wrapper">
                        <button 
                            className="closeSearch"
                            onClick={toggleSearch}
                        >
                            <img
                                src="./images/arrow.svg"
                                alt="" 
                            />
                        </button>

                        <input 
                            type="text" 
                            name="searchBar" 
                            id="searchBar" 
                            placeholder="Search for a city or country"
                            onChange={(e) => onSearchChange(e.target.value)}
                            value={search}
                        />

                        <button
                            className={`closeSearch search ${visible}`}
                            onClick={update}
                        >
                            <Search
                                className='blue-text'
                            />
                        </button>
                    </div>
                </div>
            </header>

            {foreCast}
        </main>
    );
}

export default Home;