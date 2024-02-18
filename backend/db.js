const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://tanmay:Tanmay2314@foodlier.feuuobv.mongodb.net/fooder?retryWrites=true&w=majority";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true});
    console.log("Connected to Mongo Successfully!!!!!!!")
    // mongoose.set("strictQuery", false);
    const fetched_data = await mongoose.connection.db.collection("food_itms");
    const foodcategory = await mongoose.connection.db.collection("food_cater");
    const data = await fetched_data.find({}).toArray();
    const food_category = await foodcategory.find({}).toArray();
    global.food_itms = data;
    global.food_cater = food_category;
    // console.log(global.food_cater);
    
    
  }
  catch (error) {
    console.error(error);
  }
};
module.exports = connectToMongo;
