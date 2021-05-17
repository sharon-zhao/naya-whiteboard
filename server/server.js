var app = require('express')();
var express = require('express');
var mongoose = require('mongoose');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
// var db = require('./config/db')
const UserModel = require('./models/user')
const ImageModel = require('./models/image')

app.use(express.json());
app.use(cors())
//app.use(userRoutes)
io.on('connection', (socket) => {
  // canvas-data == to the board emit variable
  socket.on('canvas-data', (data) => {
    socket.broadcast.emit('canvas-data', data);
  })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
  console.log('started on: ' + server_port);
})

app.post('/adduser', async(req, res) => {
    const resuser = req.body.name
    const rescolor = req.body.color
    const user = new UserModel({ name: resuser, color: rescolor })
    try {
      await user.save()
      res.send(user)
    } catch (err){
      console.log(err)
    }
});

app.get('/read', async(req, res) => {
    UserModel.find({}, (err, result) =>{
      if (err) {
        res.send(err)
      }
      res.send(result)
    })
});

app.patch('/updateuser', async(req, res) => {
    console.log('updateuser: ', req.body)
    const imageID = req.body.images
    const id = req.body.id
    try {
        await UserModel.findById(id, (err, updatedUser)=>{
        updatedUser.images.push(imageID)
        console.log('updateuser: ',updatedUser)
        updatedUser.save()
        res.send('update')
      })
    } catch (err){
      console.log(err)
    }
});

app.delete("/delete/:id", async(req,res)=>{
  const id = req.params.id
  await UserModel.findByIdAndRemove(id).exec()
  res.send('delete')
})

//*******************IMAGE*********************//
app.post('/addurl', async(req, res) => {
    // console.log('addurl: ', req.body)
    const resurl = req.body.imageUrl
    const url = new ImageModel({ url:resurl })
    try {
      await url.save()
      res.send(url)
    } catch (err){
      console.log(err)
    }
});

app.get('/images', async(req, res) => {
    ImageModel.find({}, (err, result) =>{
      if (err) {
        res.send(err)
      }
      res.send(result)
    })
});

app.patch('/updateimage', async(req, res) => {
    console.log('update image: ', req.body)
    const imageID = req.body.imageID
    const userID = req.body.id
    try {
        await ImageModel.findById(imageID, (err, updatedImage)=>{
          // console.log('pdatedImage: ', updatedImage)
        updatedImage.users.push(userID)
        updatedImage.save()
        res.send(updatedImage)
      })
    } catch (err){
      console.log(err)
    }
});
// app.listen(server_port, () => {
//     console.log(`Server listening at http://localhost:${server_port}`);
// });

mongoose
  .connect("mongodb+srv://sharon:Zxr2303811992@crud.vonoy.mongodb.net/naya-studio?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch(err => console.error("Connection error", err));
