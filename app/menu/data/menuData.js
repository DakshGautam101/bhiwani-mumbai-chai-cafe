const requestOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export const getCategories = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/menu/GetCategories", requestOptions);
    if (!response.ok) throw new Error("Failed to fetch categories");

    const categories = await response.json();

    // Get items to calculate count per category
    const items = await getMenuItems();

    // Append itemsCount manually
    const enhancedCategories = categories.map((cat) => ({
      ...cat,
      itemsCount: items.filter((item) => item.category === cat.name).length,
    }));

    return enhancedCategories;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMenuItems = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/menu/GetItems", requestOptions);
    if (!response.ok) throw new Error("Failed to fetch items");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMenuData = async () => {
  const categories = await getCategories();
  const items = await getMenuItems();

  return categories.map((category) => ({
    ...category,
    items: items.filter(
      (item) =>
        (typeof item.category === "string" && item.category === category._id) ||
        (typeof item.category === "object" && item.category?._id === category._id)
    ),
  }));
};