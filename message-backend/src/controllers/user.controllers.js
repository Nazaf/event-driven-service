var amqp = require('amqplib/callback_api');
const User = require('../models/user.model.js');

//amqp.connect('amqp://localhost', function(error0, connection) {});

function createChannel(address) {
  amqp.connect('amqp://rabbitmq', function(error0, connection) {
    console.log("CONEENNN", connection)
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'hello';
    //var msg = 'Hello world';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(address));
    console.log(" [x] Sent %s", address);
  });
});
}

exports.findAll = (req, res) => {
  User.find()
    .then(users => {
    res.send(users);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting list of users."
  });
  });
  };

  exports.create = (req, res) => {
    // Validate request
    if(!req.body) {
      return res.status(400).send({
      message: "Please fill all required field"
    });
    }
    // Create a new User
    const user = new User({
      user_info: req.body.user_info,
      address_attributes: req.body.address_attributes,
    });

    const address = req.body.address_attributes.street + ',' + req.body.address_attributes.neighborhood;
    // Save user in the database
    user.save()
      .then(data => {
      res.send(data);
      createChannel(address);
      console.log("in controller")
    }).catch(err => {
      res.status(500).send({
      message: err.message || "Something went wrong while creating new user."
    });
    });
    };