"use strict";
const mongoose = require('mongoose');
const User = require('../../models/user');
const Service = require('../../models/service');
const Notification = require('../../models/notification');
const Order = require('../../models/order');
exports = module.exports = function(io) { 
  // Set socket.io listeners.
  io.on('connection', (socket) => {
    // create notiication when new order is placed
    const NEW_ORDER = setInterval(() => { 
      Order.findOne({"status": "pending"}).populate("services").exec((err, order) => {
        if(err || !order){
          console.error("error 1");
          return io.emit("error", {from: "Admin", message: "Order not found."});
        } else {
          order.status = "recieved";
          order.save((err, updatedOrder) => {
            if(err) {
              console.error("error 2");
              return io.emit("error", {from: "Admin", message: "Order not found."});
            } else {
              socket.emit("new-order", order); 
            }
          });
        }
      });
    }, 60000);
    socket.on('disconnect', () => {
      clearInterval(NEW_ORDER);
      console.log('Done updating one order');
    });
    //Listen for events to get all orders
    socket.on("get-orders", () => {
      Order.find({"status": "recieved", "createdAt": {$lte: Date.now()}}).limit(3).sort({"createdAt": -1}).populate("services").exec((err, allOrders) => {
        if(err || !allOrders){
          return io.emit("error", {from: "Admin", message: "No orders found."});
        } else {
          socket.emit("all-orders", allOrders);
        }
      });
    });
  });
}