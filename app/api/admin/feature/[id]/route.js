import { connectDB } from "@/lib/ConnectDB";
import { Item } from "@/app/models/itemsModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
    try {
        // ✅ 1. Authenticate Admin
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded?.email !== process.env.ADMIN_EMAIL) {
                return NextResponse.json({ error: "Admin access required" }, { status: 403 });
            }
        } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // ✅ 2. Connect DB
        await connectDB();

        const { id } = params;
        const { heading, discount } = await req.json();

        const item = await Item.findById(id);
        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        // ✅ 3. Unfeature Item → Restore Original Price
        if (!heading && (!discount || discount === 0)) {
            if (item.originalPrice) {
                item.price = item.originalPrice;
            }
            item.isFeatured = false;
            item.featured = [];
            await item.save();

            return NextResponse.json({
                message: "Item unfeatured successfully",
                item: {
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    rating : item.rating,
                    originalPrice: item.originalPrice,
                    isFeatured: item.isFeatured,
                    featured: item.featured,
                },
            });
        }

        // ✅ 4. Input Validations
        if (!heading || discount === undefined) {
            return NextResponse.json(
                { error: "Heading and discount are required" },
                { status: 400 }
            );
        }
        if (discount < 0 || discount >= 100) {
            return NextResponse.json(
                { error: "Discount must be between 1 and 99" },
                { status: 400 }
            );
        }

        // ✅ 5. Store Original Price If Missing
        if (!item.originalPrice) {
            item.originalPrice = item.price;
        }

        // ✅ 6. Calculate Discounted Price
        const discountedPrice = Math.round(
            item.originalPrice * (1 - discount / 100)
        );

        // ✅ 7. Update Item
        item.price = discountedPrice;
        item.isFeatured = true;
        item.featured = [
            {
                heading,
                discount,
                createdAt: new Date(),
            },
        ];

        await item.save();

        return NextResponse.json({
            message: "Item featured successfully",
            item: {
                _id: item._id,
                name: item.name,
                price: item.price,
                rating : item.rating,
                originalPrice: item.originalPrice,
                isFeatured: item.isFeatured,
                featured: item.featured,
            },
        });
    } catch (error) {
        console.error("Feature toggle error:", error);
        return NextResponse.json(
            { error: "Failed to update feature status" },
            { status: 500 }
        );
    }
}
