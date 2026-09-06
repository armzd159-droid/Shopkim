/**
 * KIM Vision & Time - Customer Storefront & E-Commerce Controller
 * Categories: แว่นสายตา (10), แว่นกรองแสงสีฟ้า (10), นาฬิกาพรีเมียม (10)
 */

let currentCategory = "all";
let currentSort = "popular";
let activeProductForModal = null;
let selectedModalSize = "Standard";
let selectedModalColor = null;
let selectedModalQty = 1;

let appliedDiscountCode = "";
let appliedDiscountAmount = 0;

const CustomerApp = {
  init() {
    this.bindEvents();
    this.renderProducts();
    this.updateCartBadge();
    this.updateAuthUI();
  },

  bindEvents() {
    // Auth Modal Trigger
    document.getElementById("btn-auth-modal")?.addEventListener("click", () => {
      const isManager = KimStore.isManagerLoggedIn();
      const user = KimStore.getCurrentUser();

      if (isManager) {
        this.switchView("manager");
      } else if (user) {
        this.openUserProfileModal();
      } else {
        this.openAuthModal("login");
      }
    });

    // Search bar
    const searchInput = document.getElementById("store-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", () => this.renderProducts());
    }

    // Category Tabs (แว่นสายตา, แว่นกรองแสงสีฟ้า, นาฬิกา)
    document.querySelectorAll(".cat-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".cat-tab-btn").forEach(b => {
          b.classList.remove("active", "border-white", "text-white");
          b.classList.add("text-zinc-400", "border-transparent");
        });
        e.currentTarget.classList.add("active", "border-white", "text-white");
        e.currentTarget.classList.remove("text-zinc-400", "border-transparent");

        currentCategory = e.currentTarget.dataset.category;
        this.renderProducts();
      });
    });

    // Sort Select
    document.getElementById("sort-select")?.addEventListener("change", (e) => {
      currentSort = e.target.value;
      this.renderProducts();
    });

    // Cart Button & Drawer
    document.getElementById("btn-open-cart")?.addEventListener("click", () => {
      this.openCartDrawer();
    });
    document.getElementById("btn-close-cart")?.addEventListener("click", () => {
      this.closeCartDrawer();
    });

    // Apply Coupon
    document.getElementById("btn-apply-coupon")?.addEventListener("click", () => {
      this.applyCoupon();
    });

    // Checkout Button in Cart
    document.getElementById("btn-go-to-checkout")?.addEventListener("click", () => {
      this.openCheckoutModal();
    });

    // Listen to store updates
    window.addEventListener("kim:products-updated", () => this.renderProducts());
    window.addEventListener("kim:cart-updated", () => {
      this.updateCartBadge();
      this.renderCartItems();
    });
    window.addEventListener("kim:user-updated", () => this.updateAuthUI());
  },

  switchView(viewName) {
    const customerView = document.getElementById("customer-view");
    const managerView = document.getElementById("manager-view");

    if (viewName === "manager") {
      if (!KimStore.isManagerLoggedIn()) {
        this.openAuthModal("login");
        return;
      }
      customerView.classList.add("hidden");
      managerView.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      ManagerApp.init();
    } else {
      managerView.classList.add("hidden");
      customerView.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.renderProducts();
    }
  },

  // --- UNIFIED AUTH MODAL (เข้าสู่ระบบ & สมัครสมาชิก) ---
  openAuthModal(defaultTab = "login") {
    const modal = document.getElementById("auth-modal");
    if (!modal) return;

    this.switchAuthTab(defaultTab);
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  },

  closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  },

  switchAuthTab(tab) {
    const tabLogin = document.getElementById("auth-tab-login");
    const tabRegister = document.getElementById("auth-tab-register");
    const formLogin = document.getElementById("auth-form-login");
    const formRegister = document.getElementById("auth-form-register");

    if (tab === "register") {
      tabRegister?.classList.add("text-white", "bg-zinc-800", "font-semibold");
      tabRegister?.classList.remove("text-zinc-400");
      tabLogin?.classList.remove("text-white", "bg-zinc-800", "font-semibold");
      tabLogin?.classList.add("text-zinc-400");

      formRegister?.classList.remove("hidden");
      formLogin?.classList.add("hidden");
    } else {
      tabLogin?.classList.add("text-white", "bg-zinc-800", "font-semibold");
      tabLogin?.classList.remove("text-zinc-400");
      tabRegister?.classList.remove("text-white", "bg-zinc-800", "font-semibold");
      tabRegister?.classList.add("text-zinc-400");

      formLogin?.classList.remove("hidden");
      formRegister?.classList.add("hidden");
    }
  },

  submitUnifiedLogin() {
    const identifier = document.getElementById("login-identifier")?.value.trim();
    const password = document.getElementById("login-password")?.value.trim();

    if (!identifier && !password) {
      alert("กรุณากรอกเบอร์โทรศัพท์ อีเมล หรือรหัสแอดมิน");
      return;
    }

    const result = KimStore.authenticateUnified(identifier, password);

    if (result.success) {
      this.closeAuthModal();
      if (result.role === "manager") {
        this.switchView("manager");
        ManagerApp.showNotification("👑 ยินดีต้อนรับผู้จัดการร้าน (Admin Authenticated)");
      } else {
        ManagerApp.showNotification(`เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ ${result.user.name}`);
      }
    } else {
      alert(result.message || "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง");
    }
  },

  submitCustomerRegister() {
    const name = document.getElementById("reg-name")?.value.trim();
    const phone = document.getElementById("reg-phone")?.value.trim();
    const email = document.getElementById("reg-email")?.value.trim();
    const address = document.getElementById("reg-address")?.value.trim();
    const province = document.getElementById("reg-province")?.value.trim();
    const postal = document.getElementById("reg-postal")?.value.trim();

    if (!name || !phone || !address || !postal) {
      alert("กรุณากรอกข้อมูลชื่อ เบอร์โทร และที่อยู่จัดส่งให้ครบถ้วน");
      return;
    }

    const newUser = {
      name,
      phone,
      email: email || "customer@kimvision.com",
      address,
      province,
      postalCode: postal
    };

    KimStore.registerCustomer(newUser);
    this.closeAuthModal();
    ManagerApp.showNotification(`สมัครสมาชิกสำเร็จ! ยินดีต้อนรับ ${name}`);
  },

  openUserProfileModal() {
    const user = KimStore.getCurrentUser();
    if (!user) {
      this.openAuthModal("login");
      return;
    }

    const modal = document.getElementById("user-profile-modal");
    if (!modal) return;

    document.getElementById("profile-display-name").innerText = user.name;
    document.getElementById("profile-display-phone").innerText = user.phone;
    document.getElementById("profile-display-email").innerText = user.email || "-";
    document.getElementById("profile-display-address").innerText = `${user.address} ${user.province || ''} ${user.postalCode || ''}`.trim();

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  },

  closeUserProfileModal() {
    const modal = document.getElementById("user-profile-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  },

  logoutUser() {
    KimStore.logout();
    this.closeUserProfileModal();
    ManagerApp.showNotification("ออกจากระบบเรียบร้อยแล้ว");
  },

  updateAuthUI() {
    const user = KimStore.getCurrentUser();
    const isManager = KimStore.isManagerLoggedIn();
    const btnAuth = document.getElementById("btn-auth-modal");

    if (btnAuth) {
      if (isManager) {
        btnAuth.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <i data-lucide="shield-check" class="w-4 h-4 text-amber-400"></i>
            <span class="text-xs font-semibold text-amber-400">แดชบอร์ดผู้จัดการ</span>
          </div>
        `;
      } else if (user && user.isLoggedIn) {
        const shortName = user.name.split(" ")[0];
        btnAuth.innerHTML = `
          <div class="flex items-center gap-2">
            <i data-lucide="user-check" class="w-4 h-4 text-emerald-400"></i>
            <span class="text-xs font-semibold text-white truncate max-w-[120px]">${shortName}</span>
          </div>
        `;
      } else {
        btnAuth.innerHTML = `
          <div class="flex items-center gap-2">
            <i data-lucide="user" class="w-4 h-4 text-zinc-300"></i>
            <span class="text-xs font-semibold text-zinc-200">เข้าสู่ระบบ / สมัครสมาชิก</span>
          </div>
        `;
      }
      if (window.lucide) lucide.createIcons();
    }
  },

  // --- PRODUCT LIST RENDERING (GLASSES & WATCHES) ---
  renderProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    let products = KimStore.getProducts();
    const query = (document.getElementById("store-search-input")?.value || "").toLowerCase().trim();

    // Category Filter
    if (currentCategory !== "all") {
      products = products.filter(p => p.category === currentCategory);
    }

    // Search query filter
    if (query) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (currentSort === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (currentSort === "newest") {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      // Default: Popular / Rating
      products.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    // Update result count
    const countEl = document.getElementById("product-count-label");
    if (countEl) countEl.innerText = `${products.length} รายการ`;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <i data-lucide="package-search" class="w-12 h-12 mx-auto text-zinc-600 mb-3"></i>
          <p class="text-zinc-400 font-medium text-lg">ไม่พบสินค้าที่คุณค้นหา</p>
          <p class="text-zinc-600 text-sm mt-1">ลองค้นหาด้วยคำอื่น หรือเลือกดูหมวดหมู่อื่นดูนะครับ</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    grid.innerHTML = products.map(product => {
      let iconSilhouette = "glasses";
      if (product.category === "bluelight_glasses") iconSilhouette = "shield-check";
      if (product.category === "watches") iconSilhouette = "watch";

      const colorDots = (product.colors || ["#000000"]).map(c => `
        <span class="w-3.5 h-3.5 rounded-full border border-zinc-700 inline-block" style="background-color: ${c};"></span>
      `).join("");

      const isOutOfStock = product.stock === 0;

      return `
        <div class="card-luxury rounded-xl overflow-hidden group flex flex-col justify-between cursor-pointer" onclick="CustomerApp.openProductModal('${product.id}')">
          <!-- Card Image & Badge -->
          <div class="product-silhouette aspect-[4/5] flex flex-col justify-between p-4 relative">
            <div class="flex justify-between items-start z-10">
              ${product.tag ? `
                <span class="badge-tag rounded bg-white/10 text-white border border-white/20 backdrop-blur-md">
                  ${product.tag}
                </span>
              ` : '<span></span>'}
              
              ${isOutOfStock ? `
                <span class="badge-tag rounded bg-red-900/80 text-red-200 border border-red-500/30">
                  สินค้าหมด
                </span>
              ` : (product.stock <= 10 ? `
                <span class="badge-tag rounded bg-amber-900/60 text-amber-300 border border-amber-500/30">
                  เหลือ ${product.stock} ชิ้น
                </span>
              ` : '')}
            </div>

            <!-- Product Image / Silhouette Graphic -->
            <div class="my-auto flex flex-col items-center justify-center text-zinc-500 group-hover:text-white transition-all duration-300 transform group-hover:scale-105 w-full h-36 relative overflow-hidden">
              ${product.image ? `
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain p-2 filter drop-shadow-lg" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-20 h-20 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shadow-inner\\'><i data-lucide=\\'${iconSilhouette}\\' class=\\'w-10 h-10 opacity-70 group-hover:opacity-100 transition\\'></i></div>'; if(window.lucide) lucide.createIcons();">
              ` : `
                <div class="w-20 h-20 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shadow-inner">
                  <i data-lucide="${iconSilhouette}" class="w-10 h-10 opacity-70 group-hover:opacity-100 transition"></i>
                </div>
              `}
              <span class="text-[11px] font-mono tracking-widest text-zinc-600 mt-2 uppercase">${product.sku}</span>
            </div>

            <!-- Quick Add Button on Hover -->
            <div class="z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              <button onclick="event.stopPropagation(); CustomerApp.quickAddToCart('${product.id}')" ${isOutOfStock ? 'disabled' : ''} class="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-wider uppercase rounded shadow-lg transition flex items-center justify-center gap-2 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}">
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
                ${isOutOfStock ? 'สินค้าหมด' : 'เลือกซื้อด่วน'}
              </button>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-4 flex flex-col flex-grow justify-between">
            <div>
              <div class="flex items-center gap-1.5 mb-2">
                ${colorDots}
              </div>
              <p class="text-xs text-zinc-500 font-mono">${product.categoryName}</p>
              <h3 class="text-sm font-semibold text-white mt-1 group-hover:text-zinc-200 transition line-clamp-1">${product.name}</h3>
            </div>

            <div class="mt-3 pt-3 border-t border-zinc-800/80 flex items-baseline justify-between">
              <div>
                <span class="text-base font-bold text-white tracking-tight">฿${product.price.toLocaleString()}</span>
              </div>
              <div class="flex items-center text-xs text-zinc-400 gap-1">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
                <span>${product.rating}</span>
                <span class="text-zinc-600">(${product.reviews})</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    if (window.lucide) lucide.createIcons();
  },

  // --- PRODUCT DETAIL MODAL ---
  openProductModal(productId) {
    const product = KimStore.getProductById(productId);
    if (!product) return;

    activeProductForModal = product;
    selectedModalSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : "Standard";
    selectedModalColor = (product.colorNames && product.colorNames.length > 0) ? product.colorNames[0] : "Pitch Black";
    selectedModalQty = 1;

    const modal = document.getElementById("product-detail-modal");
    if (!modal) return;

    document.getElementById("modal-prod-name").innerText = product.name;
    document.getElementById("modal-prod-sku").innerText = `SKU: ${product.sku}`;
    document.getElementById("modal-prod-category").innerText = product.categoryName;
    document.getElementById("modal-prod-price").innerText = `฿${product.price.toLocaleString()}`;
    document.getElementById("modal-prod-desc").innerText = product.description;
    document.getElementById("modal-prod-rating").innerText = `${product.rating} (${product.reviews} รีวิว)`;
    document.getElementById("modal-qty-input").value = 1;

    // Icon / Image in modal
    const modalImageContainer = document.getElementById("modal-image-preview-container");
    if (modalImageContainer) {
      let icon = "glasses";
      if (product.category === "bluelight_glasses") icon = "shield-check";
      if (product.category === "watches") icon = "watch";

      if (product.image) {
        modalImageContainer.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="max-h-44 w-auto object-contain mx-auto filter drop-shadow-xl p-2" onerror="this.onerror=null; this.parentElement.innerHTML='<i data-lucide=\\'${icon}\\' class=\\'w-24 h-24 text-zinc-500 mx-auto\\'></i>'; if(window.lucide) lucide.createIcons();">
        `;
      } else {
        modalImageContainer.innerHTML = `
          <i data-lucide="${icon}" class="w-24 h-24 text-zinc-500 mx-auto"></i>
        `;
      }
    }

    const stockBadge = document.getElementById("modal-prod-stock");
    if (product.stock === 0) {
      stockBadge.innerHTML = `<span class="px-2.5 py-1 bg-red-950/80 text-red-300 border border-red-500/30 rounded text-xs">สินค้าหมดชั่วคราว</span>`;
    } else if (product.stock <= 10) {
      stockBadge.innerHTML = `<span class="px-2.5 py-1 bg-amber-950/80 text-amber-300 border border-amber-500/30 rounded text-xs">สต็อกเหลือน้อย (${product.stock} ชิ้น)</span>`;
    } else {
      stockBadge.innerHTML = `<span class="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 rounded text-xs">มีสินค้าในสต็อก (${product.stock} ชิ้น)</span>`;
    }

    // Render Sizes / Dimensions / Dial
    const sizesContainer = document.getElementById("modal-sizes-container");
    const sizeLabelEl = document.getElementById("modal-size-label");
    if (sizeLabelEl) {
      sizeLabelEl.innerText = product.category === "watches" ? "ขนาดหน้าปัด / สายนาฬิกา:" : "ขนาดกรอบแว่น (มม.):";
    }

    sizesContainer.innerHTML = (product.sizes || ["Standard"]).map((s, idx) => `
      <button type="button" onclick="CustomerApp.selectModalSize('${s}')" class="size-badge ${idx === 0 ? 'active' : ''} px-3.5 py-2 rounded-lg text-xs font-medium">
        ${s}
      </button>
    `).join("");

    // Render Colors
    const colorsContainer = document.getElementById("modal-colors-container");
    colorsContainer.innerHTML = (product.colors || ["#000000"]).map((c, idx) => {
      const colorName = (product.colorNames && product.colorNames[idx]) ? product.colorNames[idx] : "Black";
      return `
        <button type="button" onclick="CustomerApp.selectModalColor('${colorName}', this)" title="${colorName}" class="color-dot ${idx === 0 ? 'active' : ''}" style="background-color: ${c};">
        </button>
      `;
    }).join("");

    const colorNameEl = document.getElementById("modal-selected-color-name");
    if (colorNameEl) colorNameEl.innerText = selectedModalColor;

    // Enable/Disable Add to cart if out of stock
    const addBtn = document.getElementById("btn-modal-add-cart");
    if (addBtn) {
      if (product.stock === 0) {
        addBtn.disabled = true;
        addBtn.innerText = "สินค้าหมด";
        addBtn.classList.add("opacity-50", "cursor-not-allowed");
      } else {
        addBtn.disabled = false;
        addBtn.innerHTML = `<i data-lucide="shopping-bag" class="w-4 h-4 mr-2"></i> เพิ่มลงตะกร้าสินค้า`;
        addBtn.classList.remove("opacity-50", "cursor-not-allowed");
      }
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    if (window.lucide) lucide.createIcons();
  },

  closeProductModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  },

  selectModalSize(size) {
    selectedModalSize = size;
    document.querySelectorAll("#modal-sizes-container .size-badge").forEach(btn => {
      if (btn.innerText.trim() === size) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  },

  selectModalColor(colorName, el) {
    selectedModalColor = colorName;
    document.querySelectorAll("#modal-colors-container .color-dot").forEach(d => d.classList.remove("active"));
    el.classList.add("active");
    const nameEl = document.getElementById("modal-selected-color-name");
    if (nameEl) nameEl.innerText = colorName;
  },

  changeModalQty(delta) {
    if (!activeProductForModal) return;
    const input = document.getElementById("modal-qty-input");
    let current = parseInt(input.value, 10) || 1;
    let next = current + delta;
    if (next < 1) next = 1;
    if (next > activeProductForModal.stock) next = activeProductForModal.stock;
    input.value = next;
    selectedModalQty = next;
  },

  addCurrentModalToCart() {
    if (!activeProductForModal || activeProductForModal.stock === 0) return;

    KimStore.addToCart({
      productId: activeProductForModal.id,
      name: activeProductForModal.name,
      price: activeProductForModal.price,
      size: selectedModalSize,
      color: selectedModalColor,
      categoryName: activeProductForModal.categoryName,
      quantity: parseInt(document.getElementById("modal-qty-input").value, 10) || 1,
      sku: activeProductForModal.sku
    });

    this.closeProductModal();
    this.openCartDrawer();
    ManagerApp.showNotification(`เพิ่ม ${activeProductForModal.name} ลงตะกร้าแล้ว`);
  },

  quickAddToCart(productId) {
    const prod = KimStore.getProductById(productId);
    if (!prod || prod.stock === 0) return;

    KimStore.addToCart({
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      size: (prod.sizes && prod.sizes.length > 0) ? prod.sizes[0] : "Standard",
      color: (prod.colorNames && prod.colorNames.length > 0) ? prod.colorNames[0] : "Pitch Black",
      categoryName: prod.categoryName,
      quantity: 1,
      sku: prod.sku
    });

    this.openCartDrawer();
    ManagerApp.showNotification(`เพิ่ม ${prod.name} ลงตะกร้าแล้ว`);
  },

  // --- CART DRAWER & CALCULATIONS ---
  updateCartBadge() {
    const cart = KimStore.getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cart-badge-count");
    if (badge) {
      badge.innerText = count;
      if (count > 0) {
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    }
  },

  openCartDrawer() {
    this.renderCartItems();
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (drawer && overlay) {
      drawer.classList.remove("translate-x-full");
      overlay.classList.remove("hidden");
    }
  },

  closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (drawer && overlay) {
      drawer.classList.add("translate-x-full");
      overlay.classList.add("hidden");
    }
  },

  renderCartItems() {
    const cart = KimStore.getCart();
    const container = document.getElementById("cart-items-container");
    const emptyState = document.getElementById("cart-empty-state");
    const footer = document.getElementById("cart-footer");

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = "";
      emptyState?.classList.remove("hidden");
      footer?.classList.add("hidden");
      return;
    }

    emptyState?.classList.add("hidden");
    footer?.classList.remove("hidden");

    let subtotal = 0;

    container.innerHTML = cart.map((item, idx) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      let itemIcon = "glasses";
      if (item.categoryName && item.categoryName.includes("นาฬิกา")) itemIcon = "watch";

      return `
        <div class="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 flex gap-3.5 items-start">
          <div class="w-16 h-20 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 text-zinc-600 flex-shrink-0">
            <i data-lucide="${itemIcon}" class="w-7 h-7"></i>
          </div>

          <div class="flex-grow min-w-0">
            <div class="flex justify-between items-start">
              <h4 class="text-sm font-semibold text-white truncate pr-2">${item.name}</h4>
              <button onclick="CustomerApp.removeFromCart(${idx})" class="text-zinc-500 hover:text-red-400 transition p-1">
                <i data-lucide="x" class="w-4 h-4"></i>
              </button>
            </div>

            <div class="text-xs text-zinc-400 mt-0.5">
              <span>รุ่น/ขนาด: <strong class="text-zinc-200">${item.size}</strong></span> · 
              <span>สี: <strong class="text-zinc-200">${item.color}</strong></span>
            </div>

            <div class="flex justify-between items-center mt-3 pt-2 border-t border-zinc-800/60">
              <!-- Qty Stepper -->
              <div class="flex items-center border border-zinc-700 rounded-lg bg-zinc-950">
                <button onclick="CustomerApp.updateItemQty(${idx}, ${item.quantity - 1})" class="px-2.5 py-1 text-zinc-400 hover:text-white text-xs">-</button>
                <span class="px-2 text-xs font-semibold text-white">${item.quantity}</span>
                <button onclick="CustomerApp.updateItemQty(${idx}, ${item.quantity + 1})" class="px-2.5 py-1 text-zinc-400 hover:text-white text-xs">+</button>
              </div>

              <div class="font-bold text-white text-sm">฿${itemTotal.toLocaleString()}</div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Calculate Summary
    const freeShippingTarget = 2000;
    const shipping = subtotal >= freeShippingTarget || subtotal === 0 ? 0 : 60;
    const discount = appliedDiscountAmount;
    const grandTotal = Math.max(0, subtotal + shipping - discount);

    // Free Shipping Progress
    const progressPercent = Math.min(100, Math.round((subtotal / freeShippingTarget) * 100));
    const shippingProgressEl = document.getElementById("cart-free-shipping-progress");
    const shippingTextEl = document.getElementById("cart-free-shipping-text");
    if (shippingProgressEl) shippingProgressEl.style.width = `${progressPercent}%`;
    if (shippingTextEl) {
      if (subtotal >= freeShippingTarget) {
        shippingTextEl.innerHTML = `<span class="text-emerald-400 font-semibold">🎉 ยินดีด้วย! คุณได้รับสิทธิ์จัดส่งฟรี</span>`;
      } else {
        const remaining = freeShippingTarget - subtotal;
        shippingTextEl.innerText = `ซื้อเพิ่มอีก ฿${remaining.toLocaleString()} เพื่อรับสิทธิ์ส่งฟรี!`;
      }
    }

    document.getElementById("cart-subtotal").innerText = `฿${subtotal.toLocaleString()}`;
    document.getElementById("cart-shipping").innerText = shipping === 0 ? "ส่งฟรี" : `฿${shipping.toLocaleString()}`;
    document.getElementById("cart-discount").innerText = discount > 0 ? `-฿${discount.toLocaleString()}` : "฿0";
    document.getElementById("cart-grand-total").innerText = `฿${grandTotal.toLocaleString()}`;

    if (window.lucide) lucide.createIcons();
  },

  updateItemQty(index, qty) {
    KimStore.updateCartQuantity(index, qty);
  },

  removeFromCart(index) {
    KimStore.removeFromCart(index);
  },

  applyCoupon() {
    const code = (document.getElementById("coupon-input")?.value || "").toUpperCase().trim();
    const cart = KimStore.getCart();
    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

    if (!code) {
      alert("กรุณากรอกโค้ดส่วนลด");
      return;
    }

    if (code === "KIMVIP10") {
      appliedDiscountCode = code;
      appliedDiscountAmount = Math.round(subtotal * 0.10);
      ManagerApp.showNotification("ใช้โค้ด KIMVIP10 ลด 10% สำเร็จ!");
    } else if (code === "WELCOME") {
      appliedDiscountCode = code;
      appliedDiscountAmount = 200;
      ManagerApp.showNotification("ใช้โค้ด WELCOME ลด 200 บาท สำเร็จ!");
    } else {
      alert("โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุ (ลองใช้ KIMVIP10 หรือ WELCOME)");
      return;
    }

    this.renderCartItems();
  },

  // --- CHECKOUT & ORDER COMPLETION ---
  openCheckoutModal() {
    const cart = KimStore.getCart();
    if (cart.length === 0) {
      alert("ไม่มีสินค้าในตะกร้า");
      return;
    }

    this.closeCartDrawer();
    this.loadUserProfile();

    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const shipping = subtotal >= 2000 ? 0 : 60;
    const discount = appliedDiscountAmount;
    const grandTotal = Math.max(0, subtotal + shipping - discount);

    document.getElementById("checkout-total-display").innerText = `฿${grandTotal.toLocaleString()}`;

    const modal = document.getElementById("checkout-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
  },

  closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  },

  loadUserProfile() {
    const user = KimStore.getCurrentUser();
    if (!user) {
      if (document.getElementById("checkout-name")) document.getElementById("checkout-name").value = "";
      if (document.getElementById("checkout-phone")) document.getElementById("checkout-phone").value = "";
      if (document.getElementById("checkout-email")) document.getElementById("checkout-email").value = "";
      if (document.getElementById("checkout-address")) document.getElementById("checkout-address").value = "";
      if (document.getElementById("checkout-province")) document.getElementById("checkout-province").value = "";
      if (document.getElementById("checkout-postal")) document.getElementById("checkout-postal").value = "";
      return;
    }

    if (document.getElementById("checkout-name")) document.getElementById("checkout-name").value = user.name || "";
    if (document.getElementById("checkout-phone")) document.getElementById("checkout-phone").value = user.phone || "";
    if (document.getElementById("checkout-email")) document.getElementById("checkout-email").value = user.email || "";
    if (document.getElementById("checkout-address")) document.getElementById("checkout-address").value = user.address || "";
    if (document.getElementById("checkout-province")) document.getElementById("checkout-province").value = user.province || "";
    if (document.getElementById("checkout-postal")) document.getElementById("checkout-postal").value = user.postalCode || "";
  },

  submitCheckout() {
    const name = document.getElementById("checkout-name")?.value.trim();
    const phone = document.getElementById("checkout-phone")?.value.trim();
    const email = document.getElementById("checkout-email")?.value.trim();
    const address = document.getElementById("checkout-address")?.value.trim();
    const province = document.getElementById("checkout-province")?.value.trim();
    const postal = document.getElementById("checkout-postal")?.value.trim();

    if (!name || !phone || !address || !postal) {
      alert("กรุณากรอกชื่อ, เบอร์โทรศัพท์ และที่อยู่จัดส่งให้ครบถ้วน");
      return;
    }

    KimStore.registerCustomer({
      name, phone, email, address, province, postalCode: postal
    });

    const paymentMethodEl = document.querySelector("input[name='payment-method']:checked");
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : "PromptPay QR";

    const cart = KimStore.getCart();
    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const shipping = subtotal >= 2000 ? 0 : 60;
    const discount = appliedDiscountAmount;
    const grandTotal = Math.max(0, subtotal + shipping - discount);
    const vatAmount = Math.round(grandTotal * 0.07);

    const orderPayload = {
      customer: {
        name,
        phone,
        email: email || "customer@kimvision.com",
        address: `${address} ${province} ${postal}`.trim()
      },
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.name,
        sku: item.sku || "KV-PROD",
        categoryName: item.categoryName || "แว่นตา & นาฬิกา",
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        itemTotal: item.price * item.quantity
      })),
      subtotal,
      discount,
      shippingFee: shipping,
      vatAmount,
      totalAmount: grandTotal,
      paymentMethod
    };

    const newOrder = KimStore.createOrder(orderPayload);
    KimStore.clearCart();
    appliedDiscountAmount = 0;
    appliedDiscountCode = "";

    this.closeCheckoutModal();
    ManagerApp.viewOrderInvoice(newOrder.id);
    ManagerApp.showNotification(`สั่งซื้อสำเร็จ! ออกใบเสร็จ ${newOrder.invoiceNo}`);
  },

  // Open Eyewear & Watch Size Guide Modal
  openSizeGuideModal() {
    const modal = document.getElementById("size-guide-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
  },

  closeSizeGuideModal() {
    const modal = document.getElementById("size-guide-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  }
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  CustomerApp.init();
});
