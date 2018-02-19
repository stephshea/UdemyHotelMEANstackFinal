//paste in mongo shell to add id to json because was imported no ids

db.hotels.update(
{ },
{
    $set : {
        "reviews.0._id" : ObjectId()
    }
},

    {
    multi : true
    }
)

//get out subdocument hotelID/review
db.hotels.update(
{
    "name" : "Grand Hotel Palatino"
},
{
    $set : {
        "reviews.1._id" : ObjectId()
    }
},

    {
    multi : true
    }
)