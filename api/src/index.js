const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require("bcrypt")
// Create the Express app
const app = express();
app.use(cors());
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  next(); 
})
app.use(bodyParser.json());
app.use([
    express.json(),
    express.urlencoded({ extended: false })]);

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://husamkmal94:Passw0rd@cluster0.n1ievpr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define the schema for User
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  phoneNumber: String
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Login user
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        // Compare the provided password with the stored password
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.status(500).json({ error: 'Failed to compare passwords' });
          } else if (result) {
            // Passwords match, user is authenticated
            res.json({ message: 'Login successful' });
          } else {
            // Passwords don't match
            res.status(401).json({ error: 'Invalid password' });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to retrieve user' });
    });
});
// Register user
app.post('/register', (req, res) => {
  const { username, password,phoneNumber } = req.body;

  // Check if the username already exists
  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.status(409).json({ error: 'Username already exists' });
      } else {
        // Hash the password using bcrypt before storing it in the database
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: 'Failed to hash password' });
          } else {
            // Create a new user document
            const newUser = new User({
              username,
              password: hash, // Store the hashed password
              phoneNumber,
            });

            // Save the new user to the database
            newUser.save()
              .then(() => {
                res.json({ message: 'Registration successful' });
              })
              .catch((error) => {
                res.status(500).json({ error: 'Failed to register user' });
              });
            }
          });
        }
      })
      .catch((error) => {
      console.log(error)
      res.status(500).json({ error: 'Failed to check username' });
    });
});
const deviceSchema = new mongoose.Schema({
    picture: String,
    name: String,
    price: Number,
    description: String,
    state: String
  });
  
  // Define the schema for rented devices
  const rentDeviceSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    deviceId: mongoose.Types.ObjectId,
    days: Number,
    dateStart: Date,
    dateEnd: Date,
    phoneNumber: String,
    location: String
  });
  
  // Create the models
  const Device = mongoose.model('Device', deviceSchema);
  const RentDevice = mongoose.model('RentDevice', rentDeviceSchema);
  
  // Create a new device
  app.post('/devices', (req, res) => {
    const { picture, name, price, description, state } = req.body;
    const newDevice = new Device({ picture, name, price, description, state });
  
    newDevice.save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to create device' });
      });
  });
  
  // Get all devices
  app.get('/devices', (req, res) => {
    
    Device.find()
      .then((devices) => {
        
        res.json(devices);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to get devices' });
      });
  });

  app.delete('/devices/:id', (req, res) => {
    const deviceId = req.params.id;
  
    Device.findByIdAndDelete(deviceId)
      .then((deletedDevice) => {
        if (deletedDevice) {
          res.json({ message: 'Device deleted successfully' });
        } else {
          res.status(404).json({ error: 'Device not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to delete device' });
      });
  });
  
  // Create a new rented device
  app.post('/rented-devices', (req, res) => {
    const { userId, deviceId, days, dateStart, dateEnd, phoneNumber, location } = req.body;
    const newRentDevice = new RentDevice({ userId, deviceId, days, dateStart, dateEnd, phoneNumber, location });
  
    newRentDevice.save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to create rented device' });
      });
  });
  
  // Get all rented devices
  app.get('/rented-devices', (req, res) => {
    RentDevice.find()
      .then((rentedDevices) => {
        res.json(rentedDevices);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to get rented devices' });
      });
  });
// Start the server
app.listen(4000, () => {
  console.log('Server started on port 3000');
});
