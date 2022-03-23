const express=require('express');
const gameRouter=express.Router();
module.exports = gameRouter;

const {weatherOfCity, 
        localWeather, 
        geoLocation, 
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
        review}=require('../model/game')


gameRouter.get("/startgame", startGame);   //city = req.query.city

// gameRouter.get("/guess", weatherOfCity);   //city = req.query.city



gameRouter.get('/find', async(req, res)=>{
    let city=req.query.city;
    let cityFound=await findCity(city);
    console.log("/find cityFound:",cityFound)
    if (cityFound===false){res.send(`${city} is not in the database`)}
    else{res.send(cityFound)}
})




gameRouter.get('/findall', async (req,res)=>{
    let cityArray=await findAllCities();
    // console.log("cityArray:",cityArray)
    res.send(cityArray)
})

gameRouter.get('/update', async(req, res)=>{
    let city=req.query.city;
    let temperature=Number(req.query.temperature);
    console.log(temperature)
    let cityWithNewT=await updateCityTemperature(city, temperature);
    console.log("cityWithNewT",cityWithNewT)
    if (cityWithNewT===null){res.send(`Cannot update, ${city} is not in the database`)}
    else{res.send(cityWithNewT)};
})


//--------------------------------------------Play game-------

gameRouter.get('/enter', async(req,res)=>{
    let player=req.query.player;
    let geoJson=await enter();
    geoString=`Hello "${player}"! Your current location is ${geoJson.city}, ${geoJson.region_name}, ${geoJson.country_name}`;
    nextOperation=`\nBefore guessing, please check cities in the game box by: \ncurl "http://localhost:8000/game/checkbox"`

    res.send(geoString+nextOperation);
})

gameRouter.get('/checkbox', async (req,res)=>{
    let cityArray=await findAllCities();
    // console.log("cityArray:",cityArray)
    let cities=[];
    for (city of cityArray){
        cities.push(city.name)
    }
    nextOperation=`\nIf you want to add more cities into the box: \ncurl "http://localhost:8000/game/add?city={city}"
    \nIf you want to delete city/cities from the box:\ncurl "http://localhost:8000/game/delete?city={city}" `
    res.send(`There are ${cityArray.length} cities in the box. They are:\n${cities}`+nextOperation)
})

gameRouter.get('/delete', async(req, res)=>{
    let city=req.query.city;
    let cityFound=await deleteCity(city);
    // console.log("get-/delete cityFound:", cityFound)
    if (cityFound.deletedCount===0){res.send(`${city} is not in the database`)}
    else{
        let cityArray=await findAllCities();
    // console.log("cityArray:",cityArray)
        let cities=[];
        for (cityDb of cityArray){
            cities.push(cityDb.name)
        }
        console.log(cities);

    nextOperation=`Set the accuracy and start guessing: curl "http://localhost:8000/game/guess?accuracy={1}&city={Calgary}&temp={8}"`;        
    res.send(`${city} is deleted from the database. The cities in the box are:\n${cities}\n${nextOperation}`)}
})

gameRouter.get("/add", async (req, res)=>{
    let city=req.query.city;
    let addCityMessage=await addCity(city)
    let cityArray=await findAllCities();
    let cities=[];
        for (cityDb of cityArray){
            cities.push(cityDb.name)
        }
     console.log(cities);
     nextOperation=`Set the accuracy and start guessing: curl "http://localhost:8000/game/guess?accuracy={1}&city={Calgary}&temp={8}"`;
    res.send(`${city} has been added to the game box. The cities in the box are:\n${cities}\n${nextOperation}`);
    // res.send('test')
}); 

gameRouter.get('/guess', async(req,res)=>{
    let city=req.query.city;
    let temp=Number(req.query.temp);
    let accuracy=Number(req.query.accuracy);

    let guessedCity=await guess(accuracy, city, temp);

    console.log("Your game results: ", guessedCity);
    let guessResult=[{name:guessedCity.name},
        {actualT:guessedCity.temperature},
        {guessTemp:guessedCity.guessTemp},
        {Score:guessedCity.score},
        {deltaT: Math.abs((guessedCity.temperature-guessedCity.guessTemp).toFixed(2))}]
    res.send(guessResult);
})

gameRouter.get('/review', async (req,res)=>{
    let summary=await review();
    // console.log("cityArray:",cityArray)
    res.send(summary)
})

