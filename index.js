
const getWeatherData = async (city, lat, lon) => {
    const key = `1fd8093fa5ff12d796d7de756cc9d6b9`
    let url = ''
    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
    }

    const res = await fetch(url)
    const data = await res.json()
    const { lat: latitude, lon: longitude } = data.coord
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;
    const res2 = await fetch(apiUrl)
    const forecastData = await res2.json()

    displayWeather(data, forecastData)
}

const get = (query) => {
    return document.querySelector(query)
}

const displayWeather = (data, forecastData) => {
    const { description, icon } = data.weather[0]
    let date = formatDate(data.dt,data.timezone);
    // const hours = new Date(data.dt * 1000).getHours()
    const hours =getHour(data.dt,data.timezone)
    console.log('date', date)
    console.log(hours)
    const { speed } = data.wind
    const { temp, humidity, feels_like } = data.main
    const cityName = data.name
    console.log(description, icon, temp, humidity, feels_like, speed)

    // ----------------Getting--Elements------------
    const city = get('.city')
    const dateTime = get('.date-time')
    const weatherDesc = get('.weather-desc')
    const tempt = get('.temperature')
    const weatherImg = get('.weather-icon-main')
    const feelLike = get('#feels-like')
    const humidityE = get('#humidity')
    const wind = get('#wind')
    // ----------------Setting-Data----------------
    city.innerText = cityName
    dateTime.innerText = date
    weatherDesc.innerText = description
    tempt.innerText = Math.round(temp)
    feelLike.innerText = `Feels like: ${Math.round(feels_like)} °C`
    humidityE.innerText = `Humidity: ${Math.round(feels_like)}%`
    wind.innerText = `Wind: ${Math.floor(feels_like)} km/h`
    weatherImg.src = `icons/${icon}.svg`

    // -----------Getting-forecast-Elements---------
    const daysWrapper = get('.days-wrapper')
    daysWrapper.innerHTML = ''

    const { daily } = forecastData

    for (let i = 0; i < 5; i++) {
        const { temp, weather: [{ icon, description }] } = daily[i]
        const day = formatDate(daily[i].dt, data.timezone).split(',')[0]
        const div = document.createElement('div')
        const h4 = document.createElement('h4')
        const img = document.createElement('img')
        const h2 = document.createElement('h2')
        const p = document.createElement('p')
        div.classList.add('weather-card')
        h4.innerText = day
        img.src = `icons/${icon}.svg`
        h2.innerText = `${Math.floor(temp.min)}° - ${Math.floor(temp.max)}°`
        p.innerText = description
        div.append(h4, img, h2, p)
        daysWrapper.append(div)
    }

    // ------------------Theme------------

    const wrapper = get('.wrapper')
    wrapper.style.background = `url(images/background-${hours > 18 || hours < 6 ? 'night' : 'day'}.png)`

}

const locationBtn = get('.location-btn')
const searchBtn = get('.search-btn')

searchBtn.addEventListener('click', () => {
    const city = get('.search-input').value
    getWeatherData(city)
})


locationBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getWeatherData(null, lat, lon)
    })
    // alert("hi")
})



// function formatDate(date) {
//     const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const months = [
//         "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
//     ];

//     const day = daysOfWeek[date.getDay()];
//     const dayOfMonth = date.getDate();
//     const month = months[date.getMonth()];
//     const year = date.getFullYear();

//     let hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'

//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

//     return `${day}, ${dayOfMonth} ${month} ${year} | ${hours} : ${formattedMinutes} ${ampm}`;
// }



function formatDate(timestamp, timezoneOffset) {
    console.log('timestamp, timezoneOffset', timestamp, timezoneOffset)
    const date = new Date(timestamp * 1000);
    const localDate = new Date(date.getTime() + (timezoneOffset * 1000));
  
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'UTC'
    };
  
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(localDate);
  
    let formattedDate = '';
    let formattedTime = '';
  
    parts.forEach(part => {
      if (part.type === 'weekday') formattedDate += part.value + ', ';
      else if (part.type === 'day') formattedDate += part.value + ' ';
      else if (part.type === 'month') formattedDate += part.value + ' ';
      else if (part.type === 'year') formattedDate += part.value;
      else if (part.type === 'hour') formattedTime += part.value;
      else if (part.type === 'minute') formattedTime += ' : ' + part.value;
      else if (part.type === 'dayPeriod') formattedTime += ' ' + part.value.toUpperCase();
    });
  
    return `${formattedDate} | ${formattedTime}`;
  }


  function getHour(timestamp, timezoneOffset) {
    const date = new Date(timestamp * 1000);
    const localDate = new Date(date.getTime() + (timezoneOffset * 1000));
    return localDate.getUTCHours();
  }

getWeatherData('goa')