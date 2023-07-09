const mongoose = require('mongoose');

const slugify = require('slugify')

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATA_BASE_PASSWORD)

mongoose.connect(process.env.DATABASE_LOCAL,{
  family:4,
  useNewUrlParser:true,
}).then(con => {
  console.log('db connection successfully')
});

const tourSchema = new mongoose.Schema({
  name : {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim:true,
    maxlength:[40, 'A tour must have less or equal than 40 caracters'],
    minlength:[10, 'A tour must constain atleast 10 caracters']

  },

  slug:  String
  ,
  duration: {
    type: Number,
    required: [true, ' A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required:[true, 'A tour must have a maximum groupsize  ']
  },

  difficulty:{
    type: String ,
    required: [true, 'a tour must have a dificulty'],
    enum:{
      values: ['easy', 'medium','difficult'],
      meassage: 'Difficulty must either be easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number ,
    default: 0
  },
  ratingsQuantity:{
    type: Number,
    default: 4.5,
    min:[1 , ' rating must be above 1.0'],
    max:[5, 'rating must be lower than 5.0 ']
  },
  priceDiscount: Number,
  summary:{
    type: String,
    trim: true,
    required: [true, ' A tour must have a description']
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type:String,
    required:[ true, ' A tour must have a cover  a cover image']
  },
  images: [String],
  createdAt:{
    type: Date,
    default: Date.now()
  },
  startDates:[Date],
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount:{
    type: Number,
    validate: {
      validator: function(val){
        return val < this.price
      },
      message: 'Discount price ({VALUE}) must be less than price '
    }


  },
  rating: {
    type: Number,
    default: 4.5
  },
  __v:
  {
    select: false
  }
}, 
{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
}
)
tourSchema.virtual('durationweek').get(function() {
  return this.duration / 7
});

tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower:true});
  next()
});

// tourSchema.pre(/^find/, function(next){
//   this.find({ _id:'$easy'});
//   next();
// })

// tourSchema.post(/^find/, function(doc, next){
//  console.log(` This query was logged at ${this.start - Date.now()} milli second`)
//   next();
// });

tourSchema.pre('aggregate', function(next){
  console.log(this.pipeline());
  next();
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 