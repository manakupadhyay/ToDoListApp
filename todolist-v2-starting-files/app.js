//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-manak:test123@cluster0-hbo3u.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
  name:String
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Add a new item "
})

const item2 = new Item({
  name:"Delete an item"
})

  const itemsArray = [item1,item2];

app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
  if(foundItems.length == 0){
    Item.insertMany(itemsArray, function(err){
      if(err){
        console.log("error");
      }else{
        console.log("Successfully saved");
      }
    });
    res.redirect('/');
  }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
});
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name : itemName
  })
    item.save();
    res.redirect("/");
});

app.post('/delete', function(req,res){
  const checkedItem = req.body.checkbox;
  Item.deleteOne({_id:checkedItem},function(err){
    if(err){
      console.log("Error Occured");
    }else{
      console.log("Successfully deleted item");
      res.redirect('/')
    }
  });

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
