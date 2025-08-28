# 📸 React Cloudinary Image Gallery


A modern React-based image gallery that allows users to upload and preview images using **Cloudinary**, with no backend required. Users can provide their own Cloudinary credentials for secure and isolated uploads.

## 🚀 Features

- 🔐 User-provided Cloudinary Cloud Name and Upload Preset
- 📤 Upload images directly to Cloudinary
- 🖼️ Real-time image previews before upload
- 🗂️ Two-tab interface: Upload and Gallery
- 🧱 Responsive image grid view
- 🔗 Click to enlarge and copy image URL
- 💾 Remembers user credentials via localStorage


---

## 🧠 Tech Stack

- **React** (Vite or CRA)
- **Cloudinary Upload API**
- **React Router DOM**
- **Axios**
- **Tailwind CSS** (or plain CSS)
- Optional: `react-copy-to-clipboard` for link copying

---

## 🔧 Setup Instructions

1. **Clone this repo**
```bash
   git clone https://github.com/omeshapasan2/Cloudinary-Gallery-App.git
```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   or for Create React App:

   ```bash
   npm start
   ```

---

## 🌩️ How to Use Cloudinary

1. **Sign up** at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings → Upload**
3. Create an **Upload Preset**

   * Set it to **unsigned**
   * Configure any optional upload parameters
4. Get your:

   * **Cloud Name**
   * **Upload Preset Name**

You'll input these into the app before uploading images.

---

## 🗃️ Project Structure

```
/src
  /components
    Upload.js
    Gallery.js
    ImageCard.js
    NavTabs.js
  App.js
  index.js
```

---

## 💡 Future Features

* 🔄 Drag & drop upload (via react-dropzone)
* 🌓 Dark mode toggle
* 🏷️ Tag images and search by tags
* 📁 Folder support via Cloudinary’s `public_id`
* 🔐 Backend option for signed uploads (Node.js)

---

## 📄 License

MIT License

---

## 🤝 Contributions

Feel free to fork, improve, and make a pull request. PRs are welcome!

---

## 📬 Contact

Made by [Omesha Pasan](https://portfolio.omeshapasan.site) — feel free to reach out!

