import { connectDB } from "@/lib/ConnectDB";
import { Order } from "@/app/models/orderModels";

// NOTE: Ensure your Order schema defines `items.itemId` as
// { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
// and you have a Product model with { name, price, ... }

export async function GET(_req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const order = await Order.findById(id)
      .populate({ path: "items.itemId", select: "name price" })
      .lean();

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ order }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const { status } = await req.json();
    if (!["Pending", "Completed", "Cancelled"].includes(status)) {
      return Response.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate({ path: "items.itemId", select: "name price" })
      .lean();

    if (!updated) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ order: updated, message: "Order status updated" });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    return Response.json({ success: true, message: "Order cancelled" });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
