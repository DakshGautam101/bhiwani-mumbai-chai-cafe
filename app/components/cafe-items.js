import React from "react";
import { Button } from "@/components/ui/button"; 
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link'; 
import fs, { readFileSync } from "fs";
import matter from "gray-matter";


const dirContent = fs.readdirSync("content", "utf-8")

const cafeItems = dirContent.map(file => {
  const fileContent = fs.readFileSync(`content/${file}`, "utf-8")
  const { data } = matter(fileContent)
  return data;
}
)

const CafeItemsSection = () => {

  

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-8">Our Top Cafe Items</h2>

        {/* Responsive Grid Layout */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cafeItems.map((item, index) => (
            <div
              key={index}
              className=" rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 border"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="">{item.description}</p>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center">
                  <Link
                    href={`/cafe/${item.slug}`}
                    className={`${buttonVariants({ variant: "outline" })} w-full sm:w-auto bg-orange-400 hover:bg-orange-700 font-semibold cursor-pointer transition duration-300 dark:bg-orange-500 dark:hover:bg-orange-700`}
                  >
                    Read More
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-orange-400 hover:bg-orange-700 font-semibold cursor-pointer transition duration-300 dark:bg-orange-500 dark:hover:bg-orange-700"
                  >
                    Add to Cart
                  </Button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CafeItemsSection;
