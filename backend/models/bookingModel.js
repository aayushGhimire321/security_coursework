const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    seats:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seats",
        required: true,
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status:{
        type:String,
        default:'pending'
    }
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
