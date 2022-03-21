const mongoose=require("./mongoose");


const citySchema=new mongoose.Schema({
    name:{
        type: String,
        minLength: 3,
        required: true,
        unique: true
    },
    temperature:{
        type: Number,
        default:0,
    },
    guessTemp:{
        type: Number,
        default:-1000,
    },
    score:{
        type: Number,
        default:0,
    },
    createdAt:{
        type: Date,
        default: new Date()
    }
})

const citySet=mongoose.model("citySet", citySchema);

const createCity=async (newCityName)=>{
    let result= await citySet.create(newCityName, error=>{
        if(error) {console.log("error @createcity:", error)}
    })   
    return result; 
}

const findCityByName=async (cityToFind)=>{
    let cityFound=await citySet.findOne(cityToFind)
    // console.log("cityFound return value:", cityFound);
    if (!cityFound){console.log("cannot find"); return false}
    else {return cityFound;}
}

const deleteByName=async(cityToDelete)=>{
    let cityDeleted=await citySet.deleteOne(cityToDelete);
    // console.log("city to be deleted:", cityDeleted)
    return cityDeleted;
}

const findAll=async ()=>{
    let cityArray=await citySet.find()
    return cityArray;
}

const updateTempByName=async(city, cityNewtemperature)=>{
    let cityUpdated=await citySet.findOneAndUpdate(city, cityNewtemperature,{new:true});
    // console.log("cityUpdated", cityUpdated)
    return cityUpdated;
}

module.exports={createCity, findCityByName, deleteByName, findAll, updateTempByName};