import { 
  users, User, InsertUser, 
  userAddresses, UserAddress, InsertUserAddress,
  paymentMethods, PaymentMethod, InsertPaymentMethod,
  products, Product, InsertProduct,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // User address operations
  getUserAddresses(userId: number): Promise<UserAddress[]>;
  getUserAddress(id: number): Promise<UserAddress | undefined>;
  createUserAddress(address: InsertUserAddress): Promise<UserAddress>;
  updateUserAddress(id: number, data: Partial<UserAddress>): Promise<UserAddress | undefined>;
  deleteUserAddress(id: number): Promise<boolean>;
  
  // Payment method operations
  getUserPaymentMethods(userId: number): Promise<PaymentMethod[]>;
  getUserPaymentMethod(id: number): Promise<PaymentMethod | undefined>;
  createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: number, data: Partial<PaymentMethod>): Promise<PaymentMethod | undefined>;
  deletePaymentMethod(id: number): Promise<boolean>;
  
  // Product operations
  getProducts(filter?: { 
    category?: string, 
    inStock?: boolean, 
    color?: string, 
    size?: string, 
    gender?: string, 
    sort?: string 
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<Product>): Promise<Product | undefined>;
  
  // Order operations
  getOrders(userId?: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<{ order: Order, items: OrderItem[] } | undefined>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order items operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userAddresses: Map<number, UserAddress>;
  private paymentMethods: Map<number, PaymentMethod>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  
  private userCounter: number;
  private userAddressCounter: number;
  private paymentMethodCounter: number;
  private productCounter: number;
  private orderCounter: number;
  private orderItemCounter: number;

  constructor() {
    this.users = new Map();
    this.userAddresses = new Map();
    this.paymentMethods = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    this.userCounter = 1;
    this.userAddressCounter = 1;
    this.paymentMethodCounter = 1;
    this.productCounter = 1;
    this.orderCounter = 1;
    this.orderItemCounter = 1;
    
    // Initialize with sample products
    this.initializeSampleProducts();
    
    // Create a default test user
    this.createDefaultUser();
    
    // Add sample orders after a short delay to ensure products and user are created
    setTimeout(() => this.initializeSampleOrders(), 1000);
  }
  
  // Create a default user for testing
  private async createDefaultUser() {
    const defaultUser = {
      username: "testuser",
      password: "password123",
      email: "test@example.com",
      name: "Test User",
      phone: "555-123-4567"
    };
    
    const user = await this.createUser(defaultUser);
    
    // Create a default address for the user
    const defaultAddress = {
      userId: user.id,
      addressName: "Home",
      isDefault: true,
      firstName: "Test",
      lastName: "User",
      address: "123 Test Street",
      city: "Test City",
      state: "TS",
      zipCode: "12345",
      country: "Testland",
      phone: "555-123-4567"
    };
    
    await this.createUserAddress(defaultAddress);
    
    // Create a second address for the user
    const workAddress = {
      userId: user.id,
      addressName: "Work",
      isDefault: false,
      firstName: "Test",
      lastName: "User",
      address: "456 Office Building",
      city: "Business City",
      state: "BC",
      zipCode: "67890",
      country: "Testland",
      phone: "555-987-6543"
    };
    
    await this.createUserAddress(workAddress);
    
    // Create sample payment methods
    const visaCard = {
      userId: user.id,
      cardName: "Visa Card",
      cardholderName: "Test User",
      cardNumber: "4234", // Last 4 digits only
      cardType: "visa",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true
    };
    
    await this.createPaymentMethod(visaCard);
    
    const masterCard = {
      userId: user.id,
      cardName: "Master Card",
      cardholderName: "Test User",
      cardNumber: "5678", // Last 4 digits only
      cardType: "mastercard",
      expiryMonth: "06",
      expiryYear: "2026",
      isDefault: false
    };
    
    await this.createPaymentMethod(masterCard);
    
    console.log("Created default test user: username='testuser', password='password123'");
  }

  // Initialize sample t-shirt products
  private initializeSampleProducts() {
    const categories = [
      "Frosty Fresh Tees",
      "Chill Mode Classics",
      "Glacier Graphics",
      "Arctic Streetwear",
      "Frozen Vintage",
      "Icy Luxe"
    ];
    
    const colors = ["White", "Black", "Gray", "Blue", "Red", "Green", "Yellow", "Purple", "Pink", "Orange", "Brown", "Navy"];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
    const genders = ["men", "women", "unisex"];
    
    const sampleProducts: InsertProduct[] = [
      {
        name: "Classic White Tee",
        description: "A pristine white t-shirt that serves as the perfect base for any outfit. Made from soft, breathable cotton with a relaxed fit.",
        price: "29.99",
        category: "Chill Mode Classics",
        imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["White", "Black", "Gray", "Blue"],
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        gender: "unisex"
      },
      {
        name: "Ocean Waves Graphic",
        description: "A refreshing graphic tee featuring a calming ocean wave design. Made from soft, breathable cotton with a relaxed fit for all-day comfort.",
        price: "34.99",
        category: "Glacier Graphics",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
        ],
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Blue", "White", "Navy"],
        availableSizes: ["XS", "S", "M", "L", "XL"],
        gender: "men"
      },
      {
        name: "Summer Stripes",
        description: "A casual striped t-shirt perfect for summer days. The lightweight fabric keeps you cool while looking stylish.",
        price: "32.99",
        category: "Frosty Fresh Tees",
        imageUrl: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "95% Cotton, 5% Spandex",
        careInstructions: "Machine wash cold. Hang dry.",
        inStock: true,
        availableColors: ["Blue", "Red", "Green"],
        availableSizes: ["S", "M", "L", "XL"],
        gender: "women"
      },
      {
        name: "Retro Black",
        description: "A vintage-inspired black t-shirt with a subtle worn-in look. Features a slightly looser fit for that authentic retro feel.",
        price: "27.99",
        category: "Frozen Vintage",
        imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Black", "Gray", "White"],
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        gender: "unisex"
      },
      {
        name: "Soft Touch Premium",
        description: "Our premium t-shirt made from the finest cotton blend for an incredibly soft feel. The perfect balance of comfort and luxury.",
        price: "39.99",
        category: "Icy Luxe",
        imageUrl: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "80% Cotton, 20% Modal",
        careInstructions: "Machine wash cold on gentle cycle. Lay flat to dry.",
        inStock: true,
        availableColors: ["Gray", "Black", "Navy", "Purple"],
        availableSizes: ["S", "M", "L", "XL", "XXL", "3XL"],
        gender: "men"
      },
      {
        name: "Urban Explorer",
        description: "A street-style t-shirt with modern cut and subtle details. Perfect for exploring the city with confidence.",
        price: "36.99",
        category: "Arctic Streetwear",
        imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "90% Cotton, 10% Polyester",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Black", "Gray", "Orange"],
        availableSizes: ["S", "M", "L", "XL"],
        gender: "women"
      },
      {
        name: "Easy Blue",
        description: "A comfortable blue t-shirt that goes with everything. The relaxed fit and soft fabric make it your new everyday favorite.",
        price: "29.99",
        category: "Chill Mode Classics",
        imageUrl: "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Blue", "Navy", "Light Blue"],
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        gender: "men"
      },
      {
        name: "Mountain Range",
        description: "A graphic t-shirt featuring a stunning mountain landscape. Perfect for nature lovers and outdoor enthusiasts.",
        price: "34.99",
        category: "Glacier Graphics",
        imageUrl: "https://images.unsplash.com/photo-1622445275576-721325763afe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Gray", "Green", "Brown"],
        availableSizes: ["S", "M", "L", "XL"],
        gender: "unisex"
      },
      {
        name: "Minimalist Logo Tee",
        description: "A clean, minimalist design with our subtle logo embroidery. Perfect for those who appreciate understated style.",
        price: "32.99",
        category: "Frosty Fresh Tees",
        imageUrl: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Organic Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["White", "Black", "Gray", "Sand"],
        availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
        gender: "unisex"
      },
      {
        name: "Heavyweight Box Tee",
        description: "Premium thick cotton construction with a boxy fit for a contemporary silhouette. Designed for comfort and durability.",
        price: "37.99",
        category: "Arctic Streetwear",
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Heavyweight Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Black", "White", "Charcoal", "Olive"],
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        gender: "unisex"
      },
      {
        name: "Tech Performance Tee",
        description: "Technical fabric that wicks moisture, resists odors, and provides all-day comfort. Perfect for active lifestyles.",
        price: "42.99",
        category: "Chill Mode Classics",
        imageUrl: "https://images.unsplash.com/photo-1604006852748-903fccb73815?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "92% Polyester, 8% Elastane",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Gray", "Black", "Navy", "Red"],
        availableSizes: ["S", "M", "L", "XL"],
        gender: "unisex"
      },
      {
        name: "Abstract Art Tee",
        description: "Showcase your appreciation for modern art with this abstract print collaboration with renowned artist Maya Lin.",
        price: "38.99",
        category: "Glacier Graphics",
        imageUrl: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["White", "Black"],
        availableSizes: ["S", "M", "L", "XL"],
        gender: "unisex"
      },
      {
        name: "Vintage Wash Tee",
        description: "Pre-washed for a perfectly broken-in feel and vintage appearance from day one. Soft, comfortable, and stylish.",
        price: "28.99",
        category: "Frozen Vintage",
        imageUrl: "https://images.unsplash.com/photo-1565366896067-2a9fcc839d10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Washed Black", "Washed Blue", "Washed Red"],
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        gender: "unisex"
      },
      {
        name: "Embroidered Detail Tee",
        description: "Subtle embroidered details add texture and interest to this premium everyday tee. Crafted for style and comfort.",
        price: "36.99",
        category: "Icy Luxe",
        imageUrl: "https://images.unsplash.com/photo-1603251578711-3290abbc94b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["White", "Black", "Beige"],
        availableSizes: ["S", "M", "L", "XL"],
        gender: "unisex"
      },
      {
        name: "Sunset Gradient Tee",
        description: "Vibrant sunset gradient print that brings summer vibes all year round. A eye-catching addition to your wardrobe.",
        price: "31.99",
        category: "Glacier Graphics",
        imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Orange/Pink", "Blue/Purple"],
        availableSizes: ["S", "M", "L", "XL"],
        gender: "unisex"
      },
      {
        name: "Urban Skyline Tee",
        description: "Showcase your urban spirit with this detailed city skyline graphic design. Modern and stylish for city dwellers.",
        price: "33.99",
        category: "Glacier Graphics",
        imageUrl: "https://images.unsplash.com/photo-1553859943-a02c5418b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Gray", "Black", "White"],
        availableSizes: ["S", "M", "L", "XL"],
        gender: "unisex"
      },
      {
        name: "Cropped Relaxed Tee",
        description: "Modern cropped silhouette with dropped shoulders for a relaxed, effortless look. Perfect for layering.",
        price: "27.99",
        category: "Arctic Streetwear",
        imageUrl: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "95% Cotton, 5% Elastane",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["White", "Black", "Pink", "Blue"],
        availableSizes: ["XS", "S", "M", "L"],
        gender: "women"
      },
      {
        name: "Winter Mountain Tee",
        description: "Cozy long sleeve tee with a snow-capped mountain print, perfect for winter days and outdoor adventures.",
        price: "32.99",
        category: "Glacier Graphics",
        imageUrl: "https://images.unsplash.com/photo-1613687114003-1e9f908c1f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        materials: "100% Cotton",
        careInstructions: "Machine wash cold. Tumble dry low.",
        inStock: true,
        availableColors: ["Blue", "White", "Gray"],
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        gender: "unisex"
      }
    ];
    
    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const createdAt = new Date();
    const user: User = { id, ...insertUser, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // User address operations
  async getUserAddresses(userId: number): Promise<UserAddress[]> {
    return Array.from(this.userAddresses.values()).filter(
      (address) => address.userId === userId
    );
  }
  
  async getUserAddress(id: number): Promise<UserAddress | undefined> {
    return this.userAddresses.get(id);
  }
  
  async createUserAddress(insertAddress: InsertUserAddress): Promise<UserAddress> {
    const id = this.userAddressCounter++;
    const createdAt = new Date();
    const address: UserAddress = { id, ...insertAddress, createdAt };
    this.userAddresses.set(id, address);
    return address;
  }
  
  async updateUserAddress(id: number, data: Partial<UserAddress>): Promise<UserAddress | undefined> {
    const address = this.userAddresses.get(id);
    if (!address) return undefined;
    
    const updatedAddress = { ...address, ...data };
    this.userAddresses.set(id, updatedAddress);
    return updatedAddress;
  }
  
  async deleteUserAddress(id: number): Promise<boolean> {
    if (!this.userAddresses.has(id)) return false;
    return this.userAddresses.delete(id);
  }

  // Payment method operations
  async getUserPaymentMethods(userId: number): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values()).filter(
      (paymentMethod) => paymentMethod.userId === userId
    );
  }
  
  async getUserPaymentMethod(id: number): Promise<PaymentMethod | undefined> {
    return this.paymentMethods.get(id);
  }
  
  async createPaymentMethod(insertPaymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const id = this.paymentMethodCounter++;
    const createdAt = new Date();
    const paymentMethod: PaymentMethod = { id, ...insertPaymentMethod, createdAt };
    
    // If setting a payment method as default, make sure other payment methods for this user are not default
    if (paymentMethod.isDefault) {
      const userPaymentMethods = await this.getUserPaymentMethods(paymentMethod.userId);
      for (const method of userPaymentMethods) {
        if (method.isDefault) {
          method.isDefault = false;
          this.paymentMethods.set(method.id, method);
        }
      }
    }
    
    this.paymentMethods.set(id, paymentMethod);
    return paymentMethod;
  }
  
  async updatePaymentMethod(id: number, data: Partial<PaymentMethod>): Promise<PaymentMethod | undefined> {
    const paymentMethod = this.paymentMethods.get(id);
    if (!paymentMethod) return undefined;
    
    // If setting a payment method as default, make sure other payment methods for this user are not default
    if (data.isDefault === true) {
      const userPaymentMethods = await this.getUserPaymentMethods(paymentMethod.userId);
      for (const method of userPaymentMethods) {
        if (method.id !== id && method.isDefault) {
          method.isDefault = false;
          this.paymentMethods.set(method.id, method);
        }
      }
    }
    
    const updatedPaymentMethod = { ...paymentMethod, ...data };
    this.paymentMethods.set(id, updatedPaymentMethod);
    return updatedPaymentMethod;
  }
  
  async deletePaymentMethod(id: number): Promise<boolean> {
    if (!this.paymentMethods.has(id)) return false;
    return this.paymentMethods.delete(id);
  }

  // Product operations
  async getProducts(filter?: { 
    category?: string, 
    inStock?: boolean,
    color?: string,
    size?: string,
    gender?: string,
    sort?: string,
    page?: number,
    pageSize?: number
  }): Promise<{ products: Product[], total: number }> {
    let products = Array.from(this.products.values());
    
    if (filter) {
      if (filter.category) {
        products = products.filter(product => product.category === filter.category);
      }
      
      if (filter.inStock !== undefined) {
        products = products.filter(product => product.inStock === filter.inStock);
      }
      
      if (filter.color) {
        products = products.filter(product => 
          product.availableColors && 
          product.availableColors.includes(filter.color!)
        );
      }
      
      if (filter.size) {
        products = products.filter(product => 
          product.availableSizes && 
          product.availableSizes.includes(filter.size!)
        );
      }
      
      if (filter.gender) {
        products = products.filter(product => 
          product.gender === filter.gender
        );
      }
      
      // Handle sorting
      if (filter.sort) {
        switch (filter.sort) {
          case 'price_asc':
            products.sort((a, b) => {
              const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
              const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
              return priceA - priceB;
            });
            break;
          case 'price_desc':
            products.sort((a, b) => {
              const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
              const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
              return priceB - priceA;
            });
            break;
          case 'newest':
            products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          // Add other sort options as needed
          default:
            // No sorting or default sorting
            break;
        }
      }
    }
    
    // Get total count before pagination
    const total = products.length;
    
    // Apply pagination if specified
    if (filter && filter.page !== undefined && filter.pageSize !== undefined) {
      const startIndex = (filter.page - 1) * filter.pageSize;
      const endIndex = startIndex + filter.pageSize;
      products = products.slice(startIndex, endIndex);
    }
    
    return { products, total };
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productCounter++;
    const createdAt = new Date();
    const product: Product = {
      id,
      ...insertProduct,
      price: typeof insertProduct.price === 'string' ? parseFloat(insertProduct.price) : insertProduct.price,
      createdAt
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...data };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Order operations
  async getOrders(userId?: number): Promise<Order[]> {
    let orders = Array.from(this.orders.values());
    
    if (userId !== undefined) {
      orders = orders.filter(order => order.userId === userId);
    }
    
    return orders;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderWithItems(id: number): Promise<{ order: Order, items: OrderItem[] } | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const items = await this.getOrderItems(id);
    return { order, items };
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.orderCounter++;
    const createdAt = new Date();
    
    // Generate order number
    const orderNumber = `T${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Calculate estimated delivery date (4-6 days from now)
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);
    
    const order: Order = {
      id,
      ...insertOrder,
      orderNumber,
      status: "processing",
      subtotal: typeof insertOrder.subtotal === 'string' ? parseFloat(insertOrder.subtotal) : insertOrder.subtotal,
      shipping: typeof insertOrder.shipping === 'string' ? parseFloat(insertOrder.shipping) : insertOrder.shipping,
      tax: typeof insertOrder.tax === 'string' ? parseFloat(insertOrder.tax) : insertOrder.tax,
      total: typeof insertOrder.total === 'string' ? parseFloat(insertOrder.total) : insertOrder.total,
      estimatedDeliveryDate,
      createdAt
    };
    
    this.orders.set(id, order);
    
    // Create order items
    items.forEach(item => {
      const orderItemId = this.orderItemCounter++;
      const orderItem: OrderItem = {
        id: orderItemId,
        ...item,
        orderId: id,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      };
      this.orderItems.set(orderItemId, orderItem);
    });
    
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    
    // If status is delivered, set deliveredAt date
    if (status === "delivered") {
      updatedOrder.deliveredAt = new Date();
    }
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Initialize sample orders for the default user
  private async initializeSampleOrders() {
    try {
      // Make sure we have the default user
      const user = await this.getUserByUsername("testuser");
      if (!user) {
        console.error("Failed to create sample orders: default user not found");
        return;
      }
      
      // Get a reference to the default address
      const addresses = await this.getUserAddresses(user.id);
      if (addresses.length === 0) {
        console.error("Failed to create sample orders: no user address found");
        return;
      }
      
      const defaultAddress = addresses[0];
      
      // Get available products
      const result = await this.getProducts();
      const products = result.products;
      if (products.length < 3) {
        console.error("Failed to create sample orders: not enough products");
        return;
      }
      
      // Sample order 1 (Delivered - Past order)
      const orderItems1 = [
        {
          productId: products[0].id,
          name: products[0].name,
          color: products[0].availableColors ? products[0].availableColors[0] : "White",
          size: products[0].availableSizes ? products[0].availableSizes[1] : "M",
          price: typeof products[0].price === 'string' ? parseFloat(products[0].price) : products[0].price,
          quantity: 2,
          imageUrl: products[0].imageUrl
        },
        {
          productId: products[1].id,
          name: products[1].name,
          color: products[1].availableColors ? products[1].availableColors[0] : "Blue",
          size: products[1].availableSizes ? products[1].availableSizes[1] : "M",
          price: typeof products[1].price === 'string' ? parseFloat(products[1].price) : products[1].price,
          quantity: 1,
          imageUrl: products[1].imageUrl
        }
      ];
      
      const subtotal1 = orderItems1.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping1 = 5.99;
      const tax1 = subtotal1 * 0.08;
      const total1 = subtotal1 + shipping1 + tax1;
      
      // Create past order (delivered)
      const pastOrderDate = new Date();
      pastOrderDate.setMonth(pastOrderDate.getMonth() - 1);
      
      const order1 = await this.createOrder({
        userId: user.id,
        shippingAddressId: defaultAddress.id,
        shippingAddress: {
          firstName: defaultAddress.firstName,
          lastName: defaultAddress.lastName,
          address: defaultAddress.address,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          country: defaultAddress.country,
          phone: defaultAddress.phone
        },
        paymentMethod: "Credit Card",
        subtotal: subtotal1,
        shipping: shipping1,
        tax: tax1,
        total: total1
      }, orderItems1);
      
      // Add delivery date (2 days after order date)
      const deliveryDate1 = new Date(pastOrderDate);
      deliveryDate1.setDate(deliveryDate1.getDate() + 2);
      
      // Override created date and set to delivered
      this.orders.set(order1.id, { 
        ...order1, 
        createdAt: pastOrderDate,
        status: "delivered",
        deliveredAt: deliveryDate1
      });
      
      // Sample order 2 (Shipped - Current order)
      const orderItems2 = [
        {
          productId: products[2].id,
          name: products[2].name,
          color: products[2].availableColors ? products[2].availableColors[0] : "Blue",
          size: products[2].availableSizes ? products[2].availableSizes[2] : "L",
          price: typeof products[2].price === 'string' ? parseFloat(products[2].price) : products[2].price,
          quantity: 1,
          imageUrl: products[2].imageUrl
        }
      ];
      
      const subtotal2 = orderItems2.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping2 = 5.99;
      const tax2 = subtotal2 * 0.08;
      const total2 = subtotal2 + shipping2 + tax2;
      
      // Create current order (shipped)
      const recentOrderDate = new Date();
      recentOrderDate.setDate(recentOrderDate.getDate() - 3);
      
      const order2 = await this.createOrder({
        userId: user.id,
        shippingAddressId: defaultAddress.id,
        shippingAddress: {
          firstName: defaultAddress.firstName,
          lastName: defaultAddress.lastName,
          address: defaultAddress.address,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          country: defaultAddress.country,
          phone: defaultAddress.phone
        },
        paymentMethod: "Credit Card",
        subtotal: subtotal2,
        shipping: shipping2,
        tax: tax2,
        total: total2
      }, orderItems2);
      
      // Override created date and set to shipped
      this.orders.set(order2.id, { 
        ...order2, 
        createdAt: recentOrderDate,
        status: "shipped"
      });
      
      // Sample order 3 (Processing - Recent order)
      const orderItems3 = [
        {
          productId: products[3].id,
          name: products[3].name,
          color: products[3].availableColors ? products[3].availableColors[0] : "Black",
          size: products[3].availableSizes ? products[3].availableSizes[2] : "L",
          price: typeof products[3].price === 'string' ? parseFloat(products[3].price) : products[3].price,
          quantity: 1,
          imageUrl: products[3].imageUrl
        },
        {
          productId: products[4].id,
          name: products[4].name,
          color: products[4].availableColors ? products[4].availableColors[1] : "Gray",
          size: products[4].availableSizes ? products[4].availableSizes[2] : "L",
          price: typeof products[4].price === 'string' ? parseFloat(products[4].price) : products[4].price,
          quantity: 1,
          imageUrl: products[4].imageUrl
        }
      ];
      
      const subtotal3 = orderItems3.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping3 = 5.99;
      const tax3 = subtotal3 * 0.08;
      const total3 = subtotal3 + shipping3 + tax3;
      
      // Create very recent order (processing)
      const veryRecentOrderDate = new Date();
      veryRecentOrderDate.setHours(veryRecentOrderDate.getHours() - 6);
      
      const order3 = await this.createOrder({
        userId: user.id,
        shippingAddressId: defaultAddress.id,
        shippingAddress: {
          firstName: defaultAddress.firstName,
          lastName: defaultAddress.lastName,
          address: defaultAddress.address,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          country: defaultAddress.country,
          phone: defaultAddress.phone
        },
        paymentMethod: "PayPal",
        subtotal: subtotal3,
        shipping: shipping3,
        tax: tax3,
        total: total3
      }, orderItems3);
      
      // Override created date
      this.orders.set(order3.id, { 
        ...order3, 
        createdAt: veryRecentOrderDate
      });
      
      console.log("Created sample orders for the test user");
    } catch (error) {
      console.error("Error creating sample orders:", error);
    }
  }

  // Order items operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId,
    );
  }
}

export const storage = new MemStorage();
