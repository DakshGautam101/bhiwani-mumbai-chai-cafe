import React from "react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";
import CafeItemsClient from "./CafeItemsClient";

const dirContent = fs.readdirSync("content", "utf-8");

const cafeItems = dirContent.map((file) => {
  const fileContent = fs.readFileSync(`content/${file}`, "utf-8");
  const { data } = matter(fileContent);
  return data;
});

const CafeItemsSection = () => {
  return <CafeItemsClient items={cafeItems} />;
};

export default CafeItemsSection;