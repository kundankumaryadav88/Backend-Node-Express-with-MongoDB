const mongoose = require('mongoose');
const config = require("../config/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const Product = require("../models/product");

// Connect to DB
const db = config.DB_HOST;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
 }).then(()=>{
    console.log(`connection to database established`)
}).catch(err=>{
    console.log(`db errors ${err.message}`)
});

exports.register = async (req, res) => {

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(req.body.password, salt);

    // Create an user object
    let user = new User({
        email: req.body.email,
        name: req.body.name,
        password: hasPassword,
        role: req.body.role
    })

    // Save User in the database
    user.save((err, registeredUser) => {
        if (err) {
            console.log(err)
        } else {
            // create payload then Generate an access token
            let payload = { id: registeredUser._id, role: req.body.role || 0 };
            const token = jwt.sign(payload, config.TOKEN_SECRET);
            // sessionStorage.setItem("Token",token); 
            res.status(200).send({ token })
        }
    })
}


// By Admin
exports.createproduct = (req, res) => {
    // Validate request
    if (!req.body.title) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    // Create a product
    const product = new Product({
      productname: req.body.productname,
      productprice: req.body.productprice,
      productdescription: req.body.productdescription,
      inventroy: req.body.inventroy,
    });
    // Save product in the database
    product
      .save(product)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the product."
        });
      });
  };


  // get operation
  exports.findAllproduct = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
    Product.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving product."
        });
      });
  };

//Update operation
exports.updateproduct = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
    const id = req.params.id;
    Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Product with id=${id}. Maybe Product was not found!`
          });
        } else res.send({ message: "Product was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Product with id=" + id
        });
      });
  };

exports.login = async (req, res) => {

    User.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            console.log(err)
        } else {
            if (user) {
                const validPass = await bcrypt.compare(req.body.password, user.password);
                if (!validPass) return res.status(401).send("Mobile/Email or Password is wrong");

                // Create and assign token
                let payload = { id: user._id, role: user.role };
                const token = jwt.sign(payload, config.TOKEN_SECRET);

                res.status(200).header("auth-token", token).send({ "token": token });
            }
            else {
                res.status(401).send('Invalid mobile')
            }

        }
    })
}

// Access auth users only
exports.userEvent = (req, res) => {
    let events = [
        {
            "_id": "1",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "2",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "3",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        }
    ]
    res.json(events)
};

exports.adminEvent = (req, res) => {
    let specialEvents = [
        {
            "_id": "1",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "2",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "3",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "4",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "5",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "6",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        }
    ]
    res.json(specialEvents)

}