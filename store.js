/**
 * KIM Vision & Time - LocalStorage Store & State Management
 */

const STORAGE_KEYS = {
  PRODUCTS: "kim_products_v7",
  ORDERS: "kim_orders_v7",
  CART: "kim_cart_v7",
  USER: "kim_current_user_v7",
  USERS_LIST: "kim_users_list_v7",
  MANAGER_SESSION: "kim_manager_session_v7"
};

const KimStore = {
  // Initialize Database with seed data if not present
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.resetToSeed();
    }
  },

  resetToSeed() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    const seedOrders = generateSeedOrders(INITIAL_PRODUCTS);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(seedOrders));
    
    // Initial state: NO LOGGED IN USER (ผู้ใช้ต้องสมัครสมาชิกเองเมื่อเข้าเว็บครั้งแรก)
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.MANAGER_SESSION);
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify([]));

    return { products: INITIAL_PRODUCTS, orders: seedOrders };
  },

  // --- PRODUCT API ---
  getProducts() {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent("kim:products-updated", { detail: products }));
  },

  updateProduct(updatedProduct) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      this.saveProducts(products);
      return products[index];
    }
    return null;
  },

  restockProduct(id, additionalStock) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      const added = parseInt(additionalStock, 10) || 0;
      products[index].stock = Math.max(0, (products[index].stock || 0) + added);
      this.saveProducts(products);
      return products[index];
    }
    return null;
  },

  addProduct(newProduct) {
    const products = this.getProducts();
    const id = `PROD-${String(products.length + 1).padStart(3, '0')}`;
    const product = {
      id: id,
      rating: 5.0,
      reviews: 0,
      isNew: true,
      tag: "NEW",
      cost: Math.round(newProduct.price * 0.45),
      ...newProduct
    };
    products.unshift(product);
    this.saveProducts(products);
    return product;
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
  },

  // --- ORDER API ---
  getOrders() {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  },

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id);
  },

  saveOrders(orders) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent("kim:orders-updated", { detail: orders }));
  },

  createOrder(orderData) {
    const orders = this.getOrders();
    const products = this.getProducts();
    const now = new Date();
    const orderId = `KM-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${orders.length + 1001}`;

    const newOrder = {
      id: orderId,
      invoiceNo: `INV-${orderId.replace("KM-", "")}`,
      date: now.toISOString(),
      status: "Completed",
      notes: "คำสั่งซื้อผ่านหน้าเว็บไซต์ออนไลน์",
      ...orderData
    };

    // Deduct inventory stock
    orderData.items.forEach(item => {
      const prodIndex = products.findIndex(p => p.id === item.productId);
      if (prodIndex !== -1) {
        products[prodIndex].stock = Math.max(0, (products[prodIndex].stock || 0) - item.quantity);
      }
    });

    this.saveProducts(products);
    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  },

  // --- ANALYTICS API (Profit & Loss with Green/Red for 7, 30, 60, 90, 120 Days) ---
  getSalesStats(periodDays = 30) {
    const orders = this.getOrders();
    const now = new Date();
    const cutoffTime = now.getTime() - (periodDays * 24 * 60 * 60 * 1000);

    const filteredOrders = orders.filter(o => new Date(o.date).getTime() >= cutoffTime);

    let totalRevenue = 0;
    let totalCost = 0;
    let totalItemsSold = 0;
    const dailyMap = {};

    for (let d = periodDays - 1; d >= 0; d--) {
      const dayDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
      const dateKey = dayDate.toISOString().split('T')[0];
      const thaiDayLabel = dayDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
      dailyMap[dateKey] = {
        date: dateKey,
        label: thaiDayLabel,
        revenue: 0,
        cost: 0,
        profit: 0,
        ordersCount: 0,
        itemsCount: 0
      };
    }

    filteredOrders.forEach(order => {
      const dateKey = order.date.split('T')[0];
      totalRevenue += (order.totalAmount || 0);

      let orderItemCost = 0;
      order.items.forEach(item => {
        const itemCost = (item.cost || (item.price * 0.45)) * item.quantity;
        orderItemCost += itemCost;
        totalCost += itemCost;
        totalItemsSold += item.quantity;
      });

      if (dailyMap[dateKey]) {
        dailyMap[dateKey].revenue += order.totalAmount;
        dailyMap[dateKey].cost += orderItemCost;
        dailyMap[dateKey].profit = dailyMap[dateKey].revenue - dailyMap[dateKey].cost;
        dailyMap[dateKey].ordersCount += 1;
        dailyMap[dateKey].itemsCount += order.items.reduce((s, i) => s + i.quantity, 0);
      }
    });

    const chartData = Object.values(dailyMap);
    const averageOrderValue = filteredOrders.length > 0 ? Math.round(totalRevenue / filteredOrders.length) : 0;
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

    return {
      periodDays,
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      totalOrders: filteredOrders.length,
      totalItemsSold,
      averageOrderValue,
      chartData,
      filteredOrders
    };
  },

  // Top 10 Best Sellers
  getTop10BestSellers(periodDays = 30) {
    const orders = this.getOrders();
    const products = this.getProducts();
    const now = new Date();
    const cutoffTime = now.getTime() - (periodDays * 24 * 60 * 60 * 1000);

    const filteredOrders = orders.filter(o => new Date(o.date).getTime() >= cutoffTime);
    const productStats = {};

    products.forEach(p => {
      productStats[p.id] = {
        id: p.id,
        name: p.name,
        category: p.category,
        categoryName: p.categoryName,
        price: p.price,
        cost: p.cost || Math.round(p.price * 0.45),
        currentStock: p.stock,
        unitsSold: 0,
        totalRevenue: 0,
        totalProfit: 0,
        sku: p.sku
      };
    });

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productStats[item.productId]) {
          productStats[item.productId] = {
            id: item.productId,
            name: item.productName,
            category: item.category || "tshirts",
            categoryName: item.categoryName || "เสื้อผ้า",
            price: item.price,
            cost: item.cost || Math.round(item.price * 0.45),
            currentStock: 0,
            unitsSold: 0,
            totalRevenue: 0,
            totalProfit: 0,
            sku: item.sku || ""
          };
        }
        const itemCost = (item.cost || (item.price * 0.45)) * item.quantity;
        const itemRevenue = item.price * item.quantity;
        productStats[item.productId].unitsSold += item.quantity;
        productStats[item.productId].totalRevenue += itemRevenue;
        productStats[item.productId].totalProfit += (itemRevenue - itemCost);
      });
    });

    const sorted = Object.values(productStats)
      .sort((a, b) => (b.unitsSold - a.unitsSold) || (b.totalRevenue - a.totalRevenue));

    const top10 = sorted.slice(0, 10);
    const maxUnits = top10.length > 0 && top10[0].unitsSold > 0 ? top10[0].unitsSold : 1;

    return top10.map((item, idx) => ({
      rank: idx + 1,
      ...item,
      percentageOfTop: Math.round((item.unitsSold / maxUnits) * 100)
    }));
  },

  // --- CART API ---
  getCart() {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  },

  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("kim:cart-updated", { detail: cart }));
  },

  addToCart(item) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(c => 
      c.productId === item.productId && 
      c.size === item.size && 
      c.color === item.color
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += (item.quantity || 1);
    } else {
      cart.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        categoryName: item.categoryName,
        quantity: item.quantity || 1,
        sku: item.sku
      });
    }

    this.saveCart(cart);
    return cart;
  },

  updateCartQuantity(index, quantity) {
    const cart = this.getCart();
    if (cart[index]) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
      this.saveCart(cart);
    }
    return cart;
  },

  removeFromCart(index) {
    const cart = this.getCart();
    cart.splice(index, 1);
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    this.saveCart([]);
  },

  // --- USER PROFILE & REGISTERED USERS ---
  getUsersList() {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    return raw ? JSON.parse(raw) : [];
  },

  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },

  registerCustomer(userData) {
    const users = this.getUsersList();
    const existingIndex = users.findIndex(u => u.phone === userData.phone || (userData.email && u.email === userData.email));
    
    const user = {
      id: `CUST-${Date.now()}`,
      isLoggedIn: true,
      joinedDate: new Date().toISOString(),
      ...userData
    };

    if (existingIndex > -1) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }

    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.removeItem(STORAGE_KEYS.MANAGER_SESSION); // Clear manager session if regular user
    window.dispatchEvent(new CustomEvent("kim:user-updated", { detail: user }));
    return user;
  },

  // UNIFIED AUTHENTICATION (รองรับทั้งลูกค้าระบบ และ รหัสแอดมินในช่องเดียว)
  authenticateUnified(identifier, password) {
    const cleanIdent = (identifier || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    // 1. Check Admin / Manager Code (รหัสสำหรับแอดมิน: 1234 หรือ admin / 1234)
    if (cleanIdent === "admin" || cleanPass === "1234" || cleanIdent === "1234" || cleanPass === "admin1234") {
      localStorage.setItem(STORAGE_KEYS.MANAGER_SESSION, "true");
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.dispatchEvent(new CustomEvent("kim:user-updated", { detail: { role: "manager" } }));
      return { success: true, role: "manager" };
    }

    // 2. Check Customer Registered Account
    const users = this.getUsersList();
    const found = users.find(u => 
      u.phone === identifier.trim() || 
      (u.email && u.email.toLowerCase() === cleanIdent) ||
      u.name.toLowerCase().includes(cleanIdent)
    );

    if (found) {
      found.isLoggedIn = true;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(found));
      localStorage.removeItem(STORAGE_KEYS.MANAGER_SESSION);
      window.dispatchEvent(new CustomEvent("kim:user-updated", { detail: found }));
      return { success: true, role: "customer", user: found };
    }

    // If not found in list but has values, allow auto guest login or prompt registration
    if (cleanIdent.length > 2) {
      const guestUser = {
        name: identifier.trim(),
        phone: identifier.includes("08") ? identifier.trim() : "08x-xxx-xxxx",
        email: identifier.includes("@") ? identifier.trim() : "",
        address: "",
        isLoggedIn: true
      };
      this.registerCustomer(guestUser);
      return { success: true, role: "customer", user: guestUser };
    }

    return { success: false, message: "ไม่พบข้อมูลบัญชี กรุณาสมัครสมาชิกใหม่ หรือใส่รหัสแอดมิน 1234" };
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.MANAGER_SESSION);
    window.dispatchEvent(new CustomEvent("kim:user-updated", { detail: null }));
  },

  logoutManager() {
    this.logout();
  },

  logoutUser() {
    this.logout();
  },

  isManagerLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.MANAGER_SESSION) === "true";
  },

  // --- EXCEL EXPORT (Using SheetJS) ---
  exportOrdersToExcel() {
    if (typeof XLSX === "undefined") {
      alert("SheetJS library is not loaded.");
      return;
    }

    const orders = this.getOrders();
    const rows = orders.map(o => {
      const itemsDetail = o.items.map(i => `${i.productName} (ไซส์ ${i.size}, สี ${i.color}) x${i.quantity}`).join("; ");
      const orderDate = new Date(o.date).toLocaleString('th-TH');
      return {
        "เลขที่คำสั่งซื้อ": o.id,
        "เลขที่ใบเสร็จ": o.invoiceNo || "-",
        "วันที่-เวลา": orderDate,
        "ชื่อลูกค้า": o.customer.name,
        "เบอร์โทรศัพท์": o.customer.phone,
        "อีเมล": o.customer.email,
        "ที่อยู่จัดส่ง": o.customer.address,
        "รายการสินค้า": itemsDetail,
        "ยอดรวมสินค้า (บาท)": o.subtotal,
        "ส่วนลด (บาท)": o.discount,
        "ค่าจัดส่ง (บาท)": o.shippingFee,
        "ภาษี VAT 7% (บาท)": o.vatAmount,
        "ยอดสุทธิ (บาท)": o.totalAmount,
        "ช่องทางชำระเงิน": o.paymentMethod,
        "สถานะ": o.status
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ประวัติคำสั่งซื้อ");

    const max_width = rows.reduce((w, r) => Math.max(w, 20), 10);
    worksheet["!cols"] = Object.keys(rows[0] || {}).map(() => ({ wch: max_width }));

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `KIM_Vision_Orders_${dateStr}.xlsx`);
  },

  exportSalesSummaryToExcel(periodDays = 30) {
    if (typeof XLSX === "undefined") return;

    const stats = this.getSalesStats(periodDays);
    const top10 = this.getTop10BestSellers(periodDays);

    const summaryRows = [
      { "หัวข้อ": "ช่วงเวลาสรุปยอดขาย", "ข้อมูล": `${periodDays} วันย้อนหลัง` },
      { "หัวข้อ": "ยอดขายรวมสุทธิ (บาท)", "ข้อมูล": stats.totalRevenue.toLocaleString() },
      { "หัวข้อ": "ต้นทุนสินค้ารวม (บาท)", "ข้อมูล": stats.totalCost.toLocaleString() },
      { "หัวข้อ": "กำไรสุทธิรวม (บาท)", "ข้อมูล": stats.totalProfit.toLocaleString() },
      { "หัวข้อ": "อัตรากำไรโดยเฉลี่ย (%)", "ข้อมูล": `${stats.profitMargin}%` },
      { "หัวข้อ": "จำนวนคำสั่งซื้อรวม (ออเดอร์)", "ข้อมูล": stats.totalOrders.toLocaleString() },
      { "หัวข้อ": "จำนวนสินค้าที่ขายได้ (ชิ้น)", "ข้อมูล": stats.totalItemsSold.toLocaleString() },
      { "หัวข้อ": "ยอดขายเฉลี่ยต่อบิล (AOV บาท)", "ข้อมูล": stats.averageOrderValue.toLocaleString() },
      { "หัวข้อ": "วันที่ออกรายงาน", "ข้อมูล": new Date().toLocaleString('th-TH') }
    ];

    const top10Rows = top10.map(t => ({
      "อันดับ": t.rank,
      "รหัสสินค้า (SKU)": t.sku,
      "ชื่อสินค้า": t.name,
      "หมวดหมู่": t.categoryName,
      "ราคาต่อหน่วย (บาท)": t.price,
      "จำนวนที่ขายได้ (ชิ้น)": t.unitsSold,
      "ยอดขายรวม (บาท)": t.totalRevenue,
      "กำไรรวม (บาท)": t.totalProfit,
      "คงเหลือในสต็อก (ชิ้น)": t.currentStock
    }));

    const dailyRows = stats.chartData.map(d => ({
      "วันที่": d.date,
      "วัน": d.label,
      "ยอดขาย (บาท)": d.revenue,
      "ต้นทุน (บาท)": d.cost,
      "กำไรสุทธิ (บาท)": d.profit,
      "จำนวนคำสั่งซื้อ": d.ordersCount,
      "จำนวนสินค้าที่ขาย (ชิ้น)": d.itemsCount
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryRows), "สรุปภาพรวม");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(top10Rows), "10 อันดับขายดีที่สุด");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dailyRows), "กำไร-ขาดทุนรายวัน");

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `KIM_Vision_Sales_Profit_${periodDays}Days_${dateStr}.xlsx`);
  },

  exportInventoryToExcel() {
    if (typeof XLSX === "undefined") return;

    const products = this.getProducts();
    const rows = products.map(p => ({
      "รหัสสินค้า": p.id,
      "SKU": p.sku,
      "ชื่อสินค้า": p.name,
      "หมวดหมู่": p.categoryName,
      "ราคาขาย (บาท)": p.price,
      "ต้นทุนสินค้า (บาท)": p.cost,
      "จำนวนคงเหลือ (ชิ้น)": p.stock,
      "สถานะสต็อก": p.stock === 0 ? "สินค้าหมด (Out of Stock)" : (p.stock <= 10 ? "สต็อกเหลือน้อย (Low Stock)" : "ปกติ (In Stock)"),
      "ไซส์ที่มี": (p.sizes || []).join(", "),
      "สีที่มี": (p.colorNames || []).join(", "),
      "คะแนนรีวิว": p.rating,
      "แท็กสินค้า": p.tag || "-"
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "รายการสินค้าและสต็อก");

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `KIM_Vision_Inventory_Report_${dateStr}.xlsx`);
  }
};

KimStore.init();
