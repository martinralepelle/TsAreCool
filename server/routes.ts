import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertUserSchema, insertUserAddressSchema, insertPaymentMethodSchema } from "@shared/schema";
import { z } from "zod";
import { randomBytes } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // In a real app, we would hash the password here
      const user = await storage.createUser(validatedData);
      
      // Don't send the password back
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      // In a real app, we would compare hashed passwords
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't send the password back
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", async (req, res) => {
    // For development purposes, return our default test user
    try {
      const testUser = await storage.getUserByUsername("testuser");
      if (testUser) {
        // Don't send the password back
        const { password, ...userWithoutPassword } = testUser;
        return res.json(userWithoutPassword);
      }
      res.status(401).json({ message: "Not authenticated" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, color, size, gender, sort, page, pageSize } = req.query;
      const filter: { 
        category?: string; 
        inStock?: boolean;
        color?: string;
        size?: string;
        gender?: string;
        sort?: string;
        page?: number;
        pageSize?: number;
      } = { inStock: true };
      
      if (category && typeof category === 'string') {
        filter.category = category;
      }
      
      if (color && typeof color === 'string') {
        filter.color = color;
      }
      
      if (size && typeof size === 'string') {
        filter.size = size;
      }
      
      if (gender && typeof gender === 'string') {
        filter.gender = gender;
      }
      
      if (sort && typeof sort === 'string') {
        filter.sort = sort;
      }
      
      // Handle pagination
      if (page && typeof page === 'string') {
        filter.page = parseInt(page);
      }
      
      if (pageSize && typeof pageSize === 'string') {
        filter.pageSize = parseInt(pageSize);
      }
      
      const result = await storage.getProducts(filter);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { shippingInfo, paymentInfo, cartItems } = req.body;
      
      if (!shippingInfo || !paymentInfo || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ message: "Missing required order information" });
      }
      
      // Calculate order totals
      const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const shipping = 5.99;
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + shipping + tax;
      
      // Create the order
      const order = await storage.createOrder(
        {
          // In a real app, userId would come from the authenticated session
          userId: null,
          orderNumber: `T${randomBytes(3).toString('hex').toUpperCase()}`,
          status: "processing",
          subtotal,
          shipping,
          tax,
          total,
          shippingAddress: shippingInfo,
          paymentMethod: paymentInfo.paymentMethod,
        },
        // Map cart items to order items
        cartItems.map(item => ({
          productId: item.productId,
          orderId: 0, // This will be set by storage.createOrder
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          imageUrl: item.imageUrl
        }))
      );
      
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      // In a real app, we would get the user ID from the session
      // and only return their orders
      const orders = await storage.getOrders();
      
      // For each order, get the order items
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return { ...order, items };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const orderWithItems = await storage.getOrderWithItems(id);
      
      if (!orderWithItems) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(orderWithItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.get("/api/orders/recent", async (req, res) => {
    try {
      // In a real app, we would get the user ID from the session
      // and return their most recent order
      const orders = await storage.getOrders();
      
      if (orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }
      
      // Sort orders by creation date (newest first)
      orders.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
        return dateB.getTime() - dateA.getTime();
      });
      
      const mostRecentOrder = orders[0];
      const items = await storage.getOrderItems(mostRecentOrder.id);
      
      res.json({ ...mostRecentOrder, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent order" });
    }
  });

  // User profile routes
  app.get("/api/users/profile", async (req, res) => {
    // For development purposes, we'll use our test user
    try {
      const testUser = await storage.getUserByUsername("testuser");
      if (testUser) {
        // Don't send the password back
        const { password, ...userWithoutPassword } = testUser;
        return res.json(userWithoutPassword);
      }
      res.status(401).json({ message: "Not authenticated" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/users/profile", async (req, res) => {
    // For development purposes, we'll use our test user
    try {
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const updatedUser = await storage.updateUser(testUser.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send the password back
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // User address routes
  app.get("/api/users/addresses", async (req, res) => {
    // For development purposes, we'll use our test user
    try {
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const addresses = await storage.getUserAddresses(testUser.id);
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch addresses" });
    }
  });
  
  app.post("/api/users/addresses", async (req, res) => {
    // For development purposes, we'll use our test user
    try {
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const validatedData = insertUserAddressSchema.parse({
        ...req.body,
        userId: testUser.id
      });
      
      const address = await storage.createUserAddress(validatedData);
      res.status(201).json(address);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create address" });
    }
  });
  
  app.get("/api/users/addresses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      // For development purposes, we'll use our test user
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const address = await storage.getUserAddress(id);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      // Ensure the address belongs to the user
      if (address.userId !== testUser.id) {
        return res.status(403).json({ message: "Not authorized to access this address" });
      }
      
      res.json(address);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch address" });
    }
  });
  
  app.put("/api/users/addresses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      // For development purposes, we'll use our test user
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const address = await storage.getUserAddress(id);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      // Ensure the address belongs to the user
      if (address.userId !== testUser.id) {
        return res.status(403).json({ message: "Not authorized to update this address" });
      }
      
      // If setting address as default, unset any other default address first
      if (req.body.isDefault === true) {
        // Get all addresses for this user
        const userAddresses = await storage.getUserAddresses(testUser.id);
        
        // Reset any existing default addresses
        for (const addr of userAddresses) {
          if (addr.id !== id && addr.isDefault) {
            await storage.updateUserAddress(addr.id, { isDefault: false });
          }
        }
      }
      
      const updatedAddress = await storage.updateUserAddress(id, req.body);
      
      if (!updatedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      res.json(updatedAddress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update address" });
    }
  });
  
  app.patch("/api/users/addresses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      // For development purposes, we'll use our test user
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const address = await storage.getUserAddress(id);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      // Ensure the address belongs to the user
      if (address.userId !== testUser.id) {
        return res.status(403).json({ message: "Not authorized to update this address" });
      }
      
      // If setting address as default, unset any other default address first
      if (req.body.isDefault === true) {
        // Get all addresses for this user
        const userAddresses = await storage.getUserAddresses(testUser.id);
        
        // Reset any existing default addresses
        for (const addr of userAddresses) {
          if (addr.id !== id && addr.isDefault) {
            await storage.updateUserAddress(addr.id, { isDefault: false });
          }
        }
      }
      
      const updatedAddress = await storage.updateUserAddress(id, req.body);
      
      if (!updatedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      res.json(updatedAddress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update address" });
    }
  });
  
  app.delete("/api/users/addresses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid address ID" });
      }
      
      // For development purposes, we'll use our test user
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const address = await storage.getUserAddress(id);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      // Ensure the address belongs to the user
      if (address.userId !== testUser.id) {
        return res.status(403).json({ message: "Not authorized to delete this address" });
      }
      
      const success = await storage.deleteUserAddress(id);
      
      if (!success) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete address" });
    }
  });

  app.patch("/api/users/password", async (req, res) => {
    // In a real app, we would get the user ID from the session
    // and update their password
    res.status(401).json({ message: "Not authenticated" });
  });

  // User payment method routes
  app.get("/api/users/payment-methods", async (req, res) => {
    // For development purposes, we'll use our test user
    try {
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const paymentMethods = await storage.getUserPaymentMethods(testUser.id);
      res.json(paymentMethods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });
  
  app.post("/api/users/payment-methods", async (req, res) => {
    // For development purposes, we'll use our test user
    try {
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const validatedData = insertPaymentMethodSchema.parse({
        ...req.body,
        userId: testUser.id
      });
      
      const paymentMethod = await storage.createPaymentMethod(validatedData);
      res.status(201).json(paymentMethod);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create payment method" });
    }
  });
  
  app.get("/api/users/payment-methods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid payment method ID" });
      }
      
      // For development purposes, we'll use our test user
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const paymentMethod = await storage.getUserPaymentMethod(id);
      
      if (!paymentMethod) {
        return res.status(404).json({ message: "Payment method not found" });
      }
      
      // Ensure the payment method belongs to the user
      if (paymentMethod.userId !== testUser.id) {
        return res.status(403).json({ message: "Not authorized to access this payment method" });
      }
      
      res.json(paymentMethod);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment method" });
    }
  });
  
  app.put("/api/users/payment-methods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid payment method ID" });
      }
      
      // For development purposes, we'll use our test user
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const paymentMethod = await storage.getUserPaymentMethod(id);
      
      if (!paymentMethod) {
        return res.status(404).json({ message: "Payment method not found" });
      }
      
      // Ensure the payment method belongs to the user
      if (paymentMethod.userId !== testUser.id) {
        return res.status(403).json({ message: "Not authorized to update this payment method" });
      }
      
      // If setting payment method as default, unset any other default payment method first
      if (req.body.isDefault === true) {
        // Get all payment methods for this user
        const userPaymentMethods = await storage.getUserPaymentMethods(testUser.id);
        
        // Reset any existing default payment methods
        for (const pm of userPaymentMethods) {
          if (pm.id !== id && pm.isDefault) {
            await storage.updatePaymentMethod(pm.id, { isDefault: false });
          }
        }
      }
      
      const updatedPaymentMethod = await storage.updatePaymentMethod(id, req.body);
      
      if (!updatedPaymentMethod) {
        return res.status(404).json({ message: "Payment method not found" });
      }
      
      res.json(updatedPaymentMethod);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment method" });
    }
  });
  
  app.patch("/api/users/payment-methods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid payment method ID" });
      }
      
      // For development purposes, we'll use our test user
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const paymentMethod = await storage.getUserPaymentMethod(id);
      
      if (!paymentMethod) {
        return res.status(404).json({ message: "Payment method not found" });
      }
      
      // Ensure the payment method belongs to the user
      if (paymentMethod.userId !== testUser.id) {
        return res.status(403).json({ message: "Not authorized to update this payment method" });
      }
      
      // If setting payment method as default, unset any other default payment method first
      if (req.body.isDefault === true) {
        // Get all payment methods for this user
        const userPaymentMethods = await storage.getUserPaymentMethods(testUser.id);
        
        // Reset any existing default payment methods
        for (const pm of userPaymentMethods) {
          if (pm.id !== id && pm.isDefault) {
            await storage.updatePaymentMethod(pm.id, { isDefault: false });
          }
        }
      }
      
      const updatedPaymentMethod = await storage.updatePaymentMethod(id, req.body);
      
      if (!updatedPaymentMethod) {
        return res.status(404).json({ message: "Payment method not found" });
      }
      
      res.json(updatedPaymentMethod);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment method" });
    }
  });
  
  app.delete("/api/users/payment-methods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid payment method ID" });
      }
      
      // For development purposes, we'll use our test user
      const testUser = await storage.getUserByUsername("testuser");
      if (!testUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const paymentMethod = await storage.getUserPaymentMethod(id);
      
      if (!paymentMethod) {
        return res.status(404).json({ message: "Payment method not found" });
      }
      
      // Ensure the payment method belongs to the user
      if (paymentMethod.userId !== testUser.id) {
        return res.status(403).json({ message: "Not authorized to delete this payment method" });
      }
      
      const success = await storage.deletePaymentMethod(id);
      
      if (!success) {
        return res.status(404).json({ message: "Payment method not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete payment method" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
