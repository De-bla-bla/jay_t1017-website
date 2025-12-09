import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// In-memory store for testing (replace with database later)
let merchStore = [
  {
    id: 1,
    name: "JayT1017 T-Shirt",
    description: "Classic black t-shirt with JayT1017 logo",
    price: 50,
    original_price: 75,
    category: "Apparel",
    image: "https://via.placeholder.com/300x300?text=T-Shirt"
  },
  {
    id: 2,
    name: "Snapback Cap",
    description: "Premium snapback with embroidered logo",
    price: 35,
    original_price: null,
    category: "Accessories",
    image: "https://via.placeholder.com/300x300?text=Cap"
  },
  {
    id: 3,
    name: "Hoodie",
    description: "Comfortable pullover hoodie",
    price: 80,
    original_price: 120,
    category: "Apparel",
    image: "https://via.placeholder.com/300x300?text=Hoodie"
  }
];

// Get all merch items
router.get("/", async (req, res) => {
  try {
    // Try to get from database first
    try {
      const result = await pool.query("SELECT * FROM merch ORDER BY id DESC");
      return res.json(result.rows);
    } catch (dbErr) {
      // If database fails, use in-memory store
      console.log("Database unavailable, using in-memory data");
      return res.json(merchStore);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch merch" });
  }
});

// Get single merch item
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try database first
    try {
      const result = await pool.query("SELECT * FROM merch WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
      return res.json(result.rows[0]);
    } catch (dbErr) {
      // Fall back to in-memory
      const item = merchStore.find(m => m.id === parseInt(id));
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      return res.json(item);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

// Create merch item
router.post("/", async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, image } = req.body;
    
    // Try database first
    try {
      const result = await pool.query(
        "INSERT INTO merch (name, description, price, original_price, category, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, description, price, originalPrice, category, image]
      );
      return res.status(201).json(result.rows[0]);
    } catch (dbErr) {
      // Fall back to in-memory
      const newItem = {
        id: Math.max(...merchStore.map(m => m.id), 0) + 1,
        name,
        description: description || "",
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        category: category || "",
        image: image || ""
      };
      merchStore.push(newItem);
      return res.status(201).json(newItem);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

// Update merch item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, originalPrice, category, image } = req.body;
    
    // Try database first
    try {
      const result = await pool.query(
        "UPDATE merch SET name = $1, description = $2, price = $3, original_price = $4, category = $5, image = $6 WHERE id = $7 RETURNING *",
        [name, description, price, originalPrice, category, image, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
      return res.json(result.rows[0]);
    } catch (dbErr) {
      // Fall back to in-memory
      const itemIndex = merchStore.findIndex(m => m.id === parseInt(id));
      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      const updatedItem = {
        id: parseInt(id),
        name,
        description: description || "",
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        category: category || "",
        image: image || ""
      };
      
      merchStore[itemIndex] = updatedItem;
      return res.json(updatedItem);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// Delete merch item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try database first
    try {
      const result = await pool.query("DELETE FROM merch WHERE id = $1 RETURNING id", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
      return res.json({ message: "Item deleted successfully" });
    } catch (dbErr) {
      // Fall back to in-memory
      const itemIndex = merchStore.findIndex(m => m.id === parseInt(id));
      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      merchStore.splice(itemIndex, 1);
      return res.json({ message: "Item deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;
