# NearLoop 在地二手交易平台 v2

NearLoop 是一個在地化二手物品交易平台第一版網站原型，主打步行可達、純面交、模糊定位與 QR Code 完成交易。

## 功能

- 會員登入：前端可操作登入、登出與 localStorage session
- 聚合式搜尋：關鍵字、步行時間、方圓距離、價格區間
- 商品瀏覽：分類、商品卡片、商品詳情、賣家評分
- 隱私位置：前台只顯示概略區域與模糊範圍
- 站內聊天：快捷訊息與照片入口示意
- 交易確認：QR Code 完成交易並更新狀態
- 賣家刊登：多張商品照片上傳、預覽、主圖、刪除與表單驗證
- 管理後台：上架物件、售出、檢舉、500 會員檔案容量規劃與治理規則

## 測試帳號

```text
buyer@nearloop.test / 123456
seller@nearloop.test / 123456
admin@nearloop.test / admin123
```

## 第二版新增規格

- 初期以 500 會員規模預留約 35 GB 物件儲存。
- 商品照片限制單件最多 8 張，正式後端建議轉 WebP 並移除 EXIF。
- 檔案路徑規劃採 `userId/listingId/type/uuid`，避免暴露個資。
- 公開商品圖走 CDN；私人聊天圖與檢舉附件改用短效簽名 URL。
- 資料庫只保存檔案 metadata、hash、owner、visibility 與保存期限。

## 本機執行

```bash
npm install
npm run dev
```

開啟瀏覽器：

```text
http://localhost:5173/
```

## 建置

```bash
npm run build
```
