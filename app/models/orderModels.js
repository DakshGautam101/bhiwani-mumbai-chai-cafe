import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  deliveryMethod: {
    type: String,
    enum: ['store', 'delivery'],
    required: true
  },

  deliveryAddress: {
    city: String,
    address: String,
    zip: String
  },

  deliveryDate: {
    type: String,
    required: true
  },

  deliveryTime: {
    type: String,
    required: true
  },

  contactInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },

  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cash on delivery', 'other'],
    required: true
  },

  // Razorpay fields
  razorpayOrderId: {
    type: String, // from Razorpay's create order API
  },
  razorpayPaymentId: {
    type: String, // after successful payment
  },
  razorpaySignature: {
    type: String, // for server-side verification
  },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },

  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending'
  }

}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
