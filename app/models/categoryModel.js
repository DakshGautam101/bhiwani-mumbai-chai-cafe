import mongoose from "mongoose";


export const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
  ],
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
