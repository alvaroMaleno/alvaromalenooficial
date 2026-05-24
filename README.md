# Alvaro Maleno Official Website

This repository contains the source code and content for the official website of Álvaro Maleno.

## 1. Getting Started

This project is a modern Single Page Application (SPA) built **without any build tools** (no Node.js, Webpack, Vite, or npm dependencies). It relies entirely on native browser features such as ES Modules (`<script type="module">`).

To run the application locally, you only need to serve the directory with a static file server.

**Using Python:**
```bash
# From the root of the project
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

**Using VSCode:**
If you use Visual Studio Code, you can install the "Live Server" extension. Just right-click on `index.html` and select "Open with Live Server".

## 2. Maintenance Guide

The site's content is completely decoupled from the application logic. It uses Markdown (`.md`) files for the actual text and a central JSON file for indexing.

### How to add new content
1. **Create the Markdown files**: Place your new content inside the `content/` folder, structured by section and id. For example, `content/articulos/mi-nuevo-articulo.es.md` and `content/articulos/mi-nuevo-articulo.en.md` for bilingual support.
2. **Register the content in the Index**: Open `content/index.json` and add a new entry to the JSON array. This is what the application reads to list available posts.

**Example of an entry in `index.json`:**
```json
{
  "id": "mi-nuevo-articulo",
  "section": "articulos",
  "date": "2026-05-24",
  "is_multipage": false,
  "es": {
    "title": "Mi Nuevo Artículo",
    "excerpt": "Un breve resumen del artículo para mostrar en la lista."
  },
  "en": {
    "title": "My New Article",
    "excerpt": "A short summary of the article to display in the list."
  }
}
```

## 3. Technologies Used

- **Vue 3 (via CDN)**: The core reactive UI framework. Instead of compiling `.vue` Single-File Components, this project uses plain JavaScript files that export Vue options objects, utilizing native browser reactivity.
- **Vue Router (via CDN)**: Handles Client-Side Routing to navigate between sections without reloading the page.
- **Native ES Modules**: The browser's native `import` and `export` statements are used to structure the code, avoiding the need for a bundler.
- **Vanilla CSS**: All styling is done through plain CSS (`styles.css`), keeping the project lightweight.
- **Markdown / marked.js**: Used to fetch, parse, and render the text files securely into HTML.

## 4. Architecture Overview

*(Intended for Software/Backend Engineers unfamiliar with Frontend)*

This project implements a strict **Layered Architecture** (similar to MVC or Clean Architecture), adapted for a frontend SPA. Because there is no build step or node environment, everything is structured using pure JavaScript.

### Layers:
1. **Models (Domain Layer)**: Located in `src/models/`. These are pure JavaScript classes (`Content`, `Multimedia`, `PaginationState`). They encapsulate business entities, state, and domain logic completely independent of the UI framework. They make use of inheritance and factories.
2. **Services (Application/Infrastructure Layer)**: Located in `src/services/`. Classes like `ContentService` and `MarkdownService` act as singletons. They handle external I/O (fetching JSON indexes and Markdown files), apply complex logic (like text pagination splitting), and instantiate Domain Models. Services are provided globally to the application via Dependency Injection.
3. **Views & Components (Presentation Layer)**: Located in `src/views/` and `src/components/`. Vue 3 orchestrates this layer. Views inject the necessary Services to fetch Models, and automatically render the UI reactively based on the Models' state.
4. **Router**: Located in `src/router/`. Maps URL paths to specific Views.

This separation of concerns ensures that the application is highly testable, maintainable, and that business logic is completely isolated from UI rendering.

## 5. Class Diagrams

Below is the class diagram showing the core domain models and services, utilizing Mermaid syntax.

```mermaid
classDiagram
    %% Base Content and Inheritance
    class Content {
        +String id
        +String section
        +String date
        +Boolean is_multipage
        +String title
        +String excerpt
    }
    class MultipageContent {
        +Array chapters
    }
    class Book
    class Story
    class Article
    class Poem
    class Reflection {
        +String quote
        +String quote_author
        +String quote_image
    }

    Content <|-- MultipageContent
    Content <|-- Poem
    Content <|-- Reflection
    MultipageContent <|-- Book
    MultipageContent <|-- Story
    MultipageContent <|-- Article

    %% Multimedia Models
    class MultimediaContent {
        +String src
    }
    class Video {
        +Boolean isVideo
    }
    class Image {
        +Boolean isImage
    }
    MultimediaContent <|-- Video
    MultimediaContent <|-- Image

    %% State Management
    class PaginationState {
        +Array pages
        +Int currentPageIndex
        +Int currentChapterIdx
        +Int currentPartIdx
        +Boolean isFirstPageOfPart
        +Boolean isLastPageOfPart
        +resetPages(pages)
        +nextPage()
        +prevPage()
    }

    %% Services
    class ContentService {
        +Ref posts
        +loadPosts()
        +getLatestPosts(lang)
        +getPostsBySection(section, lang)
        +getPostById(id, lang)
    }

    class MarkdownService {
        +Int MAX_WORDS_PER_PAGE
        +fetchAndProcess(url)
        +splitIntoPages(markdownText)
    }

    %% Relationships
    ContentService ..> Content : Factory creates
    MarkdownService ..> PaginationState : Used for splitting
```
