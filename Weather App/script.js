function getWeather() {
    const apiKey = '1eff677f6f95dae523cd674798ec95c2'; 
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(currentWeatherUrl)
        .then(response => {
            console.log('Current Weather Response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod === '404') {
                alert(`City not found: ${city}`);
            } else {
                displayWeather(data);
            }
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => {
            console.log('Forecast Response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod === '404') {
                alert(`City not found: ${city}`);
            } else {
                display5DayForecast(data.list);  
            }
        })
        .catch(error => {
            console.error('Error fetching 5-day forecast data:', error);
            alert('Error fetching 5-day forecast data. Please try again.');
        });
}



function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const ForecastDiv = document.getElementById('forecast');

    tempDivInfo.innerHTML = '';
    weatherInfoDiv.innerHTML = '';
    ForecastDiv.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);  
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const timezoneOffset = data.timezone; 
        const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000; 
        const localTime = new Date(utcTime + timezoneOffset * 1000); 

       const timeString = localTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        const temperatureHTML = `
        <p>${temperature}°F</p>`;  

        const weatherHTML = `
        <p>${cityName}</p>
        <p>${description}</p>
        <p>${timeString}</p>`;  

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}


function display5DayForecast(data) {
    console.log('5-day forecast data:', data); 

    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = ''; 
    const days = {};

    data.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const date = dateTime.toLocaleDateString('en-US', { weekday: 'long' });

        if (!days[date]) {
            const temp = Math.round(item.main.temp);
            const description = item.weather[0].description;
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            days[date] = `
                <div class="forecast-item">
                    <span>${date}</span>
                    <img src="${iconUrl}" alt="Weather Icon">
                    <span>${temp}°F</span>
                    <span>${description}</span>
                </div>`;
        }
    });

    for (const day in days) {
        forecastDiv.innerHTML += days[day];
    }
}


function showInfo() {
    const modal = document.getElementById('info-modal');
    modal.style.display = "block";
}

function closeInfo() {
    const modal = document.getElementById('info-modal');
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('info-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
