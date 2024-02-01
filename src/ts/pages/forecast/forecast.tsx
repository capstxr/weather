import React, { useState, useEffect } from 'react';

import './forecast.scss';
import axiosInstance from '../../../hostHandler';

interface Props {
    name: string;
}

interface BallProps {
    temp: number;
    icon: string;
    timestamp: any;
    index: number;
}

interface WeeklyProps {
    mintemp: number;
    maxtemp: number;
    icon: string;
    date: string;
}

function convertDate(dateString: string): string {
    const date = new Date(dateString);

    const month = date.toLocaleString('default', { month: 'short' });

    const day = date.getDate();

    const formattedDate = `${month} ${day.toString().padStart(2, '0')}`;

    return formattedDate;
}

function getDate(): string {
    const currentDate = new Date();

    const month = currentDate.toLocaleString('default', { month: 'long' });
  
    return `${currentDate.getDate()} ${month}`;
}

const Forecast = (props: Props) => {
    const { name } = props;

    const [ reportState, setReportState ] = useState('closed');
    const [ currentData, setCurrentData ] = useState<any>({});
    const [ forecastData, setForecastData ] = useState<any>([]);
    const [ forecastWeek, setForecastWeek ] = useState<any>([]);

    const date = getDate();

    const toggleReport = () => {
        if (reportState === 'closed') {
            setReportState('');
        } else {
            setReportState('closed');
        }
    }

    useEffect(() => {
        setCurrentData({
            cloud: 0,
            temp_c: 0,
            wind_kph: 0,
            humidity: 0,
            condition: 0,
            iconPath: 'cdn.weatherapi.com/weather/64x64/day/116.png'
        });

        async function fetchDailyData(query: string) {
            try {
                const response = await axiosInstance.post('/fetch', { query });
                console.log(response.data);
                console.log(response.data.forecast.forecastday);
                setCurrentData({
                    wind_kph: response.data.current.wind_kph,
                    temp_c: response.data.current.temp_c,
                    humidity: response.data.current.humidity,
                    condition: response.data.current.condition.text,
                    iconPath: response.data.current.condition.icon
                });

                const currentHour = new Date().getHours();
                const hourlyData = response.data.forecast.forecastday[0].hour;

                const filteredData = hourlyData.filter((hourData: any, index: number) => index >= currentHour -1);

                setForecastData(filteredData);
                setForecastWeek(response.data.forecast.forecastday);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    
        fetchDailyData(name);
    }, [name]);

    const WeatherBall = (props: BallProps) => {
        const { temp, icon, timestamp, index } = props;
        const act = index ===  1;

        return (
            <div className={`weather-ball ${act}`}>
                <span className="temperature">
                    {temp}°C
                </span>

                <img 
                    src={icon}
                    alt="Weather icon" 
                    className="icon"
                />

                <span className="timestamp">
                    {timestamp}
                </span>
            </div>
        );
    }

    const WeeklyBall = (props: WeeklyProps) => {
        const { mintemp, maxtemp, icon, date } = props;

        return (
            <div className="weeklyball">
                <span className="date">
                    {date}
                </span>

                <img
                    src={icon}
                    alt="Weather icon"
                    className="icon"
                />

                <span className="temps">
                    <span>
                        {maxtemp}°C
                    </span>

                    <span> / </span>

                    <span>
                        {mintemp}°C
                    </span>
                </span>
            </div>
        );
    }

    function convertEpochToHourMinute(epoch: any) {
        const date = new Date(epoch * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
        return `${formattedHours}:${formattedMinutes}`;
    }

    return (

    <>

    <div className="container">
        <img
            src={currentData.iconPath}
            alt="Weather"
            className='weather-icon'
        />

        <div className="stats">
            <span className="date">
                Today, {date}
            </span>

            <span className="degree">
                <span className="num">
                    {currentData.temp_c}
                </span>

                <span className="symbol">
                    °
                </span>

                <span className="num">
                    c
                </span>
            </span>

            <span className="weather">
                {currentData.condition}
            </span>

            <div className="stat-grid">
                <div className="stat">
                    <div className="icon-container">
                        <img
                            src="./images/weather-icons/windy.svg"
                            alt="Wind"
                        />
                    </div>

                    <span className="name">
                        Wind
                    </span>

                    <div className='line'/>

                    <span className="num">
                        <span className="amount">
                            {Math.floor(currentData.wind_kph / 3.6)}
                        </span>

                        <span className="text">
                            m/s
                        </span>
                    </span>
                </div>

                <div className="stat">
                    <div className="icon-container">
                        <img
                            src="./images/weather-icons/hum.svg"
                            alt="Humidity"
                        />
                    </div>

                    <span className="name">
                        Hum
                    </span>

                    <div className='line'/>

                    <span className="num">
                        <span className="amount">
                            {Math.floor(currentData.humidity)}
                        </span>

                        <span className="text">
                            %
                        </span>
                    </span>
                </div>
            </div>
        </div>

        <button
            className="forecast-btn"
            onClick={toggleReport}
        >
            <span className="blue-text">
                Forecast report
            </span>

            <img
                src="./images/up.svg"
                alt="Up"
            />
        </button>
    </div>

    <div
        className={`report ${reportState}`}
    >
        <header className="header">
            <button
                className="header-btn"
                onClick={toggleReport}
            >
                <img
                    src="./images/arrow.svg"
                    alt="Back" 
                />

                <span className='text'>
                    Back
                </span>
            </button>

            <span>
                {name}
            </span>
        </header>

        <div className="content">
            <div className="report-heading">
                <h1 className="report-head">
                    Today
                </h1>

                <span className="date">
                    {date}
                </span>
            </div>

            <div className="today-grid">
                {forecastData.map((item: any, index: number) => 
                (
                    <WeatherBall
                        temp={item.temp_c}
                        icon={item.condition.icon}
                        timestamp={convertEpochToHourMinute(item.time_epoch)}
                        key={index}
                        index={index}
                    />
                ))}
            </div>

            <div className="report-heading">
                <h1 className="report-head">
                    Forecast
                </h1>
            </div>

            <div className="weekly-grid">
                {forecastWeek.map((item: any, index: number) => (
                    <WeeklyBall
                        mintemp={item.day.mintemp_c}
                        maxtemp={item.day.maxtemp_c}
                        icon={item.day.condition.icon}
                        date={convertDate(item.date)}
                        key={index}
                    />
                ))}
            </div>
        </div>
    </div>

    </>
    
    );
}

export default Forecast;