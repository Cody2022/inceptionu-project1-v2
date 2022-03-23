
require('dotenv').config()
const fetch=require('node-fetch');
const readlineAsync=require('readline-async');
// const readlineSync=require('readline-sync');

const APIkey_weather=process.env.API_KEY;
// console.log("API key test:", APIkey_weather);

const {createCity,
       findCityByName,
       deleteByName,
       findAll,
       updateTempByName
        }=require('../db/gameModel');


const weatherOfCity=(req, res)=>{
    let city = req.query.city;
    console.log(city);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey_weather}`)
            .then((weatherObj) => weatherObj.json())
            .then((weatherJson) => {
                console.log(weatherJson);
                console.log("City:",weatherJson.name);
                console.log("Description:",weatherJson.weather[0].description);
                console.log("Weather icon:",weatherJson.weather[0].icon);
                console.log("Temperature, C:", weatherJson.main.temp);
                console.log("Feel like, C:", weatherJson.main.feels_like);
                console.log("humidity, %:", weatherJson.main.humidity);
                console.log("Wind, m/s:", weatherJson.wind.speed);
                res.send({
                    "City:":weatherJson.name,
                    "Description:":weatherJson.weather[0].description,
                    "Weather icon:": weatherJson.weather[0].icon,
                    "Temperature, C:": weatherJson.main.temp,
                    "Feel like, C:": weatherJson.main.feels_like,
                    "humidity, %:": weatherJson.main.humidity,
                    "Wind, m/s:": weatherJson.wind.speed
                });
            }) 
            .catch((error)=>{
                console.log("Error export:", error);
                res.status(404).send(`Weather information for city "${city}" is not found!`);
            })
}
//--------------------------------------------
const forecastDailyWeatherCity=(req,res)=>{
    let city=req.query.city;
    let daily=parseInt(req.query.daily);
    let days=16;

    if (daily<1 || daily>16 ){
        res.send("hint: enter correct number to check 16 days / daily forecast data");
    } else {
        fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=${days}&units=metric&appid=${APIkey_weather}`)
        .then((weatherObj) => weatherObj.json())
        .then((weatherJson) => {
            console.log(weatherJson);
            console.log("City:", weatherJson.city.name);
            console.log("Description:",weatherJson.list[daily-1].weather[0].description);
            console.log("Weather icon:",weatherJson.list[daily-1].weather[0].icon);
            console.log("Temperature, C:", weatherJson.list[daily-1].temp);
            console.log("Feel like, C:", weatherJson.list[daily-1].feels_like);
            console.log("humidity, %:", weatherJson.list[daily-1].humidity);
            console.log("Wind, m/s:", weatherJson.list[daily-1].speed);
            res.send({
                "City:":weatherJson.city.name,
                "Description:":weatherJson.list[daily-1].weather[0].description,
                "Weather icon:": weatherJson.list[daily-1].weather[0].icon,
                "Temperature, C:": weatherJson.list[daily-1].temp,
                "Feel like, C:": weatherJson.list[daily-1].feels_like,
                "humidity, %:":weatherJson.list[daily-1].humidity,
                "Wind, m/s:": weatherJson.list[daily-1].speed
            });
        }) 
        .catch((error)=>{
            console.log("Error export:", error);
            res.status(404).send(`Weather forecat for city "${city}" is not found!`);
        })
    }
}


//----------------------------------------------
function geoLocation(req, res){
    fetch('https://freegeoip.app/json/')
    .then(responseObj=>responseObj.json())
    .then(geoinf=>{
        console.log(geoinf);
        res.send(geoinf);
        console.log({
            "ip": geoinf.ip,
            "country_code": geoinf.country_code,
            "country_name": geoinf.country_name,
            "region_code": geoinf.region_code,
            "region_name": geoinf.region_name,
            "city": geoinf.city,
            "zip_code": geoinf.zip_code,
            "time_zone": geoinf.time_zone,
            "latitude": geoinf.latitude,
            "longitude": geoinf.longitude
        });
    })
    .catch((error)=>{
        console.log("Error export:", error);
        res.status(404).send(`Geo information for your location is not found!`);
    })
};
//-------------------

function localWeather(req,res){
    function weatherModule(geoIp){
       let city=geoIp.city;

       fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey_weather}`)
           .then((weatherObj) => weatherObj.json())
           .then((weatherJson) => {
               console.log(weatherJson);
               console.log("City:",weatherJson.name);
               console.log("Description:",weatherJson.weather[0].description);
               console.log("Weather icon:",weatherJson.weather[0].icon);
               console.log("Temperature, C:", weatherJson.main.temp);
               console.log("Feel like, C:", weatherJson.main.feels_like);
               console.log("humidity, %:", weatherJson.main.humidity);
               console.log("Wind, m/s:", weatherJson.wind.speed);
               res.send({
                   "City:":weatherJson.name,
                   "Description:":weatherJson.weather[0].description,
                   "Weather icon:": weatherJson.weather[0].icon,
                   "Temperature, C:": weatherJson.main.temp,
                   "Feel like, C:": weatherJson.main.feels_like,
                   "humidity, %:": weatherJson.main.humidity,
                   "Wind, m/s:": weatherJson.wind.speed
               });
           }) 
           .catch((error)=>{
               console.log("Error export:", error);
               res.status(404).send(`Weather information for city "${city}" is not found!`);
           });
    };
        fetch("https://freegeoip.app/json/")
        .then((responseIP) => responseIP.json())
        .then(weatherModule)
        .catch((error)=>{
            console.log("Error export:", error);
            res.status(404).send(`Geo information for your city is not found!`);
        });
};


//--------------

const startGame=(req, res)=>{
    let city=req.query.city || "calgary";
    res.send(`<p>Welcome to the game, please enter your name: </p>
        <input id="name" />
        <a id="link"><button>Go</button></a>
        <script>
        let nameInput = document.getElementById('name')
        console.log(nameInput)
            nameInput.addEventListener('keyup',(e)=>{
            console.log('hey')
            let link = document.getElementById('link')
            link.setAttribute('href','http://localhost:8000/game/guess?city=${city}')
            })
        </script>`
    )
}

// //-------
const addCity=async(city)=>{
    let newCity=await createCity({name:city});
    // console.log("newCity:", newCity);
    return newCity;
}

const findCity=async(cityName)=>{
    let city=await findCityByName({name: cityName});
    return city;
}
const deleteCity=async(cityName)=>{
    let city=await deleteByName({name: cityName});
    // console.log("city:", city)
    return city;
}

const findAllCities=async()=>{
    let cityArray=await findAll();
    return cityArray;
}

const updateCityTemperature=async(name, newTemperature)=>{
    let cityUpdatedT=await updateTempByName({name:name}, {temperature:newTemperature});
    // console.log("cityUpdatedT", cityUpdatedT)
    return cityUpdatedT;
}

// -----------2022.03.19
const initialize=async ()=>{
    let cityArray=await findAll();

    for (city of cityArray){
        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${APIkey_weather}`);
        let weatherJson=await response.json();
        if (weatherJson.message) {console.log("error init:", weatherJson.message)}
        else{
            // console.log("WeaterhJson results:",weatherJson)
            let cityUpdatedT=await updateTempByName({name:city.name}, {temperature:weatherJson.main.temp});
            // console.log("cityUpdatedT", cityUpdatedT)
        }
    }
   
}

// -----
const start=async(accuracy)=>{
    let cityArray=await findAll();
    let scores=0;
    let guessRight=[];
    let summary=[];

    for (city of cityArray) {
        let intialScore=await updateTempByName({name:city.name}, {score:0});
        let intialGuessTemp=await updateTempByName({name:city.name}, {guessTemp:-1000});
    }

    for (city of cityArray){
        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${APIkey_weather}`);
        let weatherJson=await response.json();

        if (weatherJson.message) {console.log("error init:", weatherJson.message)}
        else{
            let cityUpdatedT=await updateTempByName({name:city.name}, {temperature:weatherJson.main.temp});
           
            console.log(`Guess and Enter temperature of ${city.name}:`)    //Assited information for input
            let cityTemp=await readlineAsync();
            let UpdatedT=await updateTempByName({name:city.name}, {guessTemp:Number(cityTemp)});      
        }      
            let cityCompared=await findCityByName({name: city.name});
            if (Math.abs(cityCompared.temperature-cityCompared.guessTemp)<=accuracy){
                let updatedCity=await updateTempByName({name:city.name}, {score:1});
                guessRight.push({name:cityCompared.name,actualT:cityCompared.temperature, guessT: cityCompared.guessTemp, deltaT: (cityCompared.temperature-cityCompared.guessTemp)})
                scores=scores+updatedCity.score;
            }
    }            
        return summary.concat({Scores:scores},guessRight)
}
//-------

const enter=async()=>{
    let response=await fetch("https://freegeoip.app/json/").catch(error=>res.status(404).send(`Geo information for your city is not found!`))
    let responseJson=response.json();

    let cityArray=await findAll();
    let scores=0;
    let guessRight=[];
    let summary=[];

    for (city of cityArray) {
        let intialScore=await updateTempByName({name:city.name}, {score:0});
        let intialGuessTemp=await updateTempByName({name:city.name}, {guessTemp:-1000});
    }

    for (city of cityArray){
        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${APIkey_weather}`);
        let weatherJson=await response.json();

        if (weatherJson.message) {console.log("error init:", weatherJson.message)}
        else{
            let cityUpdatedT=await updateTempByName({name:city.name}, {temperature:weatherJson.main.temp});
        }
    }

    return responseJson;
}
//---------

const guess=async(accuracy, city, temp)=>{

        let intialScore=await updateTempByName({name:city}, {score:0});
        let intialGuessTemp=await updateTempByName({name:city}, {guessTemp:temp});
        let guessedCity={};

        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey_weather}`);
        let weatherJson=await response.json();
        if (weatherJson.message) {console.log("error init:", weatherJson.message)}
        else{
            let cityUpdatedT=await updateTempByName({name:city}, {temperature:weatherJson.main.temp});
            if (Math.abs(cityUpdatedT.temperature-temp)<=accuracy){
                updatedScore=await updateTempByName({name:city}, {score:1});
                console.log("guess function:", guessedCity)
            }
            guessedCity=await findCity(city);
        }
        return guessedCity;
}

const review=async ()=>{
    let cityArray=await findAll();
    let scores=0;
    let guessRight=[];
    let summary=[];
    for (city of cityArray){
         if (city.score===1){
             guessRight.push({name:city.name,actualT:city.temperature, guessT: city.guessTemp, deltaT: Math.abs((city.temperature-city.guessTemp).toFixed(2))})
             scores=scores+city.score;
            }
    }
    return summary.concat({"Total Scores":scores},guessRight)

}




module.exports={weatherOfCity, 
                geoLocation, 
                localWeather, 
                forecastDailyWeatherCity, 
                startGame,
                addCity,
                findCity,
                deleteCity, 
                findAllCities,
                updateCityTemperature,
                initialize,
                start,
                enter,
                guess,
                review  
            };