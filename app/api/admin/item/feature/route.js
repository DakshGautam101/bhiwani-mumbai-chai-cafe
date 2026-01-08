import { connectDB } from "@/lib/ConnectDB";
import { Item } from "@/app/models/itemModel";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }


    // Set the item as featured
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { isFeatured: true },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({
      message: "Item marked as featured successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Feature item error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
