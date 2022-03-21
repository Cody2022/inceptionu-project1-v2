const express = require("express");
const app=express();

const checkRouter=require("./routes/appRoute");
const gameRouter=require("./routes/gameRoute");

app.use("/app", checkRouter);
app.use('/game',gameRouter);

const PORT = 8000;
function echoPortNumber() {
    console.log(`Listening on port ${PORT}`);
}
  
app.listen(PORT, echoPortNumber);


//------------Comments out ----------
// const {currentWeatherCity, forecastDailyWeatherCity, localWeather, geoLocation}=require('./functions');

// app.use(express.json());



// //-------------Module_1: City current weather condition--------------
// app.get("/weather/local", localWeather);

// app.get("/weather/current/q", currentWeatherCity);   //city = req.query.city

// // app.get("/weather/forecast/q", forecastDailyWeatherCity);   //city=req.query.city; daily=parseInt(req.query.daily);



// //-------------Module_2: Local geoinformation--------------
// app.get("/localgeo", geoLocation);
// //-------------Module_2 End--------------



