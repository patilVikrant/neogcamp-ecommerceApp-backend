const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.models");
const Cart = require("./models/cart.models");
const Wishlist = require("./models/wishlist.models");
const Address = require("./models/address.models");
const Order = require("./models/order.models");
initializeDatabase();

async function addBook(book) {
  try {
    const newBook = new Book(book);
    const saveBook = await newBook.save();
    return saveBook;
  } catch (error) {
    console.log(error);
  }
}

app.post("/books", async (req, res) => {
  try {
    const newBook = await addBook(req.body);
    res.status(201).json({ mesaage: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to add the book" });
  }
});

async function getAllBooks() {
  try {
    const books = await Book.find();
    return books;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await getAllBooks();
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "Books not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the books" });
  }
});

async function getBookById(id) {
  try {
    const book = await Book.findById(id);
    return book;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/:bookId", async (req, res) => {
  try {
    const book = await getBookById(req.params.bookId);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the book" });
  }
});

// cart
async function addItemToCart(book) {
  try {
    const { _id } = book;
    const itemInCart = await Cart.findById(_id);
    if (itemInCart) {
      itemInCart.quantity = itemInCart.quantity + 1;
      const saveCartItem = await itemInCart.save();
      return saveCartItem;
    } else {
      const newCartItem = new Cart(book);
      const saveCartItem = await newCartItem.save();
      return saveCartItem;
    }
  } catch (error) {
    console.log(error);
  }
}

app.post("/cart", async (req, res) => {
  try {
    const newItem = await addItemToCart(req.body);
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book to the cart" });
  }
});

async function getAllCartItems() {
  try {
    const allCartItems = await Cart.find();
    return allCartItems;
  } catch (error) {
    console.log(error);
  }
}

app.get("/cart", async (req, res) => {
  try {
    const allCartItems = await getAllCartItems();
    if (allCartItems.length != 0) {
      res.json(allCartItems);
    } else {
      res.json({ message: "Cart is empty" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetched the items" });
  }
});

async function increaseQuantityInCart(id) {
  try {
    const item = await Cart.findById(id);
    item.quantity += 1;
    const updatedItem = await item.save();
    return updatedItem;
  } catch (error) {
    console.log(error);
  }
}

app.post("/cart/increase/:id", async (req, res) => {
  try {
    const updatedItem = await increaseQuantityInCart(req.params.id);
    res
      .status(200)
      .json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to increased the item quantity" });
  }
});

async function decreaseQuantityInCart(id) {
  try {
    const item = await Cart.findById(id);
    if (item.quantity > 1) {
      item.quantity -= 1;
      const updatedItem = await item.save();
      return updatedItem;
    } else {
      const deleteItem = await Cart.findByIdAndDelete(id);
      return deleteItem;
    }
  } catch (error) {
    console.log(error);
  }
}

app.post("/cart/decrease/:id", async (req, res) => {
  try {
    const updatedItem = await decreaseQuantityInCart(req.params.id);
    res
      .status(200)
      .json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to decreased the item quantity" });
  }
});

async function deleteItemInCart(id) {
  try {
    const deleteItem = await Cart.findByIdAndDelete(id);
    return deleteItem;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/cart/:id", async (req, res) => {
  try {
    const deleteItem = await deleteItemInCart(req.params.id);
    res
      .status(200)
      .json({ message: "Item deleted successfully.", item: deleteItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the item." });
  }
});

// wishlist
async function addItemToWishlist(item) {
  try {
    const newItem = new Wishlist(item);
    const saveItem = await newItem.save();
    return saveItem;
  } catch (error) {
    console.log(error);
  }
}

app.post("/wishlist", async (req, res) => {
  try {
    const newItem = await addItemToWishlist(req.body);
    res.status(201).json({ mesaage: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to add the item" });
  }
});

async function getAllWishlistItems() {
  try {
    const allWishlistItems = await Wishlist.find();
    return allWishlistItems;
  } catch (error) {
    console.log(error);
  }
}

app.get("/wishlist", async (req, res) => {
  try {
    const allWishlistItems = await getAllWishlistItems();
    if (allWishlistItems.length != 0) {
      res.json(allWishlistItems);
    } else {
      res.json({ message: "Wishlist is empty" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetched the items" });
  }
});

async function removeItemFromWishlist(id) {
  try {
    const removeItem = await Wishlist.findByIdAndDelete(id);
    return removeItem;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/wishlist/:id", async (req, res) => {
  try {
    const removeItem = await removeItemFromWishlist(req.params.id);
    res
      .status(200)
      .json({ message: "Item removed successfully.", item: removeItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove the item." });
  }
});

// address
async function addAddress(address) {
  try {
    const newAddress = new Address(address);
    const saveAddress = await newAddress.save();
    return saveAddress;
  } catch (error) {
    console.log(error);
  }
}

app.post("/address", async (req, res) => {
  try {
    const newAddress = await addAddress(req.body);
    res
      .status(201)
      .json({ mesaage: "Address added successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ error: "Failed to add the address" });
  }
});

async function getAllAddresses() {
  try {
    const addresses = await Address.find();
    return addresses;
  } catch (error) {
    console.log(error);
  }
}

app.get("/address", async (req, res) => {
  try {
    const addresses = await getAllAddresses();
    if (addresses.length != 0) {
      res.json(addresses);
    } else {
      res.status(404).json({ error: "Addresses not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the addresses" });
  }
});

async function getAddressById(id) {
  try {
    const address = await Address.findById(id);
    return address;
  } catch (error) {
    console.log(error);
  }
}

app.get("/address/:id", async (req, res) => {
  try {
    const address = await getAddressById(req.params.id);
    if (address) {
      res.json(address);
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the Address" });
  }
});

async function updateAddress(id, dataToUpdate) {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
    });
    return updatedAddress;
  } catch (error) {
    console.log(error);
  }
}

app.post("/address/:id", async (req, res) => {
  try {
    const updatedAddress = await updateAddress(req.params.id, req.body);
    if (updatedAddress) {
      res.status(200).json({ message: "Address updated successfully" });
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the address" });
  }
});

async function deleteAddress(id) {
  try {
    const deletedAddress = await Address.findByIdAndDelete(id);
    return deletedAddress;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/address/:id", async (req, res) => {
  try {
    const deletedAddress = await deleteAddress(req.params.id);
    res.status(200).json({
      message: "Address deleted successfully.",
      address: deletedAddress,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the address." });
  }
});

// orders
async function createOrder(order) {
  try {
    const newOrder = new Order(order);
    const saveOrder = await newOrder.save();
    return saveOrder;
  } catch (error) {
    console.log(error);
  }
}

app.post("/order", async (req, res) => {
  try {
    const newOrder = await createOrder(req.body);
    res
      .status(201)
      .json({ mesaage: "Order added successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to add the order" });
  }
});

async function getAllOrders() {
  try {
    const orders = await Order.find().populate("items deliveryAddress");
    return orders;
  } catch (error) {
    console.log(error);
  }
}

app.get("/order", async (req, res) => {
  try {
    const orders = await getAllOrders();
    if (orders.length != 0) {
      res.json(orders);
    } else {
      res.json({ message: "There are no orders" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the orders" });
  }
});

async function getOrderById(id) {
  try {
    const order = await Order.findById(id).populate("items deliveryAddress");
    return order;
  } catch (error) {
    console.log(error);
  }
}

app.get("/order/:id", async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the Order" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
