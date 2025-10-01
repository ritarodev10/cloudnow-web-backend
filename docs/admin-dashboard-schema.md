# 📦 Strapi Content Model – CloudNow Web Backend

---

## 📁 Collection Types

### 📰 Article

- `title`: string (required)
- `slug`: uid (from title, required, unique)
- `excerpt`: text (optional)
- `content`: richtext (required)
- `coverImage`: media (single, required)
- `gallery`: media (multiple, optional)
- `category`: relation → many-to-one → Category
- `tags`: relation → many-to-many → Tag
- `author`: relation → many-to-one → Author
- `readingTime`: integer (optional)
- `featured`: boolean (optional)
- `pinnedUntil`: datetime (optional)
- `canonicalUrl`: string (optional)
- `seo`: component → shared.seo
- `publishedAt`: datetime (auto, via Draft & Publish)

---

### 📂 Category

- `name`: string (required)
- `slug`: uid (from name, required, unique)
- `description`: text (optional)
- `parent`: relation → one-to-one (self)
- `order`: integer (optional)

---

### 🏷️ Tag

- `name`: string (required)
- `slug`: uid (from name, required, unique)

---

### ✍️ Author

- `displayName`: string (required)
- `slug`: uid (from displayName, required, unique)
- `bio`: richtext (optional)
- `avatar`: media (single, optional)
- `socialLinks`: component → shared.social-links
- `user`: relation → one-to-one → plugin::users-permissions.user (optional)

---

## ⚙️ Single Type

### 🛠️ Site Settings

- `siteName`: string
- `siteDescription`: text
- `defaultSeo`: component → shared.seo
- `blogPageHero`: component → shared.hero
- `socialLinks`: component → shared.social-links

---

## 🧩 Components

### 🧠 shared.seo

- `metaTitle`: string (optional)
- `metaDescription`: text (optional)
- `ogImage`: media (single, optional)

---

### 🔗 shared.social-links

- `website`: string (optional)
- `twitter`: string (optional)
- `instagram`: string (optional)
- `linkedin`: string (optional)
- `github`: string (optional)

---

### 🎯 shared.hero

- `title`: string (optional)
- `subtitle`: string (optional)
- `image`: media (single, optional)

---

## 🔐 Relations Summary

- **Article**

  - many → one → Category
  - many ↔ many → Tag
  - many → one → Author

- **Author**

  - one → one → User (Users & Permissions plugin)

- **Category**
  - one → one (self) → Category (parent)

---

## ✅ Draft & Publish Enabled

- Article ✅
- Category ✅
- Tag ✅
- Author ✅
- Site Settings ✅

---
