/**
 * KIM Vision & Time - Product Catalog & Seed Data
 * 30 Luxury Minimalist Items with Local Image Paths (prod-001.png to prod-030.png):
 * - แว่นสายตา (Prescription Eyeglasses) 10 รายการ: prod-001.png ถึง prod-010.png
 * - แว่นป้องกันแสงสีฟ้า (Blue Light Glasses) 10 รายการ: prod-011.png ถึง prod-020.png
 * - นาฬิกาพรีเมียม (Luxury Watches & Timepieces) 10 รายการ: prod-021.png ถึง prod-030.png
 */

const INITIAL_PRODUCTS = [
  // ==================== 1. แว่นสายตา (Prescription Eyeglasses) - 10 รายการ ====================
  {
    id: "PROD-001",
    name: "KIM Titanium Minimalist Classic Optical",
    category: "prescription_glasses",
    categoryName: "แว่นสายตา (Prescription)",
    price: 3490,
    cost: 1450,
    stock: 45,
    rating: 4.9,
    reviews: 168,
    tag: "BESTSELLER",
    isNew: false,
    image: "assets/images/products/prod-001.png",
    description: "กรอบแว่นสายตาไทเทเนียมแท้ 100% เกรดการบิน น้ำหนักเบาเพียง 9.5 กรัม ทนทาน ยืดหยุ่น ไม่ระคายเคืองผิว ทรงเหลี่ยมมนคลาสสิก ปลายขาแว่นสลักโมโนแกรม KIM Vision",
    colors: ["#000000", "#3F3F46", "#D4D4D8", "#78350F"],
    colorNames: ["Pitch Black", "Matte Gunmetal", "Silver Titanium", "Dark Amber"],
    sizes: ["48-20-145 (S)", "50-20-145 (M)", "52-21-148 (L)"],
    sku: "KV-OPT-001"
  },
  {
    id: "PROD-002",
    name: "Acetate Slim Round Eyeglasses",
    category: "prescription_glasses",
    categoryName: "แว่นสายตา (Prescription)",
    price: 2890,
    cost: 1190,
    stock: 50,
    rating: 4.8,
    reviews: 124,
    tag: "POPULAR",
    isNew: false,
    image: "assets/images/products/prod-002.png",
    description: "แว่นสายตาทรงกลมสไตล์วินเทจโมเดิร์น ผลิตจากอะซิเตทพรีเมียมจากอิตาลี ผิวเงาเนียนละเอียด แกนขาล็อก 5 ชั้นแข็งแรงทนทาน สวมใส่สบายตลอดวัน",
    colors: ["#09090B", "#1C1917", "#27272A"],
    colorNames: ["Piano Black", "Deep Tortoise", "Smoky Grey"],
    sizes: ["47-21-142 (S)", "49-21-145 (M)"],
    sku: "KV-OPT-002"
  },
  {
    id: "PROD-003",
    name: "KIM Matte Black Square Optical Frame",
    category: "prescription_glasses",
    categoryName: "แว่นสายตา (Prescription)",
    price: 2990,
    cost: 1250,
    stock: 38,
    rating: 4.9,
    reviews: 95,
    tag: "ESSENTIAL",
    isNew: false,
    image: "assets/images/products/prod-003.png",
    description: "กรอบแว่นสายตาทรงเหลี่ยมสีดำด้าน Matte Black เรียบหรู คมชัด สไตล์มินิมอลเจแปนนิส เหมาะสำหรับลุคทำงานและทางการ",
    colors: ["#000000", "#18181B"],
    colorNames: ["Matte Jet Black", "Charcoal Slate"],
    sizes: ["51-18-145 (M)", "53-19-148 (L)"],
    sku: "KV-OPT-003"
  },
  {
    id: "PROD-004",
    name: "Browline Vintage Executive Glasses",
    category: "prescription_glasses",
    categoryName: "แว่นสายตา (Prescription)",
    price: 3690,
    cost: 1550,
    stock: 28,
    rating: 4.8,
    reviews: 73,
    tag: "SIGNATURE",
    isNew: true,
    image: "assets/images/products/prod-004.png",
    description: "แว่นสายตาทรง Browline ผสมผสานคิ้วอะซิเตทสีดำกับกรอบล่างโลหะสเตนเลสสตีลรมดำ ให้ความภูมิฐานระดับผู้บริหาร",
    colors: ["#000000", "#1E1E24"],
    colorNames: ["Black & Gunmetal", "Black & Gold"],
    sizes: ["49-20-145 (M)", "51-20-148 (L)"],
    sku: "KV-OPT-004"
  },
  {
    id: "PROD-005",
    name: "Geometric Hexagon Ultra-Light Frame",
    category: "prescription_glasses",
    categoryName: "แว่นสายตา (Prescription)",
    price: 3290,
    cost: 1350,
    stock: 35,
    rating: 4.7,
    reviews: 64,
    tag: "NEW",
    isNew: true,
    image: "assets/images/products/prod-005.png",
    description: "แว่นสายตาทรงหกเหลี่ยม Geometric ดีไซน์ Avant-Garde เส้นสายบางเฉียบ น้ำหนักเบาพิเศษ เสริมเอกลักษณ์เฉพาะตัว",
    colors: ["#09090B", "#3F3F46"],
    colorNames: ["Pitch Black", "Steel Grey"],
    sizes: ["49-19-145 (M)"],
    sku: "KV-OPT-005"
  },
  {
    id: "PROD-006",
    name: "KIM Rimless Frameless Titanium Glasses",
    category: "prescription_glasses",
    categoryName: "แว่นสายตา (Prescription)",
    price: 4290,
    cost: 1800,
    stock: 20,
    rating: 5.0,
    reviews: 88,
    tag: "EXCLUSIVE",
    isNew: false,
    image: "assets/images/products/prod-006.png",
    description: "แว่นสายตาไร้กรอบ (Rimless) ไทเทเนียมระดับไฮเอนด์ เบาสบายเสมือนไม่ได้สวมใส่ แข็งแกร่ง ยืดหยุ่น คัตติ้งเลนส์มุมเหลี่ยมประณีต",
    colors: ["#000000", "#D4D4D8"],
    colorNames: ["Stealth Black", "Silver Platinum"],
    sizes: ["Standard Fit"],
    sku: "KV-OPT-006"
  },
  {
    id: "PROD-007",
    name: "Bold Aviator Optical Double-Bridge",
    category: "prescription_glasses",
    categoryName: "แว่นสายตา (Prescription)",
    price: 3590,
    cost: 1480,
    stock: 25,
    rating: 4.8,
    reviews: 57,
    tag: "TRENDING",
    isNew: true,
    image: "assets/images/products/prod-007.png",
    description: "แว่นสายตาทรงนักบิน Aviator สะพานแว่นคู่ Double Bridge โลหะเนื้อหนาพรีเมียม สไตล์เรโทรโมเดิร์นที่โดดเด่น",
    colors: ["#000000", "#27272A"],
    colorNames: ["Midnight Black", "Anthracite"],
    sizes: ["52-16-145 (M)", "54-17-148 (L)"],
    sku: "KV-OPT-007"
  },
  {
    id: "PROD-008",
    name: "Cat-Eye Dark Luxury Optical",
    category: "prescription_glasses",
    categoryName: "แว่นสายตา (Prescription)",
    price: 3190,
    cost: 1300,
    stock: 30,
    rating: 4.9,
    reviews: 69,
    tag: "POPULAR",
    isNew: false,
    image: "assets/images/products/prod-008.png",
    description: "แว่นสายตาทรงแคทอายมุมยกเรียบหรู อะซิเตทสีดำเงาช่วยปรับรูปหน้าให้ดูเรียวคม เสริมความสง่างามและความมั่นใจ",
    colors: ["#000000", "#1C1917"],
    colorNames: ["Piano Black", "Smoky Crystal"],
    sizes: ["50-18-142 (M)"],
    sku: "KV-OPT-008"
  },
  {
    id: "PROD-009",
    name: "Ultra-Light Beta-Titanium Oval Frame",
    category: "prescription_glasses",
    categoryName: "แว่นสายตา (Prescription)",
    price: 3890,
    cost: 1620,
    stock: 22,
    rating: 4.9,
    reviews: 82,
    tag: "LIMITED",
    isNew: false,
    image: "assets/images/products/prod-009.png",
    description: "แว่นสายตาทรงรีผ้าเบต้าไทเทเนียม มีความยืดหยุ่นสูงพิเศษ ดัดงอคืนรูปได้ ขาแว่นไม่กดทับศีรษะ นุ่มสบายที่สุด",
    colors: ["#000000", "#3F3F46"],
    colorNames: ["True Black", "Graphite"],
    sizes: ["48-20-145 (S)", "50-20-145 (M)"],
    sku: "KV-OPT-009"
  },
  {
    id: "PROD-010",
    name: "KIM Octagonal Architectural Glasses",
    category: "prescription_glasses",
    categoryName: "แว่นสายตา (Prescription)",
    price: 3390,
    cost: 1400,
    stock: 27,
    rating: 4.8,
    reviews: 44,
    tag: "NEW",
    isNew: true,
    image: "assets/images/products/prod-010.png",
    description: "แว่นสายตาทรงแปดเหลี่ยม Architectural ดีไซน์คมกริบ งานประกอบละเอียดไร้น็อต Screwless Hinge เทคโนโลยีสมัยใหม่",
    colors: ["#000000", "#18181B"],
    colorNames: ["Obsidian Black", "Gunmetal"],
    sizes: ["50-19-145 (M)"],
    sku: "KV-OPT-010"
  },

  // ==================== 2. แว่นป้องกันแสงสีฟ้า (Blue Light Glasses) - 10 รายการ ====================
  {
    id: "PROD-011",
    name: "KIM BlueShield Pro Gamer & Screen Glasses",
    category: "bluelight_glasses",
    categoryName: "แว่นกรองแสงสีฟ้า (Blue Light)",
    price: 1990,
    cost: 750,
    stock: 75,
    rating: 5.0,
    reviews: 215,
    tag: "BESTSELLER",
    isNew: false,
    image: "assets/images/products/prod-011.png",
    description: "แว่นกรองแสงสีฟ้าเลนส์ใส BlueShield Max บล็อกแสงสีฟ้าอันตราย 98% สำหรับหน้าจอคอมพิวเตอร์และมือถือ เคลือบมัลติโค้ตลดแสงสะท้อนและกันรอยขีดข่วน",
    colors: ["#000000", "#1E1E24", "#3F3F46"],
    colorNames: ["Pitch Black", "Deep Charcoal", "Slate Grey"],
    sizes: ["Standard Fit (M)", "Wide Fit (L)"],
    sku: "KV-BLU-001"
  },
  {
    id: "PROD-012",
    name: "Ultra-Light TR90 Computer Eyewear",
    category: "bluelight_glasses",
    categoryName: "แว่นกรองแสงสีฟ้า (Blue Light)",
    price: 1590,
    cost: 580,
    stock: 90,
    rating: 4.8,
    reviews: 178,
    tag: "POPULAR",
    isNew: false,
    image: "assets/images/products/prod-012.png",
    description: "แว่นกรองแสงหน้าจอวัสดุ TR90 จากสวิส น้ำหนักเบาเพียง 8 กรัม ยืดหยุ่นทนทานสูง ไม่บีบขมับ สวมใส่ทำงานหน้าจอตลอด 8-12 ชั่วโมงโดยไม่เมื่อยล้า",
    colors: ["#000000", "#27272A"],
    colorNames: ["Matte Black", "Frost Grey"],
    sizes: ["Free Size (M)"],
    sku: "KV-BLU-002"
  },
  {
    id: "PROD-013",
    name: "KIM Matte Black Oval Screen Protector",
    category: "bluelight_glasses",
    categoryName: "แว่นกรองแสงสีฟ้า (Blue Light)",
    price: 1790,
    cost: 680,
    stock: 60,
    rating: 4.9,
    reviews: 132,
    tag: "ESSENTIAL",
    isNew: false,
    image: "assets/images/products/prod-013.png",
    description: "แว่นตาทรงไข่มุกมินิมอล เลนส์กรองแสงคอมพิวเตอร์และป้องกันรังสี UV400 ถนอมสายตา ป้องกันอาการตาล้า ตาแห้ง และปวดศีรษะ",
    colors: ["#09090B", "#18181B"],
    colorNames: ["Solid Black", "Shadow Grey"],
    sizes: ["Standard (49mm)"],
    sku: "KV-BLU-003"
  },
  {
    id: "PROD-014",
    name: "Zero-Pressure Sleep Shield Amber Lens",
    category: "bluelight_glasses",
    categoryName: "แว่นกรองแสงสีฟ้า (Blue Light)",
    price: 2190,
    cost: 850,
    stock: 40,
    rating: 4.9,
    reviews: 94,
    tag: "NIGHT-MODE",
    isNew: true,
    image: "assets/images/products/prod-014.png",
    description: "แว่นกรองแสงสีฟ้ายามค่ำคืน เลนส์สีส้มอำพันช่วยกระตุ้นการหลั่งฮอร์โมนเมลาโทนิน เหมาะสำหรับใส่ดูจอก่อนนอน ช่วยให้นอนหลับลึกและสดชื่น",
    colors: ["#000000"],
    colorNames: ["Night Onyx"],
    sizes: ["Standard (M)"],
    sku: "KV-BLU-004"
  },
  {
    id: "PROD-015",
    name: "Aviator Blue Guard Metal Frame",
    category: "bluelight_glasses",
    categoryName: "แว่นกรองแสงสีฟ้า (Blue Light)",
    price: 2290,
    cost: 900,
    stock: 45,
    rating: 4.7,
    reviews: 76,
    tag: "TRENDING",
    isNew: false,
    image: "assets/images/products/prod-015.png",
    description: "แว่นกรองแสงสีฟ้ารูปทรง Aviator เท่และมีระดับด้วยกรอบโลหะสีดำด้าน แป้นจมูกซิลิโคนนุ่มพิเศษ เลนส์ใสตัดแสงสะท้อนหน้าจอ",
    colors: ["#000000", "#3F3F46"],
    colorNames: ["Stealth Black", "Titanium Grey"],
    sizes: ["53-17-145 (L)"],
    sku: "KV-BLU-005"
  },
  {
    id: "PROD-016",
    name: "Square Office Minimalist Blue Blocker",
    category: "bluelight_glasses",
    categoryName: "แว่นกรองแสงสีฟ้า (Blue Light)",
    price: 1890,
    cost: 720,
    stock: 55,
    rating: 4.8,
    reviews: 110,
    tag: "POPULAR",
    isNew: false,
    image: "assets/images/products/prod-016.png",
    description: "แว่นทรงเหลี่ยมเรียบหรูสำหรับหนุ่มสาวออฟฟิศ ออกแบบให้เข้ากับทุกรูปหน้า ช่วยตัดแสงฟ้าจากจอ Monitor และหลอดไฟ LED ในสำนักงาน",
    colors: ["#000000", "#1C1917"],
    colorNames: ["Piano Black", "Espresso Black"],
    sizes: ["51-18-145 (M)"],
    sku: "KV-BLU-006"
  },
  {
    id: "PROD-017",
    name: "KIM Magnetic Clip-On Blue Filter Glasses",
    category: "bluelight_glasses",
    categoryName: "แว่นกรองแสงสีฟ้า (Blue Light)",
    price: 2490,
    cost: 980,
    stock: 35,
    rating: 4.9,
    reviews: 87,
    tag: "INNOVATION",
    isNew: true,
    image: "assets/images/products/prod-017.png",
    description: "แว่นตา 2-in-1 พร้อมคลิปออนแม่เหล็กแรงสูง ถอดสลับระหว่างเลนส์กรองแสงสีฟ้าในที่ทำงาน และคลิปออนกันแดดโพลาไรซ์สำหรับขับรถกลางแจ้ง",
    colors: ["#000000"],
    colorNames: ["Matte Black Duo"],
    sizes: ["50-19-145 (M)"],
    sku: "KV-BLU-007"
  },
  {
    id: "PROD-018",
    name: "Acetate Luxury Screen Guard Eyewear",
    category: "bluelight_glasses",
    categoryName: "แว่นกรองแสงสีฟ้า (Blue Light)",
    price: 2690,
    cost: 1050,
    stock: 30,
    rating: 4.9,
    reviews: 62,
    tag: "SIGNATURE",
    isNew: false,
    image: "assets/images/products/prod-018.png",
    description: "แว่นกรองแสงวัสดุ Acetate เกรดไฮเอนด์ ขัดมือเงางาม ลายสลักโลโก้สีเงินที่ขาแว่น เลนส์ Hydrophobic ป้องกันคราบมันและรอยนิ้วมือ",
    colors: ["#000000", "#27272A"],
    colorNames: ["Deep Jet Black", "Smoke Pattern"],
    sizes: ["50-20-145 (M)"],
    sku: "KV-BLU-008"
  },
  {
    id: "PROD-019",
    name: "Titanium Screen & Night Vision Shield",
    category: "bluelight_glasses",
    categoryName: "แว่นกรองแสงสีฟ้า (Blue Light)",
    price: 3290,
    cost: 1350,
    stock: 24,
    rating: 4.8,
    reviews: 49,
    tag: "LIMITED",
    isNew: true,
    image: "assets/images/products/prod-019.png",
    description: "กรอบไทเทเนียมบางเฉียบ เลนส์นวัตกรรมตัดแสงสะท้อนและแสงจ้า (Anti-Glare & Night Vision) ใช้ได้ทั้งทำงานหน้าจอและขับรถกลางคืน",
    colors: ["#000000", "#D4D4D8"],
    colorNames: ["Black Titanium", "Silver Frost"],
    sizes: ["49-20-145 (M)"],
    sku: "KV-BLU-009"
  },
  {
    id: "PROD-020",
    name: "Half-Rim Business Shield Eyeglasses",
    category: "bluelight_glasses",
    categoryName: "แว่นกรองแสงสีฟ้า (Blue Light)",
    price: 2190,
    cost: 860,
    stock: 42,
    rating: 4.7,
    reviews: 68,
    tag: "FORMAL",
    isNew: false,
    image: "assets/images/products/prod-020.png",
    description: "แว่นกรองแสงแบบครึ่งกรอบ (Half-Rim) ลุคนักธุรกิจ สุภาพ คลีน สบายตา พร้อมเลนส์บลูบล็อกคุณภาพสูงปกป้องดวงตา",
    colors: ["#000000", "#3F3F46"],
    colorNames: ["Matte Black", "Graphite"],
    sizes: ["52-18-145 (M)"],
    sku: "KV-BLU-010"
  },

  // ==================== 3. นาฬิกาพรีเมียม (Luxury Watches & Timepieces) - 10 รายการ ====================
  {
    id: "PROD-021",
    name: "KIM Onyx Minimalist Bauhaus Watch",
    category: "watches",
    categoryName: "นาฬิกาพรีเมียม (Watches)",
    price: 4990,
    cost: 2100,
    stock: 35,
    rating: 5.0,
    reviews: 195,
    tag: "BESTSELLER",
    isNew: false,
    image: "assets/images/products/prod-021.png",
    description: "นาฬิกาข้อมือมินิมอลหน้าปัดกระจก Sapphire Crystal กันรอยขีดข่วน 100% ตัวเรือนสเตนเลสสตีล 316L สีดำด้าน กลไก Japanese Miyota Quartz แม่นยำสูง กันน้ำ 5ATM สายหนังแท้ฟูลเกรน",
    colors: ["#000000", "#18181B", "#78350F"],
    colorNames: ["Pitch Black Leather", "Charcoal Black", "Vintage Brown Leather"],
    sizes: ["38mm Dial (Unisex)", "41mm Dial (Men)"],
    sku: "KV-WAT-001"
  },
  {
    id: "PROD-022",
    name: "Chronograph Stealth Black Edition",
    category: "watches",
    categoryName: "นาฬิกาพรีเมียม (Watches)",
    price: 6490,
    cost: 2800,
    stock: 22,
    rating: 4.9,
    reviews: 142,
    tag: "SIGNATURE",
    isNew: false,
    image: "assets/images/products/prod-022.png",
    description: "นาฬิกาโครโนกราฟ 3 วงสไตล์ Stealth Black หน้าปัดมิติหลายชั้นพร้อมพรายน้ำ Super-LumiNova เรืองแสงในที่มืด ฟังก์ชันจับเวลา 1/10 วินาที กันน้ำ 10ATM",
    colors: ["#000000", "#27272A"],
    colorNames: ["All Black Stealth", "Black & Gunmetal"],
    sizes: ["42mm Dial"],
    sku: "KV-WAT-002"
  },
  {
    id: "PROD-023",
    name: "KIM Automatic Skeleton Dark Luxury",
    category: "watches",
    categoryName: "นาฬิกาพรีเมียม (Watches)",
    price: 8990,
    cost: 3900,
    stock: 12,
    rating: 5.0,
    reviews: 86,
    tag: "EXCLUSIVE",
    isNew: true,
    image: "assets/images/products/prod-023.png",
    description: "นาฬิกากลไกออโตเมติกไขลานอัตโนมัติ หน้าปัดแบบเปลือย (Skeleton) โชว์การทำงานของฟันเฟืองและทับทิม 24 เม็ด สำรองพลังงาน 42 ชั่วโมง กระจกแซฟไฟร์หน้า-หลัง",
    colors: ["#000000"],
    colorNames: ["Skeleton Jet Black"],
    sizes: ["41.5mm Dial"],
    sku: "KV-WAT-003"
  },
  {
    id: "PROD-024",
    name: "Sapphire Ceramic Luxury Timepiece",
    category: "watches",
    categoryName: "นาฬิกาพรีเมียม (Watches)",
    price: 7490,
    cost: 3200,
    stock: 16,
    rating: 4.9,
    reviews: 78,
    tag: "LIMITED",
    isNew: false,
    image: "assets/images/products/prod-024.png",
    description: "ตัวเรือนและสายผลิตจากเซรามิกไฮเทค (High-Tech Ceramic) สีดำเงา เงางามทนทานต่อรอยขีดข่วน ไม่ลอก ไม่ดำ สัมผัสเย็นสบายผิวระดับลักชัวรี",
    colors: ["#000000"],
    colorNames: ["Piano Ceramic Black"],
    sizes: ["39mm Dial", "42mm Dial"],
    sku: "KV-WAT-004"
  },
  {
    id: "PROD-025",
    name: "Heritage Vintage Mechanical Field Watch",
    category: "watches",
    categoryName: "นาฬิกาพรีเมียม (Watches)",
    price: 5290,
    cost: 2250,
    stock: 28,
    rating: 4.8,
    reviews: 91,
    tag: "POPULAR",
    isNew: false,
    image: "assets/images/products/prod-025.png",
    description: "นาฬิกาสไตล์ทหาร Field Watch คลาสสิก หน้าปัดอ่านง่ายชัดเจน ตัวเรือนรมดำทรายด้าน (Sandblasted) เม็ดมะยมขันเกลียว สายผ้าแคนวาสทอแน่นหนาพิเศษ",
    colors: ["#000000", "#1C1917"],
    colorNames: ["Black Tactical", "Military Charcoal"],
    sizes: ["40mm Dial"],
    sku: "KV-WAT-005"
  },
  {
    id: "PROD-026",
    name: "KIM Titanium Ultra-Thin Diver Watch (200M)",
    category: "watches",
    categoryName: "นาฬิกาพรีเมียม (Watches)",
    price: 7990,
    cost: 3500,
    stock: 15,
    rating: 5.0,
    reviews: 104,
    tag: "BESTSELLER",
    isNew: false,
    image: "assets/images/products/prod-026.png",
    description: "นาฬิกาดำน้ำมืออาชีพกันน้ำลึก 200 เมตร ตัวเรือนไทเทเนียมน้ำหนักเบา ขอบหน้าปัดเซรามิกหมุนทิศทางเดียว (Unidirectional Bezel) กระจกแซฟไฟร์เคลือบสารตัดแสง",
    colors: ["#000000", "#0F172A"],
    colorNames: ["Deep Sea Black", "Abyss Navy-Black"],
    sizes: ["41mm Dial"],
    sku: "KV-WAT-006"
  },
  {
    id: "PROD-027",
    name: "KIM Mesh Strap Ultra-Slim Executive Watch",
    category: "watches",
    categoryName: "นาฬิกาพรีเมียม (Watches)",
    price: 4590,
    cost: 1900,
    stock: 40,
    rating: 4.8,
    reviews: 118,
    tag: "ESSENTIAL",
    isNew: false,
    image: "assets/images/products/prod-027.png",
    description: "นาฬิกาดีไซน์บางเฉียบเพียง 6.2 มม. สวมใส่แนบข้อมือไร้รอยนูน สายถักสเตนเลสสตีล Milanese Mesh สีดำ ปรับขนาดได้เองอย่างอิสระ",
    colors: ["#000000", "#3F3F46"],
    colorNames: ["Black Mesh", "Gunmetal Mesh"],
    sizes: ["38mm (Slim)", "40mm (Standard)"],
    sku: "KV-WAT-007"
  },
  {
    id: "PROD-028",
    name: "Milanese Black Diamond Minimalist Watch",
    category: "watches",
    categoryName: "นาฬิกาพรีเมียม (Watches)",
    price: 5890,
    cost: 2500,
    stock: 20,
    rating: 4.9,
    reviews: 65,
    tag: "SIGNATURE",
    isNew: true,
    image: "assets/images/products/prod-028.png",
    description: "หน้าปัดซันเรย์สีดำสนิท ประดับเพชรแท้โมเดิร์นคัตที่ตำแหน่ง 12 นาฬิกา เรียบหรู สะกดทุกสายตา ตัวเรือนชุบ PVD สีดำทนทานไม่ลอก",
    colors: ["#000000"],
    colorNames: ["Diamond Solitaire Black"],
    sizes: ["39mm Dial"],
    sku: "KV-WAT-008"
  },
  {
    id: "PROD-029",
    name: "Dual-Time GMT World Traveler Watch",
    category: "watches",
    categoryName: "นาฬิกาพรีเมียม (Watches)",
    price: 6990,
    cost: 3000,
    stock: 18,
    rating: 4.8,
    reviews: 52,
    tag: "NEW",
    isNew: true,
    image: "assets/images/products/prod-029.png",
    description: "นาฬิกาบอกเวลา 2 ประเทศ (GMT Function) ด้วยเข็มชี้ 24 ชั่วโมง ขอบตัวเรือนเซรามิกสองเฉดสีดำ-เทา สำหรับนักธุรกิจและนักเดินทางรอบโลก",
    colors: ["#000000"],
    colorNames: ["Batman Black-Grey GMT"],
    sizes: ["41.5mm Dial"],
    sku: "KV-WAT-009"
  },
  {
    id: "PROD-030",
    name: "KIM Solar-Powered Eco Minimalist Watch",
    category: "watches",
    categoryName: "นาฬิกาพรีเมียม (Watches)",
    price: 5490,
    cost: 2300,
    stock: 32,
    rating: 4.9,
    reviews: 79,
    tag: "ECO-TECH",
    isNew: false,
    image: "assets/images/products/prod-030.png",
    description: "นาฬิกาพลังงานแสงอาทิตย์ (Solar Powered) ชาร์จไฟจากแสงแดดและแสงไฟในห้อง ไม่ต้องเปลี่ยนถ่านตลอดอายุการใช้งาน ชาร์จเต็มใช้งานได้ต่อเนื่อง 6 เดือน",
    colors: ["#000000", "#18181B"],
    colorNames: ["Solar Jet Black", "Solar Dark Charcoal"],
    sizes: ["40mm Dial"],
    sku: "KV-WAT-010"
  }
];

// Seed generator for historical orders spanning 120 days
function generateSeedOrders(products) {
  const customerNames = [
    { name: "คุณธนกร วัฒนศิริ", phone: "081-452-9871", email: "thanakorn.w@gmail.com", address: "88/12 อาคารไพร์ม สุขุมวิท 21 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110" },
    { name: "คุณกิตติภพ กุลวงศ์", phone: "089-771-3324", email: "kittipop.k@outlook.com", address: "555 หมู่ 4 ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200" },
    { name: "คุณณภัทร สิริพานิชย์", phone: "092-334-1189", email: "naphat.s@kimmail.com", address: "14/99 ซอยอารีย์ พหลโยธิน แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400" },
    { name: "คุณปิยะวัฒน์ เจริญผล", phone: "084-556-7812", email: "piyawat.c@gmail.com", address: "201/5 ถ.ราษฎร์ยินดี อ.หาดใหญ่ จ.สงขลา 90110" },
    { name: "คุณชญานิษฐ์ รัตนโชติ", phone: "086-901-2245", email: "chayanit.r@gmail.com", address: "32/1 หมู่บ้านแกรนด์วิลล์ ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000" },
    { name: "คุณอัครเดช รุ่งเรือง", phone: "095-882-6710", email: "akradech.r@hotmail.com", address: "78 ถ.พระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310" },
    { name: "คุณศิริพร บุญประเสริฐ", phone: "083-221-9988", email: "siriporn.b@gmail.com", address: "112/4 ถ.สุขุมวิท ต.เสม็ด อ.เมือง จ.ชลบุรี 20000" },
    { name: "คุณวรเมธ เอกชัย", phone: "098-441-2356", email: "worameth.e@gmail.com", address: "90/2 หมู่ 2 ต.วิชิต อ.เมือง จ.ภูเก็ต 83000" },
    { name: "คุณธีรพงศ์ มงคลชัย", phone: "087-654-3210", email: "theerapong.m@gmail.com", address: "45/88 ถ.วิภาวดีรังสิต แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900" },
    { name: "คุณสุพัตรา เลิศวิไล", phone: "091-887-6543", email: "supattra.l@yahoo.com", address: "303 คอนโดมิเนียม แอชตัน อโศก เขตวัฒนา กรุงเทพฯ 10110" }
  ];

  const paymentMethods = ["PromptPay QR", "Credit/Debit Card", "Cash on Delivery"];
  const orderStatuses = ["Completed", "Completed", "Completed", "Shipped", "Processing"];
  const orders = [];
  const now = new Date();
  let orderCounter = 1001;

  for (let dayOffset = 120; dayOffset >= 0; dayOffset--) {
    const targetDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    const dayOfWeek = targetDate.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const numOrdersToday = isWeekend ? (Math.floor(Math.random() * 3) + 2) : (Math.floor(Math.random() * 3) + 1);

    for (let k = 0; k < numOrdersToday; k++) {
      const customer = customerNames[Math.floor(Math.random() * customerNames.length)];
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let subtotal = 0;

      const weightedProductIndex = () => {
        const r = Math.random();
        if (r < 0.20) return 0; // PROD-001 (Titanium Eyeglasses)
        if (r < 0.40) return 10; // PROD-011 (BlueShield Gamer Glasses)
        if (r < 0.60) return 20; // PROD-021 (Onyx Bauhaus Watch)
        if (r < 0.75) return 21; // PROD-022 (Stealth Chronograph Watch)
        if (r < 0.88) return 1; // PROD-002 (Acetate Eyeglasses)
        return Math.floor(Math.random() * products.length);
      };

      for (let i = 0; i < numItems; i++) {
        const prod = products[weightedProductIndex()];
        const qty = Math.floor(Math.random() * 2) + 1;
        const sizeList = prod.sizes || ["Standard"];
        const size = sizeList[Math.floor(Math.random() * sizeList.length)];
        const colorName = prod.colorNames ? prod.colorNames[0] : "Pitch Black";

        orderItems.push({
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          category: prod.category,
          categoryName: prod.categoryName,
          price: prod.price,
          cost: prod.cost,
          quantity: qty,
          size: size,
          color: colorName,
          itemTotal: prod.price * qty
        });

        subtotal += prod.price * qty;
      }

      const shippingFee = subtotal >= 2000 ? 0 : 60;
      const discount = subtotal >= 5000 ? 500 : (subtotal >= 3000 ? 200 : 0);
      const totalAmount = subtotal + shippingFee - discount;
      const vatAmount = Math.round(totalAmount * 0.07);

      const orderDate = new Date(targetDate);
      orderDate.setHours(Math.floor(Math.random() * 14) + 9, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

      const orderId = `KM-${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}-${orderCounter++}`;
      const status = dayOffset > 3 ? "Completed" : orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

      orders.push({
        id: orderId,
        date: orderDate.toISOString(),
        customer: customer,
        items: orderItems,
        subtotal: subtotal,
        discount: discount,
        shippingFee: shippingFee,
        vatAmount: vatAmount,
        totalAmount: totalAmount,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status: status,
        notes: "สั่งซื้อผ่านเว็บไซต์ KIM Vision & Time Official Store",
        invoiceNo: `INV-${orderId.replace("KM-", "")}`
      });
    }
  }

  return orders;
}
