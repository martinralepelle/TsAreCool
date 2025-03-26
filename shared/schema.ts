import { pgTable, text, serial, integer, boolean, decimal, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  name: text("name"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User addresses table
export const userAddresses = pgTable("user_addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  addressName: text("address_name").notNull(), // e.g., "Home", "Work", "Mom's house"
  isDefault: boolean("is_default").default(false),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertUserAddressSchema = createInsertSchema(userAddresses).omit({
  id: true,
  createdAt: true,
});

// Payment methods table
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  cardName: text("card_name").notNull(), // e.g., "Personal Card", "Business Card" 
  cardholderName: text("cardholder_name").notNull(),
  cardNumber: text("card_number").notNull(), // Last 4 digits only
  cardType: text("card_type").notNull(), // Visa, Mastercard, etc.
  expiryMonth: text("expiry_month").notNull(),
  expiryYear: text("expiry_year").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  images: json("images").$type<string[]>(),
  materials: text("materials"),
  careInstructions: text("care_instructions"),
  inStock: boolean("in_stock").default(true),
  availableColors: json("available_colors").$type<string[]>(),
  availableSizes: json("available_sizes").$type<string[]>(),
  gender: text("gender").default("unisex"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({ 
  id: true,
  createdAt: true 
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  orderNumber: text("order_number").notNull(),
  status: text("status").notNull().default("processing"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: json("shipping_address").notNull(),
  billingAddress: json("billing_address"),
  paymentMethod: text("payment_method").notNull(),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ 
  id: true,
  createdAt: true 
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  size: text("size").notNull(),
  color: text("color").notNull(),
  imageUrl: text("image_url"),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ 
  id: true 
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserAddress = typeof userAddresses.$inferSelect;
export type InsertUserAddress = z.infer<typeof insertUserAddressSchema>;

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
