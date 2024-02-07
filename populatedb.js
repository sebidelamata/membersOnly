#! /usr/bin/env node

require('dotenv').config();


console.log(
    'This script populates some test Users and messages to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  const User = require("./models/user");
  const Message = require("./models/message");
  
  const users = [];
  const messages = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = process.env.MONGO_DB_CONNECTION_STRING;
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createUsers();
    await createMessages();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function userCreate(
    index,
    first_name, 
    last_name, 
    username,
    password,
    membership,
    admin,
    ) {
    const user = new User({
      first_name: first_name, 
      last_name: last_name, 
      username: username, 
      password: password, 
      membership: membership, 
      admin: admin, 
    });
    await user.save();
    users[index] = user;
    console.log(`Added user: ${username}`);
  }
  
  async function messageCreate(
    index,
    message, 
    publish_date, 
    user_id,
    ) {
    const messagedetail = { message: message, publish_date: publish_date, user_id: user_id };
    const newMessage = new Message(messagedetail);
  
    await newMessage.save();
    messages[index] = newMessage;
    console.log(`Added message: ${message}`);
  }
  
  async function createUsers() {
    console.log("Adding users");
    await Promise.all([
      userCreate(
        index = 0,
        first_name = "Sebi", 
        last_name = "de la Mata", 
        username = "sebidelamata@gmail.com", 
        password = "test", 
        membership = true, 
        admin = true, 
      ),
      userCreate(
        index = 1,
        first_name = "Bob", 
        last_name = "Smith", 
        username = "bobsmith@test.com", 
        password = "test", 
        membership = true, 
        admin = false, 
      ),
      userCreate(
        index = 2,
        first_name = "Sarah", 
        last_name = "Jones", 
        username = "sarajones@test.com", 
        password = "test", 
        membership = true, 
        admin = false, 
      ),
    ]);
  }
  
  async function createMessages() {
    console.log("Adding messages");
    const originDate = new Date(2024, 1, 3)
    let publishDate = new Date(originDate)

    await Promise.all([
      messageCreate(
        index = 0,
        message = "Hello World", 
        publish_date = originDate, 
        user_id = users[0],
      ),
      messageCreate(
        index = 1,
        message = "I like ribs", 
        publish_date = publishDate.setDate(originDate.getDate() + 5), 
        user_id = users[0],
      ),
      messageCreate(
        index = 2,
        message = "Nice.", 
        publish_date = publishDate.setDate(originDate.getDate() + 3), 
        user_id = users[1],
      ),
      messageCreate(
        index = 3,
        message = "Next Tuesday There Will be a Meeting", 
        publish_date = publishDate.setDate(originDate.getDate() + 4), 
        user_id = users[0],
      ),
      messageCreate(
        index = 4,
        message = "I will be late", 
        publish_date = publishDate.setDate(originDate.getDate() + 5), 
        user_id = users[2],
      ),
    ]);
  }
  
