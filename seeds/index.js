
const mongoose=require('mongoose');
const axios = require('axios');
const Campground = require('../models/campground');
const {descriptors,places}=require('./seedhelpers');
const cities=require('./cities');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample=(array)=>{
    return array[Math.floor(Math.random()*array.length)];
}

async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: '**Your API client ID here**',
          collections: 483251,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  } 
const seedDB=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<30;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*300)+100;
        const camp=new Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:await seedImg(),
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, iste, quos consequuntur quibusdam optio impedit sapiente id magni ipsa explicabo, voluptas illum veritatis rem expedita magnam velit perspiciatis dolorum vero.',
            price
        })
        await camp.save();
    }
}



seedDB().then(()=>{
    console.log("Connection closed");
    mongoose.connection.close();
})