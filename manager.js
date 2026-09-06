/**
 * KIM Vision & Time - Manager Dashboard & Analytics Controller
 */

let salesChartInstance = null;
let currentPeriodDays = 30;

const ManagerApp = {
  init() {
    this.bindEvents();
    this.renderDashboard();
    this.renderInventoryTable();
    this.renderOrdersTable();
  },

  bindEvents() {
    // Period filter buttons (7, 30, 60, 90, 120 days)
    document.querySelectorAll(".period-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".period-btn").forEach(b => {
          b.classList.remove("bg-white", "text-black", "font-semibold");
          b.classList.add("text-zinc-400", "hover:text-white");
        });
        e.currentTarget.classList.add("bg-white", "text-black", "font-semibold");
        e.currentTarget.classList.remove("text-zinc-400", "hover:text-white");

        currentPeriodDays = parseInt(e.currentTarget.dataset.period, 10);
        this.renderDashboard();
      });
    });

    // Listen to database updates
    window.addEventListener("kim:products-updated", () => {
      this.renderInventoryTable();
      this.renderDashboard();
    });

    window.addEventListener("kim:orders-updated", () => {
      this.renderOrdersTable();
      this.renderDashboard();
    });

    // Inventory search & category filter
    const invSearch = document.getElementById("inv-search-input");
    if (invSearch) {
      invSearch.addEventListener("input", () => this.renderInventoryTable());
    }

    const invCat = document.getElementById("inv-category-filter");
    if (invCat) {
      invCat.addEventListener("change", () => this.renderInventoryTable());
    }

    const invStockFilter = document.getElementById("inv-stock-filter");
    if (invStockFilter) {
      invStockFilter.addEventListener("change", () => this.renderInventoryTable());
    }

    // Orders search & status filter
    const orderSearch = document.getElementById("order-search-input");
    if (orderSearch) {
      orderSearch.addEventListener("input", () => this.renderOrdersTable());
    }

    const orderStatusFilter = document.getElementById("order-status-filter");
    if (orderStatusFilter) {
      orderStatusFilter.addEventListener("change", () => this.renderOrdersTable());
    }
  },

  renderDashboard() {
    const stats = KimStore.getSalesStats(currentPeriodDays);
    const top10 = KimStore.getTop10BestSellers(currentPeriodDays);
    const products = KimStore.getProducts();

    // 1. Update KPI Cards (Revenue, Profit in Green, Cost in Red, Orders)
    const elRevenue = document.getElementById("kpi-total-revenue");
    if (elRevenue) elRevenue.innerText = `฿${stats.totalRevenue.toLocaleString()}`;

    const elProfit = document.getElementById("kpi-total-profit");
    if (elProfit) elProfit.innerText = `฿${stats.totalProfit.toLocaleString()}`;

    const elCost = document.getElementById("kpi-total-cost");
    if (elCost) elCost.innerText = `฿${stats.totalCost.toLocaleString()}`;

    const elMargin = document.getElementById("kpi-profit-margin");
    if (elMargin) elMargin.innerText = `${stats.profitMargin}%`;

    const elOrders = document.getElementById("kpi-total-orders");
    if (elOrders) elOrders.innerText = `${stats.totalOrders.toLocaleString()} บิล`;

    const elAOV = document.getElementById("kpi-avg-order");
    if (elAOV) elAOV.innerText = `฿${stats.averageOrderValue.toLocaleString()}`;

    const lowStockCount = products.filter(p => p.stock <= 10).length;
    const elLowStock = document.getElementById("kpi-low-stock");
    if (elLowStock) {
      elLowStock.innerText = `${lowStockCount} รายการ`;
      if (lowStockCount > 0) {
        elLowStock.classList.add("text-amber-400");
      }
    }

    const elPeriodLabel = document.getElementById("dashboard-period-label");
    if (elPeriodLabel) elPeriodLabel.innerText = `ข้อมูลย้อนหลัง ${currentPeriodDays} วัน`;

    // 2. Render Green & Red Profit/Loss Chart
    this.renderSalesChart(stats.chartData);

    // 3. Render Top 10 Best Sellers
    this.renderTop10Table(top10);
  },

  renderSalesChart(chartData) {
    const ctx = document.getElementById("salesChart");
    if (!ctx) return;

    const labels = chartData.map(d => d.label);
    const revenues = chartData.map(d => d.revenue);
    const costs = chartData.map(d => d.cost);
    const profits = chartData.map(d => d.profit);

    if (salesChartInstance) {
      salesChartInstance.destroy();
    }

    const chartCtx = ctx.getContext('2d');
    
    // Green Gradient for Profit
    const greenGradient = chartCtx.createLinearGradient(0, 0, 0, 300);
    greenGradient.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
    greenGradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

    // Red Gradient for Cost
    const redGradient = chartCtx.createLinearGradient(0, 0, 0, 300);
    redGradient.addColorStop(0, 'rgba(239, 68, 68, 0.40)');
    redGradient.addColorStop(1, 'rgba(239, 68, 68, 0.02)');

    salesChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '🟢 กำไรสุทธิ (Profit)',
            data: profits,
            borderColor: '#10b981',
            backgroundColor: greenGradient,
            borderWidth: 2.5,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#09090b',
            pointRadius: currentPeriodDays <= 30 ? 4 : 2,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: '🔴 ต้นทุนสินค้า (Cost)',
            data: costs,
            borderColor: '#ef4444',
            backgroundColor: redGradient,
            borderWidth: 2,
            pointBackgroundColor: '#ef4444',
            pointBorderColor: '#09090b',
            pointRadius: currentPeriodDays <= 30 ? 3 : 1,
            pointHoverRadius: 5,
            borderDash: [5, 5],
            tension: 0.3,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: '⚪ ยอดขายรวม (Revenue)',
            data: revenues,
            borderColor: '#fafafa',
            borderWidth: 1.5,
            pointBackgroundColor: '#fafafa',
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.3,
            fill: false,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#d4d4d8',
              font: { family: "'Plus Jakarta Sans', 'Prompt'", size: 12 },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(18, 18, 21, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#e4e4e7',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            padding: 12,
            titleFont: { family: "'Prompt'", size: 13, weight: 'bold' },
            bodyFont: { family: "'Plus Jakarta Sans', 'Prompt'", size: 12 },
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const val = context.parsed.y || 0;
                return ` ${label}: ฿${val.toLocaleString()}`;
              },
              afterBody: function(contexts) {
                const idx = contexts[0].dataIndex;
                const rev = revenues[idx];
                const profit = profits[idx];
                const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0;
                return `อัตรากำไรเฉลี่ย: ${margin}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: {
              color: '#71717a',
              font: { family: "'Plus Jakarta Sans', 'Prompt'", size: 11 },
              maxTicksLimit: currentPeriodDays > 30 ? 12 : 15
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#a1a1aa',
              callback: val => `฿${(val / 1000).toFixed(0)}k`
            }
          }
        }
      }
    });
  },

  renderTop10Table(top10) {
    const tbody = document.getElementById("top-10-table-body");
    if (!tbody) return;

    if (top10.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-zinc-500">ไม่มีข้อมูลการขายในช่วงเวลานี้</td></tr>`;
      return;
    }

    tbody.innerHTML = top10.map(item => {
      let rankBadge = "";
      if (item.rank === 1) {
        rankBadge = `<span class="w-6 h-6 rounded-full bg-amber-400 text-black font-bold text-xs flex items-center justify-center shadow-lg shadow-amber-400/20">1</span>`;
      } else if (item.rank === 2) {
        rankBadge = `<span class="w-6 h-6 rounded-full bg-zinc-300 text-black font-bold text-xs flex items-center justify-center">2</span>`;
      } else if (item.rank === 3) {
        rankBadge = `<span class="w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center">3</span>`;
      } else {
        rankBadge = `<span class="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 font-medium text-xs flex items-center justify-center">${item.rank}</span>`;
      }

      let stockBadge = "";
      if (item.currentStock === 0) {
        stockBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">หมด</span>`;
      } else if (item.currentStock <= 10) {
        stockBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">${item.currentStock} ชิ้น (เหลือน้อย)</span>`;
      } else {
        stockBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${item.currentStock} ชิ้น</span>`;
      }

      return `
        <tr class="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
          <td class="py-3.5 px-4">${rankBadge}</td>
          <td class="py-3.5 px-4">
            <div class="font-medium text-white text-sm">${item.name}</div>
            <div class="text-xs text-zinc-500 font-mono">${item.sku} · ${item.categoryName}</div>
          </td>
          <td class="py-3.5 px-4 text-right">
            <div class="font-semibold text-white text-sm">${item.unitsSold.toLocaleString()} ชิ้น</div>
            <div class="w-24 bg-zinc-800 h-1.5 rounded-full mt-1.5 ml-auto overflow-hidden">
              <div class="bg-emerald-400 h-full rounded-full" style="width: ${item.percentageOfTop}%"></div>
            </div>
          </td>
          <td class="py-3.5 px-4 text-right font-semibold text-zinc-200 text-sm">฿${item.totalRevenue.toLocaleString()}</td>
          <td class="py-3.5 px-4 text-right font-bold text-emerald-400 text-sm">฿${(item.totalProfit || Math.round(item.totalRevenue * 0.55)).toLocaleString()}</td>
          <td class="py-3.5 px-4 text-center">${stockBadge}</td>
          <td class="py-3.5 px-4 text-right">
            <button onclick="ManagerApp.openRestockModal('${item.id}')" class="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-white hover:text-black text-zinc-300 rounded border border-zinc-700 transition">
              + เติมสต็อก
            </button>
          </td>
        </tr>
      `;
    }).join("");
  },

  // --- INVENTORY MANAGEMENT ---
  renderInventoryTable() {
    const tbody = document.getElementById("inventory-table-body");
    if (!tbody) return;

    const query = (document.getElementById("inv-search-input")?.value || "").toLowerCase().trim();
    const cat = document.getElementById("inv-category-filter")?.value || "all";
    const stockFilter = document.getElementById("inv-stock-filter")?.value || "all";

    let products = KimStore.getProducts();

    if (query) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.sku.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query)
      );
    }

    if (cat !== "all") {
      products = products.filter(p => p.category === cat);
    }

    if (stockFilter === "low") {
      products = products.filter(p => p.stock > 0 && p.stock <= 10);
    } else if (stockFilter === "out") {
      products = products.filter(p => p.stock === 0);
    } else if (stockFilter === "in") {
      products = products.filter(p => p.stock > 10);
    }

    const countEl = document.getElementById("inv-item-count");
    if (countEl) countEl.innerText = `พบทั้งหมด ${products.length} รายการ`;

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-zinc-500">ไม่พบสินค้าที่ตรงกับเงื่อนไขค้นหา</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => {
      let stockStatus = "";
      if (p.stock === 0) {
        stockStatus = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">● สินค้าหมด (0)</span>`;
      } else if (p.stock <= 10) {
        stockStatus = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">● เหลือน้อย (${p.stock})</span>`;
      } else {
        stockStatus = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">● พร้อมขาย (${p.stock})</span>`;
      }

      return `
        <tr class="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors">
          <td class="py-3 px-4 text-xs font-mono text-zinc-400">${p.sku}</td>
          <td class="py-3 px-4">
            <div class="font-medium text-white text-sm">${p.name}</div>
            <div class="text-xs text-zinc-400">${p.categoryName}</div>
          </td>
          <td class="py-3 px-4 text-right font-semibold text-white text-sm">฿${p.price.toLocaleString()}</td>
          <td class="py-3 px-4 text-right font-mono text-red-400 text-xs">฿${(p.cost || p.price * 0.45).toLocaleString()}</td>
          <td class="py-3 px-4 text-center">${stockStatus}</td>
          <td class="py-3 px-4">
            <div class="flex flex-wrap gap-1 text-[11px] text-zinc-400">
              ${(p.sizes || []).map(s => `<span class="px-1.5 py-0.5 bg-zinc-800 rounded">${s}</span>`).join('')}
            </div>
          </td>
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-2">
              <button onclick="ManagerApp.openRestockModal('${p.id}')" title="เติมสต็อก" class="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-medium rounded border border-zinc-700 transition">
                + เติมสต็อก
              </button>
              <button onclick="ManagerApp.openEditProductModal('${p.id}')" title="แก้ไขสินค้า" class="px-2 py-1 text-xs bg-zinc-800 hover:bg-white hover:text-black text-zinc-300 rounded border border-zinc-700 transition">
                แก้ไข
              </button>
              <button onclick="ManagerApp.deleteProduct('${p.id}')" title="ลบสินค้า" class="p-1 text-xs text-zinc-500 hover:text-red-400 transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    if (window.lucide) lucide.createIcons();
  },

  // Open Restock Modal
  openRestockModal(productId) {
    const prod = KimStore.getProductById(productId);
    if (!prod) return;

    const modal = document.getElementById("restock-modal");
    if (!modal) return;

    document.getElementById("restock-product-id").value = prod.id;
    document.getElementById("restock-product-name").innerText = prod.name;
    document.getElementById("restock-current-stock").innerText = `${prod.stock} ชิ้น`;
    document.getElementById("restock-add-amount").value = "20";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  },

  closeRestockModal() {
    const modal = document.getElementById("restock-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  },

  setRestockPreset(qty) {
    const input = document.getElementById("restock-add-amount");
    if (input) input.value = qty;
  },

  submitRestock() {
    const prodId = document.getElementById("restock-product-id").value;
    const amount = parseInt(document.getElementById("restock-add-amount").value, 10);

    if (amount <= 0 || isNaN(amount)) {
      alert("กรุณาระบุจำนวนที่ถูกต้อง");
      return;
    }

    const updated = KimStore.restockProduct(prodId, amount);
    this.closeRestockModal();
    this.showNotification(`เติมสต็อกสำเร็จ! ${updated.name} มีสต็อกใหม่ ${updated.stock} ชิ้น`);
  },

  // Open Edit Product Modal
  openEditProductModal(productId) {
    const prod = KimStore.getProductById(productId);
    if (!prod) return;

    const modal = document.getElementById("edit-product-modal");
    if (!modal) return;

    document.getElementById("edit-prod-id").value = prod.id;
    document.getElementById("edit-prod-name").value = prod.name;
    document.getElementById("edit-prod-sku").value = prod.sku;
    document.getElementById("edit-prod-category").value = prod.category;
    document.getElementById("edit-prod-price").value = prod.price;
    document.getElementById("edit-prod-cost").value = prod.cost || Math.round(prod.price * 0.45);
    document.getElementById("edit-prod-stock").value = prod.stock;
    document.getElementById("edit-prod-tag").value = prod.tag || "";
    document.getElementById("edit-prod-desc").value = prod.description || "";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  },

  closeEditProductModal() {
    const modal = document.getElementById("edit-product-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  },

  saveProductEdit() {
    const id = document.getElementById("edit-prod-id").value;
    const catSelect = document.getElementById("edit-prod-category");
    const categoryName = catSelect.options[catSelect.selectedIndex].text;

    const updated = {
      id: id,
      name: document.getElementById("edit-prod-name").value.trim(),
      sku: document.getElementById("edit-prod-sku").value.trim(),
      category: catSelect.value,
      categoryName: categoryName,
      price: parseFloat(document.getElementById("edit-prod-price").value) || 0,
      cost: parseFloat(document.getElementById("edit-prod-cost").value) || 0,
      stock: parseInt(document.getElementById("edit-prod-stock").value, 10) || 0,
      tag: document.getElementById("edit-prod-tag").value.trim(),
      description: document.getElementById("edit-prod-desc").value.trim()
    };

    KimStore.updateProduct(updated);
    this.closeEditProductModal();
    this.showNotification("บันทึกการแก้ไขสินค้าเรียบร้อยแล้ว");
  },

  // Open Add Product Modal
  openAddProductModal() {
    const modal = document.getElementById("add-product-modal");
    if (!modal) return;

    document.getElementById("add-prod-name").value = "";
    document.getElementById("add-prod-sku").value = `KV-NEW-${Math.floor(Math.random() * 900 + 100)}`;
    document.getElementById("add-prod-price").value = "";
    document.getElementById("add-prod-stock").value = "50";
    document.getElementById("add-prod-desc").value = "";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  },

  closeAddProductModal() {
    const modal = document.getElementById("add-product-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  },

  saveNewProduct() {
    const name = document.getElementById("add-prod-name").value.trim();
    const price = parseFloat(document.getElementById("add-prod-price").value) || 0;
    const stock = parseInt(document.getElementById("add-prod-stock").value, 10) || 0;
    const catSelect = document.getElementById("add-prod-category");

    if (!name || price <= 0) {
      alert("กรุณากรอกชื่อสินค้าและราคาที่ถูกต้อง");
      return;
    }

    const newProd = {
      name: name,
      sku: document.getElementById("add-prod-sku").value.trim(),
      category: catSelect.value,
      categoryName: catSelect.options[catSelect.selectedIndex].text,
      price: price,
      cost: Math.round(price * 0.45),
      stock: stock,
      description: document.getElementById("add-prod-desc").value.trim(),
      tag: document.getElementById("add-prod-tag").value.trim() || "NEW",
      sizes: ["S", "M", "L", "XL"],
      colors: ["#000000", "#18181B"],
      colorNames: ["Pitch Black", "Shadow Grey"]
    };

    KimStore.addProduct(newProd);
    this.closeAddProductModal();
    this.showNotification("เพิ่มสินค้าใหม่เข้าสู่ระบบเรียบร้อย");
  },

  deleteProduct(id) {
    const prod = KimStore.getProductById(id);
    if (!prod) return;

    if (confirm(`คุณต้องการลบสินค้า "${prod.name}" (${prod.sku}) หรือไม่?`)) {
      KimStore.deleteProduct(id);
      this.showNotification(`ลบสินค้าเรียบร้อยแล้ว`);
    }
  },

  // --- ORDERS & INVOICES MANAGEMENT ---
  renderOrdersTable() {
    const tbody = document.getElementById("orders-table-body");
    if (!tbody) return;

    const query = (document.getElementById("order-search-input")?.value || "").toLowerCase().trim();
    const statusFilter = document.getElementById("order-status-filter")?.value || "all";

    let orders = KimStore.getOrders();

    if (query) {
      orders = orders.filter(o => 
        o.id.toLowerCase().includes(query) ||
        o.customer.name.toLowerCase().includes(query) ||
        o.customer.phone.includes(query) ||
        (o.invoiceNo && o.invoiceNo.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== "all") {
      orders = orders.filter(o => o.status === statusFilter);
    }

    const countEl = document.getElementById("orders-count-label");
    if (countEl) countEl.innerText = `คำสั่งซื้อทั้งหมด ${orders.length} รายการ`;

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-zinc-500">ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไข</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(order => {
      let statusBadge = "";
      if (order.status === "Completed") {
        statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">สำเร็จ (Completed)</span>`;
      } else if (order.status === "Shipped") {
        statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">จัดส่งแล้ว (Shipped)</span>`;
      } else {
        statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">รอดำเนินการ (Processing)</span>`;
      }

      const orderDate = new Date(order.date).toLocaleDateString('th-TH', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });

      const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

      return `
        <tr class="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors">
          <td class="py-3.5 px-4 font-mono text-sm text-white font-medium">
            ${order.id}
            <div class="text-[11px] text-zinc-500 font-mono">${order.invoiceNo || ''}</div>
          </td>
          <td class="py-3.5 px-4 text-xs text-zinc-400">${orderDate}</td>
          <td class="py-3.5 px-4">
            <div class="text-sm font-medium text-white">${order.customer.name}</div>
            <div class="text-xs text-zinc-500">${order.customer.phone}</div>
          </td>
          <td class="py-3.5 px-4 text-xs text-zinc-300">
            ${totalItems} ชิ้น (${order.items.length} รายการ)
          </td>
          <td class="py-3.5 px-4 text-right font-semibold text-white text-sm">฿${order.totalAmount.toLocaleString()}</td>
          <td class="py-3.5 px-4 text-center">${statusBadge}</td>
          <td class="py-3.5 px-4 text-right">
            <div class="flex items-center justify-end gap-2">
              <button onclick="ManagerApp.viewOrderInvoice('${order.id}')" title="ดูบิล / พิมพ์ใบเสร็จ" class="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-white hover:text-black text-zinc-300 rounded border border-zinc-700 transition flex items-center gap-1.5">
                <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                ดูบิล & พิมพ์
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    if (window.lucide) lucide.createIcons();
  },

  // View Official Printable Bill / Tax Invoice Modal
  viewOrderInvoice(orderId) {
    const order = KimStore.getOrderById(orderId);
    if (!order) return;

    const modal = document.getElementById("invoice-view-modal");
    if (!modal) return;

    const orderDate = new Date(order.date).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const itemsHtml = order.items.map((item, idx) => `
      <tr class="border-b border-zinc-200">
        <td class="py-2.5 text-xs text-zinc-500 font-mono">${idx + 1}</td>
        <td class="py-2.5">
          <div class="font-medium text-zinc-900 text-sm">${item.productName}</div>
          <div class="text-xs text-zinc-500 font-mono">SKU: ${item.sku} | ไซส์: ${item.size} | สี: ${item.color}</div>
        </td>
        <td class="py-2.5 text-center text-sm font-medium text-zinc-800">${item.quantity}</td>
        <td class="py-2.5 text-right text-sm text-zinc-800">฿${item.price.toLocaleString()}</td>
        <td class="py-2.5 text-right text-sm font-semibold text-zinc-900">฿${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join("");

    const container = document.getElementById("printable-receipt-area");
    if (container) {
      container.innerHTML = `
        <div class="p-8 bg-white text-zinc-900 max-w-3xl mx-auto rounded-lg shadow-xl">
          <!-- Header -->
          <div class="flex justify-between items-start border-b border-zinc-200 pb-6 mb-6">
            <div class="flex items-center gap-4">
              <img src="assets/logo.png" alt="KIM Vision & Time" class="h-16 w-auto bg-black p-2 rounded">
              <div>
                <h2 class="text-2xl font-bold font-serif-brand tracking-wider text-black">KIM VISION & TIME</h2>
                <p class="text-xs text-zinc-500 mt-0.5">บริษัท คิม วิชั่น แอนด์ ไทม์ จำกัด (สำนักงานใหญ่)</p>
                <p class="text-xs text-zinc-500">เลขประจำตัวผู้เสียภาษี: 0105567088921</p>
                <p class="text-xs text-zinc-500">โทร: 02-998-8888 | contact@kimvision.com</p>
              </div>
            </div>
            <div class="text-right">
              <div class="inline-block px-3 py-1 bg-black text-white text-xs font-bold tracking-widest uppercase rounded">
                ใบเสร็จรับเงิน / ใบกำกับภาษี
              </div>
              <p class="text-xs text-zinc-500 font-mono mt-2">เลขที่: <span class="font-bold text-zinc-900">${order.invoiceNo || order.id}</span></p>
              <p class="text-xs text-zinc-500 font-mono">ออเดอร์: <span class="text-zinc-900">${order.id}</span></p>
              <p class="text-xs text-zinc-500 mt-1">วันที่: ${orderDate}</p>
            </div>
          </div>

          <!-- Customer & Shipping Info -->
          <div class="grid grid-cols-2 gap-6 bg-zinc-50 p-4 rounded border border-zinc-200 mb-6 text-xs">
            <div>
              <p class="font-bold text-zinc-900 text-sm mb-1">ข้อมูลลูกค้า (Customer Details)</p>
              <p class="text-zinc-700 font-medium">${order.customer.name}</p>
              <p class="text-zinc-600">โทร: ${order.customer.phone}</p>
              <p class="text-zinc-600">อีเมล: ${order.customer.email}</p>
            </div>
            <div>
              <p class="font-bold text-zinc-900 text-sm mb-1">ที่อยู่จัดส่งสินค้า (Shipping Address)</p>
              <p class="text-zinc-700 leading-relaxed">${order.customer.address}</p>
              <p class="text-zinc-600 mt-1 font-medium">การชำระเงิน: <span class="text-zinc-900 font-bold">${order.paymentMethod}</span></p>
            </div>
          </div>

          <!-- Items Table -->
          <table class="w-full text-left mb-6">
            <thead>
              <tr class="border-b-2 border-black text-xs font-bold uppercase text-zinc-700">
                <th class="py-2 w-10">#</th>
                <th class="py-2">รายการแว่นตา / นาฬิกา</th>
                <th class="py-2 text-center w-20">จำนวน</th>
                <th class="py-2 text-right w-24">ราคา/หน่วย</th>
                <th class="py-2 text-right w-28">ยอดรวม (บาท)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Financial Calculation -->
          <div class="flex justify-between items-start border-t border-zinc-200 pt-4 mb-6">
            <div class="w-1/2 text-xs text-zinc-500">
              <p class="font-bold text-zinc-700 mb-1">หมายเหตุ:</p>
              <p>สินค้าจัดส่งโดย KIM Express ขอบคุณที่ไว้วางใจสินค้าคุณภาพจาก KIM Vision & Time</p>
              <div class="mt-4 flex items-center gap-3">
                <div class="w-20 h-20 border border-zinc-300 p-1 flex items-center justify-center bg-white">
                  <div class="text-[10px] text-center font-mono">E-Tax Invoice Verified</div>
                </div>
                <div class="text-[11px] text-zinc-500">
                  <p class="font-semibold text-zinc-800">เอกสารนี้ออกโดยระบบอิเล็กทรอนิกส์</p>
                  <p>สามารถใช้เป็นหลักฐานทางภาษีได้</p>
                </div>
              </div>
            </div>

            <div class="w-1/2 pl-8 space-y-1.5 text-xs text-right">
              <div class="flex justify-between text-zinc-600">
                <span>ยอดรวมสินค้า (Subtotal):</span>
                <span class="font-medium text-zinc-900">฿${order.subtotal.toLocaleString()}</span>
              </div>
              ${order.discount > 0 ? `
                <div class="flex justify-between text-emerald-700">
                  <span>ส่วนลดโปรโมชั่น (Discount):</span>
                  <span class="font-medium">-฿${order.discount.toLocaleString()}</span>
                </div>
              ` : ''}
              <div class="flex justify-between text-zinc-600">
                <span>ค่าบริการจัดส่ง (Shipping):</span>
                <span class="font-medium text-zinc-900">${order.shippingFee === 0 ? 'ฟรี' : `฿${order.shippingFee.toLocaleString()}`}</span>
              </div>
              <div class="flex justify-between text-zinc-600">
                <span>ภาษีมูลค่าเพิ่ม 7% (VAT Included):</span>
                <span class="font-medium text-zinc-900">฿${order.vatAmount.toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-base font-bold border-t-2 border-black pt-2 text-black mt-2">
                <span>ยอดสุทธิรวมทั้งสิ้น (Grand Total):</span>
                <span class="text-xl">฿${order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <!-- Signatures & Barcode -->
          <div class="border-t border-dashed border-zinc-300 pt-4 flex justify-between items-end">
            <div class="w-48 text-center text-xs text-zinc-500">
              <div class="border-b border-zinc-400 h-10 mb-1"></div>
              <p>ผู้รับสินค้า (Customer Signature)</p>
            </div>
            <div class="text-center">
              <div class="barcode-strip max-w-[200px] mx-auto mb-1"></div>
              <div class="text-[10px] font-mono text-zinc-600">${order.id}</div>
            </div>
            <div class="w-48 text-center text-xs text-zinc-500">
              <div class="border-b border-zinc-400 h-10 mb-1"></div>
              <p>ผู้มีอำนาจลงนาม (Authorized Officer)</p>
            </div>
          </div>
        </div>
      `;
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  },

  closeInvoiceModal() {
    const modal = document.getElementById("invoice-view-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  },

  printCurrentInvoice() {
    window.print();
  },

  // Export Excel Functions
  exportSalesExcel() {
    KimStore.exportSalesSummaryToExcel(currentPeriodDays);
    this.showNotification(`ส่งออกรายงานกำไร-ขาดทุน ${currentPeriodDays} วัน เป็นไฟล์ Excel สำเร็จ`);
  },

  exportOrdersExcel() {
    KimStore.exportOrdersToExcel();
    this.showNotification("ส่งออกประวัติคำสั่งซื้อทั้งหมดเป็นไฟล์ Excel สำเร็จ");
  },

  exportInventoryExcel() {
    KimStore.exportInventoryToExcel();
    this.showNotification("ส่งออกรายงานสต็อกสินค้าเป็นไฟล์ Excel สำเร็จ");
  },

  // Logout Manager
  logout() {
    KimStore.logout();
    CustomerApp.switchView('customer');
    CustomerApp.updateAuthUI();
    this.showNotification("ออกจากระบบผู้จัดการเรียบร้อยแล้ว");
  },

  // Notification Toast Helper
  showNotification(message) {
    const toast = document.createElement("div");
    toast.className = "toast px-4 py-3 bg-zinc-900 text-white rounded-lg shadow-2xl border border-zinc-700 flex items-center gap-3 text-sm font-medium";
    toast.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i> <span>${message}</span>`;
    
    const container = document.getElementById("toast-container");
    if (container) {
      container.appendChild(toast);
      if (window.lucide) lucide.createIcons();
      setTimeout(() => {
        toast.remove();
      }, 3500);
    }
  }
};
