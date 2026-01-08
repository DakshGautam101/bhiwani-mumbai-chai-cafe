const requestOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  cache: 'no-store'
};

export const getCategories = async () => {
  try {
    const response = await fetch('/api/menu/GetCategories', {
      ...requestOptions,
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch categories: ${errorText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getMenuItems = async () => {
  try {
    // Use relative URL instead of base URL
    const response = await fetch('/api/menu/GetItems', {
      ...requestOptions,
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch items: ${errorText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

export const getMenuData = async () => {
  try {
    // Fetch both categories and items concurrently
    const [categories, items] = await Promise.all([
      getCategories(),
      getMenuItems()
    ]);

    // Map items to their categories
    return categories.map(category => ({
      ...category,
      items: items.filter(item => 
        item.category?.name === category.name || 
        item.category === category._id ||
        item.category?._id === category._id
      )
    }));
  } catch (error) {
    console.error("Error building menu data:", error);
    return [];
  }
};

export const getCategoryItems = async (categoryId) => {
  if (!categoryId) return [];

  try {
    const response = await fetch(`/api/menu/GetCategoryItems?categoryId=${categoryId}`, {
      ...requestOptions,
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch items: ${errorText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error("Error fetching category items:", error);
    return [];
  }
};