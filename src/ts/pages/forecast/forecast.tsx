import React, { useState, useEffect } from 'react';

import './forecast.scss';

import Fetch from '../../components/fetch/fetch';

interface Props {
    name: string;
}

interface BallProps {
    temp: number;
    icon: string;
    timestamp: any;
    active: boolean;
}

interface WeeklyProps {
    mintemp: number;
    maxtemp: number;
    icon: string;
    date: string;
}

function getDate(): string {
    const currentDate = new Date();

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
  
    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];
  
    return `${day} ${month}`;
}

function getUnformattedDate(): string {
    const currentDate = new Date();

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];

    return `${month}, ${day}`;
}

function formatDate(date: string): string {
    const months: string[] = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    var month = months[parseInt(date.split('-')[0])-1];
    var day = date.split('-')[1];

    return `${month}, ${day}`;
}

const Forecast = (props: Props) => {
    const { name } = props;

    var [ reportState, setReportState ] = useState('closed');
    var [ currentData, setCurrentData ] = useState<any>({});
    var [ dailyData, setDailyData ] = useState<any>([]);
    var [ weeklyData, setWeeklyData ] = useState<any>([]);

    const date = getDate();
    const futureDate = getUnformattedDate();

    const toggleReport = () => {
        if (reportState == 'closed') {
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

        async function fetchDailyData() {
            try {
                const res = await Fetch(name);

                setCurrentData({
                    cloud: res.current.cloud,
                    temp_c: res.current.temp_c,
                    wind_kph: res.current.wind_kph,
                    humidity: res.current.humidity,
                    condition: res.current.condition.text,
                    iconPath: res.current.condition.icon
                });

                var currentHour = new Date().getHours(),
                    currentDay = res.forecast.forecastday[0];

                var time = 0,
                    active = false;

                const dataToSet = [];

                for (let i = 0; i < currentDay.hour.length; i++) {
                    time = currentDay.hour[i].time.split(" ")[1].split(":")[0]

                    if (time >= currentHour - 1) {
                        if (time == currentHour) { active = true }

                        dataToSet.push({
                            time: time,
                            temp_c: currentDay.hour[i].temp_c,
                            icon: currentDay.hour[i].condition.icon,
                            active: active,
                        });

                        active = false;
                    }
                }

                const dataToWeekly = [];

                for (let i = 0; i < res.forecast.forecastday.length; i++) {
                    currentDay = res.forecast.forecastday[i];

                    var date = formatDate(currentDay.date.slice(5));

                    dataToWeekly.push({
                        date: date,
                        icon: currentDay.day.condition.icon,
                        min_temp_c: currentDay.day.mintemp_c,
                        max_temp_c: currentDay.day.maxtemp_c,
                    });
                }
                
                setDailyData(dataToSet);
                setWeeklyData(dataToWeekly);
            } catch (error) {
                // Handle error
                console.error(error);
            }
        }
    
        fetchDailyData();
    }, [name]);    

    const WeatherBall = (props: BallProps) => {
        const { temp, icon, timestamp, active } = props;

        return (
            <div className={`weather-ball ${active}`}>
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
                        {mintemp}°C
                    </span>

                    <span> / </span>

                    <span>
                        {maxtemp}°C
                    </span>
                </span>
            </div>
        );
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
                            alt=""
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
                            alt=""
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
                alt=""
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
                    alt="" 
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
                    {futureDate}
                </span>
            </div>

            <div className="today-grid">
                {dailyData.map((dataItem: any, index: number) => (
                    <WeatherBall
                        temp={dataItem.temp_c}
                        icon={dataItem.icon}
                        timestamp={`${dataItem.time}.00`}
                        active={dataItem.active}
                        key={index}
                    />
                ))}
            </div>

            <div className="report-heading">
                <h1 className="report-head">
                    Forecast
                </h1>
            </div>

            <div className="weekly-grid">
                {weeklyData.map((dataItem: any, index: number) => (
                    <WeeklyBall
                        mintemp={dataItem.min_temp_c}
                        maxtemp={dataItem.max_temp_c}
                        icon={dataItem.icon}
                        date={dataItem.date}
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