import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bell,
  Camera,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Flag,
  Heart,
  Home,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  UserRound,
  Footprints,
  X
} from "lucide-react";
import "./styles.css";

const categories = [
  "全部",
  "數位電子",
  "居家生活",
  "運動休閒",
  "親子用品",
  "服飾配件",
  "書籍文具",
  "工具借用"
];

const quickMessages = [
  "請問方便約什麼時候？",
  "可以在附近捷運站面交嗎？",
  "物品狀況跟照片一致嗎？",
  "我已經到了喔！"
];

const initialListings = [
  {
    id: 1,
    title: "九成新折疊腳踏車",
    category: "運動休閒",
    price: 2800,
    original: 5200,
    walk: 9,
    distance: 0.9,
    area: "大安森林公園周邊",
    seller: "Mina",
    rating: 4.9,
    sold: 18,
    status: "available",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
    tags: ["可試騎", "面交限定", "低碳推薦"],
    description: "平日通勤用，車況穩定，附車燈與密碼鎖。位置只顯示概略區域，約定後再提供面交點。"
  },
  {
    id: 2,
    title: "IKEA 小茶几 淺木色",
    category: "居家生活",
    price: 650,
    original: 1290,
    walk: 6,
    distance: 0.6,
    area: "信義安和站附近",
    seller: "Aaron",
    rating: 4.8,
    sold: 27,
    status: "reserved",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a694?auto=format&fit=crop&w=900&q=80",
    tags: ["保留中", "需自取", "方圓200m模糊定位"],
    description: "桌面有輕微使用痕跡，不影響使用。適合小套房或陽台。"
  },
  {
    id: 3,
    title: "Switch 健身環與收納盒",
    category: "數位電子",
    price: 1450,
    original: 2600,
    walk: 14,
    distance: 1.4,
    area: "台電大樓生活圈",
    seller: "Yu",
    rating: 5.0,
    sold: 9,
    status: "available",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=900&q=80",
    tags: ["可議價", "今晚可面交"],
    description: "完整盒裝，配件齊全。站內聊天確認時間，不交換私人聯絡方式。"
  },
  {
    id: 4,
    title: "兒童滑步車 2-5歲",
    category: "親子用品",
    price: 900,
    original: 1880,
    walk: 18,
    distance: 1.9,
    area: "國父紀念館周邊",
    seller: "Chloe",
    rating: 4.7,
    sold: 12,
    status: "available",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80",
    tags: ["親子友善", "公園面交"],
    description: "車身輕，輪胎正常。建議白天在公園入口面交檢查。"
  },
  {
    id: 5,
    title: "露營摺疊椅兩張",
    category: "運動休閒",
    price: 760,
    original: 1600,
    walk: 4,
    distance: 0.35,
    area: "六張犁站附近",
    seller: "Ben",
    rating: 4.6,
    sold: 31,
    status: "available",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
    tags: ["步行5分鐘內", "免物流"],
    description: "一組兩張，布面乾淨。附近巷口即可交付。"
  },
  {
    id: 6,
    title: "Bosch 電鑽短期借用",
    category: "工具借用",
    price: 120,
    original: 0,
    walk: 12,
    distance: 1.2,
    area: "科技大樓站周邊",
    seller: "Liu",
    rating: 4.9,
    sold: 44,
    status: "available",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80",
    tags: ["未來擴充", "社區工具", "押金面議"],
    description: "規格書未來路線的社區借用功能示範。可借一天，需現場確認功能。"
  }
];

function App() {
  const [listings, setListings] = useState(initialListings);
  const [selected, setSelected] = useState(initialListings[0]);
  const [activeTab, setActiveTab] = useState("market");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [walk, setWalk] = useState(20);
  const [radius, setRadius] = useState(5);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { by: "seller", text: "您好，這件目前還在，可以約公開地點面交。" },
    { by: "buyer", text: "我想今晚 7 點後看看，方便嗎？" }
  ]);

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const keywordMatch =
        !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.includes(query) ||
        item.tags.some((tag) => tag.includes(query));
      const categoryMatch = category === "全部" || item.category === category;
      const walkMatch = item.walk <= Number(walk);
      const radiusMatch = item.distance <= Number(radius);
      const minMatch = !minPrice || item.price >= Number(minPrice);
      const maxMatch = !maxPrice || item.price <= Number(maxPrice);
      return keywordMatch && categoryMatch && walkMatch && radiusMatch && minMatch && maxMatch;
    });
  }, [listings, query, category, walk, radius, minPrice, maxPrice]);

  const soldCount = listings.filter((item) => item.status === "sold").length;
  const availableCount = listings.filter((item) => item.status === "available").length;

  const markSold = () => {
    setListings((items) =>
      items.map((item) => (item.id === selected.id ? { ...item, status: "sold" } : item))
    );
    setSelected((item) => ({ ...item, status: "sold" }));
  };

  const sendQuick = (text) => {
    setChatMessages((messages) => [...messages, { by: "buyer", text }]);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="開啟選單">
          <Menu size={20} />
        </button>
        <div className="brand" onClick={() => setActiveTab("market")}>
          <span className="brand-mark"><PackageCheck size={22} /></span>
          <span>NearLoop</span>
        </div>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <button className="icon-button nav-close mobile-only" onClick={() => setMenuOpen(false)} aria-label="關閉選單">
            <X size={20} />
          </button>
          <button className={activeTab === "market" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("market")}>
            <Home size={17} /> 探索
          </button>
          <button className={activeTab === "sell" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("sell")}>
            <Plus size={17} /> 我要刊登
          </button>
          <button className={activeTab === "chat" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("chat")}>
            <MessageCircle size={17} /> 訊息
          </button>
          <button className={activeTab === "admin" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("admin")}>
            <LayoutDashboard size={17} /> 後台
          </button>
        </nav>
        <div className="top-actions">
          <button className="icon-button" aria-label="通知"><Bell size={19} /></button>
          <button className="profile-button"><UserRound size={18} /> 會員</button>
        </div>
      </header>

      {activeTab === "market" && (
        <>
          <section className="hero">
            <div className="hero-media" aria-hidden="true"></div>
            <div className="hero-content">
              <p className="eyebrow"><Sparkles size={16} /> 社區裡的低碳循環市集</p>
              <h1>找得到附近好物，也走得到面交地點。</h1>
              <p className="hero-copy">用步行時間、方圓距離與預算一次搜尋，商品位置只顯示模糊區域，保留交易便利也保護住家隱私。</p>
              <SearchPanel
                query={query}
                setQuery={setQuery}
                walk={walk}
                setWalk={setWalk}
                radius={radius}
                setRadius={setRadius}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />
            </div>
          </section>

          <main className="main-grid">
            <aside className="filters">
              <div className="filter-title"><SlidersHorizontal size={18} /> 篩選</div>
              <label>
                分類
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((cat) => <option key={cat}>{cat}</option>)}
                </select>
              </label>
              <label>
                步行時間：{walk} 分鐘內
                <input type="range" min="5" max="20" step="5" value={walk} onChange={(event) => setWalk(event.target.value)} />
              </label>
              <label>
                方圓距離：{radius} 公里內
                <input type="range" min="0.5" max="20" step="0.5" value={radius} onChange={(event) => setRadius(event.target.value)} />
              </label>
              <div className="privacy-note">
                <ShieldCheck size={18} />
                <span>前台只顯示約 200 公尺模糊圈，不公開精準座標。</span>
              </div>
            </aside>

            <section className="content-area">
              <div className="section-head">
                <div>
                  <p className="eyebrow dark">Nearby picks</p>
                  <h2>附近可面交物件</h2>
                </div>
                <span className="result-count">{filtered.length} 件符合條件</span>
              </div>
              <CategoryRail category={category} setCategory={setCategory} />
              <div className="listing-grid">
                {filtered.map((item) => (
                  <ListingCard key={item.id} item={item} selected={selected.id === item.id} onClick={() => setSelected(item)} />
                ))}
              </div>
            </section>

            <DetailPanel selected={selected} setActiveTab={setActiveTab} markSold={markSold} />
          </main>

          <section className="trust-band">
            <div><Footprints size={24} /><strong>步行優先</strong><span>5/10/15/20 分鐘快速搜尋</span></div>
            <div><MapPin size={24} /><strong>模糊定位</strong><span>只顯示概略路段與生活圈</span></div>
            <div><QrCode size={24} /><strong>QR 完成交割</strong><span>掃碼後自動售出下架</span></div>
            <div><ShieldCheck size={24} /><strong>不碰物流金流</strong><span>平台聚焦純面交與信任紀錄</span></div>
          </section>
        </>
      )}

      {activeTab === "chat" && (
        <ChatView selected={selected} messages={chatMessages} quickMessages={quickMessages} sendQuick={sendQuick} />
      )}

      {activeTab === "sell" && (
        <SellView categories={categories.filter((cat) => cat !== "全部")} />
      )}

      {activeTab === "admin" && (
        <AdminView availableCount={availableCount} soldCount={soldCount} listings={listings} />
      )}
    </div>
  );
}

function SearchPanel(props) {
  const {
    query,
    setQuery,
    walk,
    setWalk,
    radius,
    setRadius,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice
  } = props;

  return (
    <div className="search-panel">
      <label className="search-field keyword">
        <span>要找什麼</span>
        <div><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="棒球手套、腳踏車、電鑽..." /></div>
      </label>
      <label className="search-field">
        <span>交通時間</span>
        <div><Clock3 size={18} /><select value={walk} onChange={(event) => setWalk(event.target.value)}><option value="5">步行 5 分鐘</option><option value="10">步行 10 分鐘</option><option value="15">步行 15 分鐘</option><option value="20">步行 20 分鐘</option></select><ChevronDown size={16} /></div>
      </label>
      <label className="search-field">
        <span>距離</span>
        <div><MapPin size={18} /><select value={radius} onChange={(event) => setRadius(event.target.value)}><option value="0.5">方圓 500m</option><option value="1">方圓 1km</option><option value="5">方圓 5km</option><option value="20">方圓 20km</option></select><ChevronDown size={16} /></div>
      </label>
      <label className="search-field price-field">
        <span>價格區間</span>
        <div>
          <CircleDollarSign size={18} />
          <input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} inputMode="numeric" placeholder="最低" />
          <input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} inputMode="numeric" placeholder="最高" />
        </div>
      </label>
      <button className="primary-button"><Search size={18} /> 搜尋</button>
    </div>
  );
}

function CategoryRail({ category, setCategory }) {
  return (
    <div className="category-rail">
      {categories.map((cat) => (
        <button key={cat} className={category === cat ? "chip selected" : "chip"} onClick={() => setCategory(cat)}>
          {cat}
        </button>
      ))}
    </div>
  );
}

function ListingCard({ item, selected, onClick }) {
  return (
    <article className={selected ? "listing-card selected" : "listing-card"} onClick={onClick}>
      <div className="image-wrap">
        <img src={item.image} alt={item.title} />
        <button className="heart-button" aria-label="收藏"><Heart size={17} /></button>
        {item.status !== "available" && <span className={`status ${item.status}`}>{item.status === "sold" ? "已售出" : "保留中"}</span>}
      </div>
      <div className="card-body">
        <div className="card-meta">{item.category} · {item.area}</div>
        <h3>{item.title}</h3>
        <div className="price-line">
          <strong>NT$ {item.price.toLocaleString()}</strong>
          {item.original > 0 && <span>原價 NT$ {item.original.toLocaleString()}</span>}
        </div>
        <div className="distance-line">
          <span><Footprints size={15} /> {item.walk} 分鐘</span>
          <span><MapPin size={15} /> {item.distance} km</span>
        </div>
      </div>
    </article>
  );
}

function DetailPanel({ selected, setActiveTab, markSold }) {
  return (
    <aside className="detail-panel">
      <img className="detail-image" src={selected.image} alt={selected.title} />
      <div className="detail-content">
        <div className="seller-line">
          <span className="avatar">{selected.seller[0]}</span>
          <div><strong>{selected.seller}</strong><span><Star size={14} /> {selected.rating} · 成功 {selected.sold} 次</span></div>
        </div>
        <h2>{selected.title}</h2>
        <div className="detail-price">NT$ {selected.price.toLocaleString()}</div>
        <p>{selected.description}</p>
        <div className="tag-list">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="blur-map">
          <div className="pulse"></div>
          <strong>{selected.area}</strong>
          <span>顯示模糊範圍，非賣家精準地址</span>
        </div>
        <div className="detail-actions">
          <button className="primary-button wide" onClick={() => setActiveTab("chat")}><MessageCircle size={18} /> 站內聊聊</button>
          <button className="secondary-button wide" onClick={markSold}><QrCode size={18} /> 模擬 QR 完成交易</button>
        </div>
      </div>
    </aside>
  );
}

function ChatView({ selected, messages, quickMessages, sendQuick }) {
  return (
    <main className="page-view chat-page">
      <section className="chat-shell">
        <div className="chat-sidebar">
          <p className="eyebrow dark">In-app chat</p>
          <h1>站內隱私通訊</h1>
          <p>買賣雙方不需要交換手機、LINE 或地址。確認面交點前，只保留概略區域。</p>
          <div className="chat-list-item active"><img src={selected.image} alt="" /><div><strong>{selected.title}</strong><span>{selected.seller} · {selected.area}</span></div></div>
        </div>
        <div className="chat-window">
          <div className="chat-header">
            <div><strong>{selected.seller}</strong><span>{selected.title}</span></div>
            <button className="secondary-button"><Flag size={16} /> 檢舉</button>
          </div>
          <div className="messages">
            {messages.map((message, index) => (
              <div key={`${message.text}-${index}`} className={`message ${message.by}`}>{message.text}</div>
            ))}
          </div>
          <div className="quick-replies">
            {quickMessages.map((message) => <button key={message} onClick={() => sendQuick(message)}>{message}</button>)}
          </div>
          <div className="composer">
            <button className="icon-button" aria-label="傳照片"><Camera size={19} /></button>
            <input placeholder="輸入訊息..." />
            <button className="primary-button">送出</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function SellView({ categories }) {
  return (
    <main className="page-view">
      <section className="sell-layout">
        <div>
          <p className="eyebrow dark">Snap-sell</p>
          <h1>快速刊登附近物件</h1>
          <p>第一版示範 Carousell 式拍照刊登流程，並加入本平台的面交限定、模糊定位與 QR 完成交易欄位。</p>
          <div className="upload-box">
            <Camera size={34} />
            <strong>拖曳或拍攝商品照片</strong>
            <span>最多 8 張，首圖會出現在搜尋結果</span>
          </div>
        </div>
        <form className="sell-form">
          <label>商品名稱<input placeholder="例如：九成新折疊腳踏車" /></label>
          <label>分類<select>{categories.map((cat) => <option key={cat}>{cat}</option>)}</select></label>
          <label>價格 NT$<input inputMode="numeric" placeholder="2800" /></label>
          <label>概略位置<input placeholder="例如：大安森林公園周邊" /></label>
          <label>面交規則<textarea placeholder="只能公開地點面交；不提供物流與線上金流。" /></label>
          <div className="form-checks">
            <label><input type="checkbox" defaultChecked /> 顯示 200m 模糊圈</label>
            <label><input type="checkbox" defaultChecked /> 交易完成需 QR 掃碼</label>
            <label><input type="checkbox" defaultChecked /> 不啟用物流與線上付款</label>
          </div>
          <button type="button" className="primary-button wide"><Check size={18} /> 預覽刊登</button>
        </form>
      </section>
    </main>
  );
}

function AdminView({ availableCount, soldCount, listings }) {
  return (
    <main className="page-view">
      <section className="admin-layout">
        <div>
          <p className="eyebrow dark">Admin console</p>
          <h1>管理員後台</h1>
        </div>
        <div className="metric-grid">
          <div><strong>{availableCount}</strong><span>上架物件</span></div>
          <div><strong>{soldCount}</strong><span>已售出</span></div>
          <div><strong>3</strong><span>待審檢舉</span></div>
          <div><strong>98.6%</strong><span>面交完成率</span></div>
        </div>
        <div className="admin-table">
          <div className="table-row table-head"><span>物件</span><span>分類</span><span>狀態</span><span>位置</span><span>動作</span></div>
          {listings.map((item) => (
            <div className="table-row" key={item.id}>
              <span>{item.title}</span>
              <span>{item.category}</span>
              <span>{item.status === "available" ? "上架" : item.status === "sold" ? "售出" : "保留"}</span>
              <span>{item.area}</span>
              <span><button>審查</button></span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
