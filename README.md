# Next.js AI Document Editor

A powerful, modern document editor built with **Next.js 16**, designed to provide a Microsoft Word-like experience enhanced with cutting-edge AI capabilities and a superior user interface. This project combines a robust rich text editor (Tiptap) with advanced features like an Immersive Reader, AI media generation, and comprehensive internationalization.

## 🚀 Key Features

### 📝 Advanced Document Editing
*   **Rich Text Editor**: Powered by **Tiptap**, supporting advanced tables, images, task lists, code blocks, and more.
*   **Professional Layout**: Visual page breaks, print layout view, and a feature-rich **Ribbon interface** familiar to Office users.
*   **Drag & Drop**: Fully draggable and resizable elements including images, tables, and charts with intuitive handles.
*   **Math & Charts**: Integrated support for KaTeX math equations (`react-katex`) and dynamic charts (`recharts`).

### 🧠 AI & Smart Features
*   **AI Media Studio**: Generate images and videos directly within the editor using **Google Gemini** integration.
*   **Immersive Reader**: A dedicated accessibility mode featuring:
    *   Text-to-speech with adjustable speed.
    *   Line focus and picture dictionary.
    *   Grammar highlighting (Nouns, Verbs, Adjectives).
*   **Smart Translation**: Seamless translation of UI and content across global languages.

### 🌍 Internationalization (i18n)
*   **Multi-language Support**: Full support for English, Arabic (RTL), French, Japanese, Chinese, and German.
*   **Dynamic Routing**: Built with `next-intl` for localized routing (e.g., `/en/editor`, `/ar/editor`).

### 💾 File Operations & Cloud
*   **Import/Export**: extensive support for `.docx` (via `mammoth`/`docx`), `.pdf`, `.md`, and `.txt` files.
*   **Cloud Storage**: Integrated with **Supabase** for secure document storage and retrieval.
*   **PDF Handling**: PDF viewing and manipulation using `pdfjs-dist`.

### 🎨 Modern UI/UX
*   **Design System**: Built with **Tailwind CSS v4** and **Radix UI** for accessible, stunning components.
*   **Animations**: Fluid interactions powered by **Framer Motion**.
*   **Iconography**: Sharp, modern icons from **Lucide React** and **Iconsax**.

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS 4, CSS Variables
*   **Editor Engine**: Tiptap (Pro extensions & custom plugins)
*   **Backend/DB**: Supabase
*   **Utilities**: `date-fns`, `emoji-mart`, `clsx`, `tailwind-merge`

## 🏁 Getting Started

### Prerequisites
*   Node.js 18.17+ 
*   npm, yarn, or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd next-js-example
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and configure your keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

*   `app/[locale]`: Application routes localized for i18n.
    *   `/editor`: The main document editing interface.
    *   `/auth`: Authentication pages.
*   `components`: Reusable UI components.
    *   `/ImmersiveReader`: Logic and UI for the immersive reading experience.
*   `messages`: Translation files (`en.json`, `ar.json`, etc.).
*   `lib`: Utility functions and API clients.
*   `hooks`: Custom React hooks for state and logic.

## 🤝 Contributing

Contributions are welcome! This is an active project exploring the future of web-based document editing.

---
*Built with ❤️ using Next.js and Agentic AI.*
