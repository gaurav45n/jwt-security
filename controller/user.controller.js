const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User = require('../model/user.model.js');

// // Retrieve and return all users from the database.
// exports.findAll = (req, res) => {
// User.find()
//   .then(users => {
//   res.send(users);
// }).catch(err => {
//   res.status(500).send({
//   message: err.message || "Something went wrong while getting list of users."
// });
// });
// };

// Create and Save a new User
 // Our register logic starts here
const createUser=async(req,res,next)=>{
 try {
  // Get user input
  const { first_name, last_name, email, password } = req.body;
  console.log("req body", req.body);
  console.log("first name", first_name);
  // Validate user input
  if (!(email && password && first_name && last_name)) {
    res.status(400).send("All input is required");
  }

  // check if user already exist
  // Validate if user exist in our database
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res.status(409).send("User Already Exist. Please Login");
  }

  //Encrypt user password
  const salt = bcrypt.genSaltSync(10)
  encryptedPassword = await bcrypt.hash(password, salt);

  // Create user in our database
  const user = await User.create({
    first_name,
    last_name,
    email: email.toLowerCase(), // sanitize: convert email to lowercase
    password: encryptedPassword,
  });

  // Create token
  const token = jwt.sign(
    { user_id: user._id, email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  // save user token
  user.token = token;

  // return new user
  res.status(201).json(user);
} catch (err) {
  console.log(err);
}}


const login = async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
}

module.exports={
  createUser,
  login
}



// // Our register logic ends here
// // Find a single User with a id
// exports.findOne = (req, res) => {
//  User.findById(req.params.id)
//   .then(user => {
//   if(!user) {
//    return res.status(404).send({
//    message: "User not found with id " + req.params.id
//  });
// }
//  res.send(user);
// }).catch(err => {
//   if(err.kind === 'ObjectId') {
//     return res.status(404).send({
//     message: "User not found with id " + req.params.id
//   });
// }
// return res.status(500).send({
//   message: "Error getting user with id " + req.params.id
// });
// });
// };
// // Update a User identified by the id in the request
// exports.update = (req, res) => {
// // Validate Request
// if(!req.body) {
//   return res.status(400).send({
//   message: "Please fill all required field"
// });
// }
// // Find user and update it with the request body
// User.findByIdAndUpdate(req.params.id, {
//   first_name: req.body.first_name,
//   last_name: req.body.last_name,
//   email: req.body.last_name,
//   phone: req.body.last_name
// }, {new: true})
// .then(user => {
//  if(!user) {
//    return res.status(404).send({
//    message: "user not found with id " + req.params.id
//  });
// }
// res.send(user);
// }).catch(err => {
// if(err.kind === 'ObjectId') {
//   return res.status(404).send({
//   message: "user not found with id " + req.params.id
// });
// }
// return res.status(500).send({
//   message: "Error updating user with id " + req.params.id
// });
// });
// };
// // Delete a User with the specified id in the request
// exports.delete = (req, res) => {
// User.findByIdAndRemove(req.params.id)
// .then(user => {
// if(!user) {
//   return res.status(404).send({
//   message: "user not found with id " + req.params.id
// });
// }
// res.send({message: "user deleted successfully!"});
// }).catch(err => {
// if(err.kind === 'ObjectId' || err.name === 'NotFound') {
//   return res.status(404).send({
//   message: "user not found with id " + req.params.id
// });
// }
// return res.status(500).send({
//   message: "Could not delete user with id " + req.params.id
// });
// });
// };