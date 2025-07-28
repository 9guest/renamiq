<p align="center">
   <img src="https://github.com/9guest/renamiq/blob/main/assets/renamiq.png?raw=true" alt="renamiq" width="200" height="200" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/9guest/renamiq" alt="License" />
   <img src="https://img.shields.io/github/package-json/v/9guest/renamiq" alt="Version" />
   <img src="https://img.shields.io/github/issues/9guest/renamiq" alt="Issues" />
   <img src="https://img.shields.io/github/actions/workflow/status/9guest/renamiq/build.yml?branch=main" alt="Build Status" />
   <img src="https://img.shields.io/github/stars/9guest/renamiq?style=social" alt="GitHub Stars" />
</p>

# 📂 Renamiq

**Renamiq** is a sleek and powerful desktop app built with Electron.js for **bulk renaming files** using custom patterns. Whether you're organizing photos, code files, or music tracks, Renamiq helps you rename with precision and flexibility.

---

## ✨ Features

### 🧩 **Powerful Pattern System**
- **50+ Built-in Tokens** for dynamic file naming
- **Real-time Preview** showing exactly how files will be renamed
- **Custom Patterns** with flexible token combinations
- **Sequential Numbering** with customizable padding and steps

### 🗂️ **File Management**
- **Drag & Drop Support** for easy file addition
- **Bulk File Selection** via file dialog
- **Folder Import** to add all files from a directory
- **Individual File Removal** from rename queue
- **File Size Display** with smart formatting

### ⚙️ **Advanced Options**
- **Configurable Start Index** and step increment
- **Number Padding** control (0-10 digits)
- **Extension Preservation** option
- **Undo Support** to revert rename operations

### 💼 **Template System**
- **Save Templates** as `.rnq` files for reuse
- **Load Templates** to quickly apply saved patterns
- **Export/Import** rename configurations

### 🎨 **Modern Interface**
- **Light & Dark Themes** with smooth transitions
- **Responsive Design** that adapts to window size
- **Clean, Intuitive UI** with modern aesthetics
- **Gradient Backgrounds** and subtle animations

### ⌨️ **Keyboard Shortcuts**
- **Menu Integration** with full keyboard navigation
- **Context-Sensitive Help** (F1 for tokens, F2 for about)
- **Quick Actions** for common operations

---

## 🚀 Quick Start

### Installation

1. **Download** the latest release for your platform:
   - Windows: `Renamiq-Setup-1.0.0.exe`
   - macOS: `Renamiq-1.0.0.dmg`
   - Linux: `Renamiq-1.0.0.AppImage`

2. **Install** and launch the application

### Basic Usage

1. **Add Files**: Drag & drop files or use "Add Files" button
2. **Create Pattern**: Use tokens like `{index}`, `{date}`, `{name}` in the pattern field
3. **Preview**: See how files will be renamed in real-time
4. **Rename**: Click "Rename All" to execute the operation

---

## 🧩 Token Reference

### **Basic Tokens**
| Token | Description | Example |
|-------|-------------|---------|
| `{index}` | Sequential number with padding | `01`, `02`, `03` |
| `{counter}` | Alias for {index} | `01`, `02`, `03` |
| `{original}` | Full original filename | `document.pdf` |
| `{name}` | Filename without extension | `document` |
| `{ext}` | File extension without dot | `pdf` |

### **Date & Time Tokens**
| Token | Description | Example |
|-------|-------------|---------|
| `{date}` | Current date (YYYY-MM-DD) | `2025-01-28` |
| `{time}` | Current time (HH-MM-SS) | `14-30-25` |
| `{year}` | Full year | `2025` |
| `{year2}` | 2-digit year | `25` |
| `{month}` | Month number (01-12) | `01` |
| `{month_name}` | Full month name | `January` |
| `{day}` | Day of month (01-31) | `28` |
| `{hour}` | 24-hour format (00-23) | `14` |
| `{minute}` | Minutes (00-59) | `30` |
| `{timestamp}` | Unix timestamp | `1738012345` |

### **File Information Tokens**
| Token | Description | Example |
|-------|-------------|---------|
| `{parent}` | Parent folder name | `Photos` |
| `{size}` | File size in bytes | `1024` |
| `{size_kb}` | File size in KB | `1` |
| `{size_mb}` | File size in MB | `0.001` |
| `{name_upper}` | Filename in uppercase | `DOCUMENT` |
| `{name_lower}` | Filename in lowercase | `document` |
| `{ext_upper}` | Extension in uppercase | `PDF` |

### **Random & Sequences**
| Token | Description | Example |
|-------|-------------|---------|
| `{random}` | Random alphanumeric string | `a7B9k` |
| `{uuid}` | UUID first segment | `f47ac10b` |
| `{alpha}` | Alphabetic sequence (A, B, C...) | `A`, `B`, `C` |
| `{roman}` | Roman numerals (I, II, III...) | `I`, `II`, `III` |
| `{hex}` | Hexadecimal sequence | `1`, `2`, `A` |
| `{binary}` | Binary sequence | `1`, `10`, `11` |

---

## 📝 Pattern Examples

### **Basic Renaming**

```
Pattern: Photo_{index} Result: Photo_01, Photo_02, Photo_03...
```

### **Date-based Organization**

```
Pattern: {date}_{name} Result: 2025-01-28_vacation, 2025-01-28_sunset...
```

### **Complex Patterns**

```
Pattern: IMG_{year}{month}{day}_{counter} Result: IMG_20250128_001, IMG_20250128_002...
```

### **File Size Information**

```
Pattern: {name}_{size_kb}KB Result: document_256KB, image_1024KB...
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+O` | Add Files |
| `Ctrl+Shift+O` | Add Folder |
| `Ctrl+Z` | Undo Rename |
| `Ctrl+Shift+C` | Clear All |
| `Ctrl+S` | Save Template |
| `Ctrl+L` | Load Template |
| `F1` | Show Help (Tokens) |
| `Shift+F1` | Show Help (Examples) |
| `Ctrl+Shift+K` | Show Keyboard Shortcuts |
| `F2` | About Renamiq |
| `Alt` | Show Application Menu |
| `Escape` | Close Modal/Help |

---

## 🛠️ Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/9guest/renamiq.git
cd renamiq

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### Project Structure

```
renamiq/
├── main.js           # Electron main process
├── preload.js        # Secure IPC bridge
├── renderer/
│   └── index.html    # UI and application logic
├── assets/           # Icons and images
├── package.json      # Dependencies and build config
└── README.md         # This file
```

### Building Executables

```
# Build for current platform
npm run build

# Build for specific platforms
npm run build-win    # Windows
npm run build-mac    # macOS
npm run build-linux  # Linux
```

---

## 🎯 Use Cases

### Photography Organization

- Rename camera files with date and sequence numbers

- Add location or event information to filenames

- Organize by shooting date and time

### Document Management

- Add creation dates to scanned documents

- Standardize naming conventions across file types

- Include file size information for archival

### Development Projects

- Rename source files with consistent patterns

- Add version numbers or build timestamps

- Organize assets by type and usage

### Media Collection

- Rename music files with artist and track info

- Add episode numbers to video files

- Organize by genre, year, or album

---

## 🔐 Security & Privacy

- No Internet Required - Renamiq works completely offline

- Local Processing - All file operations happen on your machine

- No Data Collection - We don't track or store any user data

- Safe Operations - Undo functionality protects against mistakes

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

Development Guidelines

1. Fork the repository

2. Create a feature branch (`git checkout -b feature/amazing-feature`)

3. Commit your changes (`git commit -m 'Add some amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)

5. Open a Pull Request

--- 

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with Electron.js

- Icons from various open source collections

- Inspired by the need for a modern, powerful file renaming tool

---

## 📞 Support

- Issues: [GitHub Issues](https://github.com/9guest/renamiq/issues)

- Discussions: [GitHub Discussions](https://github.com/9guest/renamiq/discussions)

- ~~Email: Contact Developer~~

--- 

<p align="center"> Made with ❤️ by <a href="https://github.com/9guest">kyuguest (夜城)</a> </p> 
<p align="center"> <a href="https://github.com/9guest/renamiq/stargazers">⭐ Star this project if you find it useful!</a> </p>