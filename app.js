const express=require('express');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate');
const catchAsync=require('./Utils/catchAsync');
const ExpressErrors=require('./Utils/ExpressErrors');
const Campground=require('./models/campground');
const mongoose=require('mongoose');
const methodOverride=require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs',ejsMate);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))


app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));



app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/campgrounds',catchAsync(async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}))

app.get('/campgrounds/new',catchAsync(async (req,res)=>{
    res.render('campgrounds/new');
}))

app.get('/campgrounds/:id',catchAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
}))

app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))

app.post('/campgrounds',catchAsync(async (req,res,next)=>{
    if(!req.body.campground){
        throw new ExpressErrors('Invalid Campground data',400);
    }
    const campground=new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.put('/campgrounds/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id',catchAsync(async (req,res,next)=>{
    const {id}= req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*',(req,res,next)=>{
    next(new ExpressErrors('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.messaage) err.message="Something Went Wrong"
    res.status(statusCode).render('error',{err});
})

app.listen(3000,()=>{
    console.log("Serving on port 3000");
})