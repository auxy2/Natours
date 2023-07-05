
const Tour = require('./../model/tourModel');
const fs = require('fs');
const asyncError = require('./../routs/until/asyncCatch');
const appError = require('./../routs/until/appError');


const tours =  JSON.parse((fs.readFileSync('./dev-data/data/tour-simple.json')))

exports.aliasgetAllTours = (req, res, next) => {
      req.query.sort = 'price,-createdAt'
      req.query.fields = 'name, price, summary, ratingsAvrage, difficulty';
      req.query.limit = '5'

    next()
};
// exports.checkId = (req, res, next, val) => {

// if(req.params.id*1 > tours.length){
//         return res.status(404).json({
//             status: "fail",
//             message: "invalid id "
//         })
//     }
//     next()
// };

// exports.checkBody = (req, res, next) => {
//     if(!req.body.name || !req.body.price){
//         return res.status(404).json({
//             status: "fail",
//             message: 'missing price or name'
//         })
//     }
//     next()
// }


exports.getAlltour = asyncError(async(req, res, next) => {

     const queryObj = { ...req.query };
     const exludeFild = ['sort','fields', 'page', 'limit'];
     exludeFild.forEach(el => delete queryObj[el] );
     

     let queryStr = JSON.stringify(queryObj);
     queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`);

       const data = Tour.find(JSON.parse(queryStr));

      if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        data.sort(sortBy)
      };

      if (req.query.fields){
        const fields = req.query.fields.split(',').join(' ');
        data.select(fields);
      }else{
        data.select('-__v');
      }

        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
            
            const skip = (page-1) *limit
            data.skip(skip).limit(limit);
        

      if(req.query.page){
        const dataLength = await Tour.countDocuments();
    if(skip > dataLength){
        throw  new error 
    }
    
      }
       const  tours  = await data;

    res.status(200).json({
    satatus: 'sucess',
    result: tours.length, 
    data:{
        tours
    }
}
)
})


exports.getAllStats = asyncError( async(req, res, next) => {


        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage:{$gte:4.5} }
            },
            {
                $group:{ 
                    numTour: {$sum : 1},
                    _id: {$toUpper: '$difficulty'},
                    avegatings:{$avg: '$ratingsAverage'},
                    avgPrice:{$avg: '$price'},
                    minPrice:{$min: '$price'},
                    maxPrice:{$max: '$price'},
                }
            },
            {
            $sort:{avgPrice:1}
            }
        ]);
        res.status(200).json({
            stats: 'success',
            data:{
                stats
            }
        })
    })

exports.getMonthlyPlan = asyncError(async(req, res, next) => {

        const year  = req.params.year*1;

        const plan = await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match: {
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id: {$month:'$startDates'},
                    tour:{$push: '$name'}
                }            
            },
            {
                $addFields:{month: '$_id'}
            },
            {
                $project:{_id:0}
            },
            {
                $sort:{numTour: -1}
            },
            {
                $limit:20
            }
        ])
        res.status(200).json({
            stats: 'success',
            data:{
                plan
            }
        })
    })

    

exports.findTour =  asyncError(async(req, res, next) => {
    // const id = req.params.id *1
    // const tour = tours.find(el => el.id === id)

    // if(!tour){
    //     return res.status(404).json({
    //         status:"fail",
    //         message:" Invaid id"
    //     })
    // }
const tour = await Tour.findById(req.params.id, req.body);

if(!tour){
return next(new appError('No Tour Found For That Id', 404))
}
    res.status(200).json({
        status:"sucess",
        data:{
            tour
        }
    })
})

exports.createNewtour =  asyncError(async (req, res, next) => {
//     console.log(req.body),
//     newId = tours[tours.length -1].id +1,
//     newTour = Object.assign({id: newId}, req.body),
//     tours.push(newTour),
// fs.writeFile('./dev-data/data/tour-simple.json', JSON.stringify(tours), err => (

    const newTour =  await Tour.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            tour:newTour
    }
});
}
 )


exports.UpdateTour = asyncError(async (req,res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        validator :true
    })

if(!tour){
return next(new appError('No Tour Found For That Id', 404))
}
    res.status(200).json({
        status:"success",
        data:{
            tour
        }
    })
}
)

exports.DeleteTour =  asyncError(async (req,res, next) => {
    // if(req.params.id*1 > tours.length){
    //     return res.status(404).json({
    //         status: "fail",
    //         message: 'invalid id'
    //     })
    // }
    const tour = await Tour.findByIdAndDelete(req.params.id, req.body);

if(!tour){
return next(new appError('No Tour Found For That Id', 404))
}
    res.status(204).json({
        status:"success",
        data:{
            tour
        }
    })
} 
);