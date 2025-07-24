const requestOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export const getCategories = async () => {
  try {
    const base_url = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3000/api';

    const response = await fetch(`${base_url}/menu/GetCategories`, requestOptions);
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
    const base_url = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3000/api';
    const response = await fetch(`${base_url}/menu/GetItems`, requestOptions);
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