const {APIkey_weather}=require('./API-key');
const fetch=require('node-fetch');
const { response } = require('express');

const readlineSync=require('readline-sync');
const readlineAsync=require('readline-async');

// // let cityArray=["shanghai","qingdao","hefei","beijing"]
// // let tempArray=[];

// // for (city of cityArray){
// //     let cityTemp=readlineSync.question(`Input your guess for the temperature of ${city}?`)
// //     tempArray.push(Number(cityTemp));
// //     console.log(typeof(cityTemp))
// // }

// // // console.log(`Hi the temperature of ${city} is ${cityTemp}`)

// // console.log(tempArray)

// // const fetchWeather=async(city)=>{
// //     let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey_weather}`);
// //     let weatherJson=await response.json();
// //     console.log(weatherJson);         
              
// // }
// //  fetchWeather("calgary")

// //--------------------------------------------

// // readlineAsync()
// // .then( line => {
// //         console.log("You said " + line);
// //         // return readlineAsync();
// // })
// // .then( line => {
// //         console.log("and this " + line);
// //         return "done";
// // })
// // .then(console.log);

// let output=readlineAsync()
// console.log(output.then(input=>{return input}))

// // const inputAsync=async()=>{
// //     let input=await readlineAsync();
// //     return input;

// // }



const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
/*SUBSCRIBE HERE FOR API KEY: https://home.openweathermap.org/users/sign_up*/
const apiKey = "4d8fb5b93d4af21d66a2948710284366";

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

        //check if there's already a city
        const listItems = list.querySelectorAll(".ajax-section .city");
        const listItemsArray = Array.from(listItems);

        // if (listItemsArray.length > 0) {
        //     const filteredArray = listItemsArray.filter(el => {
        //     let content = "";
        //     //athens,gr
        //     if (inputVal.includes(",")) {
        //         //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        //         if (inputVal.split(",")[1].length > 2) {
        //         inputVal = inputVal.split(",")[0];
        //         content = el
        //             .querySelector(".city-name span")
        //             .textContent.toLowerCase();
        //         } else {
        //         content = el.querySelector(".city-name").dataset.name.toLowerCase();
        //         }
        //     } else {
        //         //athens
        //         content = el.querySelector(".city-name span").textContent.toLowerCase();
        //     }
        //     return content == inputVal.toLowerCase();
        //     });

        //     if (filteredArray.length > 0) {
        //     msg.textContent = `You already know the weather for ${
        //         filteredArray[0].querySelector(".city-name span").textContent
        //     } ...otherwise be more specific by providing the country code as well 😉`;
        //     form.reset();
        //     input.focus();
        //     return;
        //     }
        // }

        //ajax here
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
            const { main, name, sys, weather } = data;
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
                weather[0]["icon"]
            }.svg`;

            const li = document.createElement("li");
            li.classList.add("city");
            const markup = `
                <h2 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
                <figure>
                <img class="city-icon" src="${icon}" alt="${
                weather[0]["description"]
            }">
                <figcaption>${weather[0]["description"]}</figcaption>
                </figure>
            `;
            li.innerHTML = markup;
            list.appendChild(li);
            })
            .catch(() => {
            msg.textContent = "Please search for a valid city 😩";
            });

        msg.textContent = "";
        form.reset();
        input.focus();
});
