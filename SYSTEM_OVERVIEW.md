# System Overview & Architecture

## 1. Executive Summary

**Product Name:** DoryAI
**Goal:** To be the ultimate personal knowledge base for links and short content.
**Core Value Proposition:**

- **Save from Anywhere:** Instantly save links via the Web App or by forwarding them to a WhatsApp bot.
- **Smart Organization:** AI automatically analyzes, categorizes, titles, and tags every saved link.
- **Interactive Knowledge:** Users can chat with their saved content using an AI assistant that understands their context.

## 2. High-Level Architecture

The system consists of three main components that share a central database (Convex).

```mermaid
graph TD
    subgraph "Frontend (Web App)"
        WebApp[Next.js App]
        ConvexClient[Convex Client]
        Auth[Clerk Auth]
    end

    subgraph "Backend Services"
        Express[Express Server]
        WhatsApp[Official WhatsApp Cloud API]
        MediaProc[Media Processing (FFmpeg/YTDLP)]
    end

    subgraph "Data & Logic"
        ConvexDB[(Convex Database)]
        ConvexActions[Convex Actions (Serverless)]
    end

    subgraph "External AI"
        Gemini[Google Gemini 1.5/2.0]
    end

    %% Connections
    WebApp -->|Reads/Writes| ConvexClient
    ConvexClient -->|Syncs| ConvexDB
    ConvexClient -->|Triggers| ConvexActions
    ConvexActions -->|Calls| Gemini

    WhatsApp -->|Webhook| Express
    Express -->|Queries/Mutates| ConvexDB
    Express -->|Deep Analysis| MediaProc
    Express -->|Calls| Gemini
```

### Key Components

1.  **Web App (`web-app`)**: The user-facing dashboard and chat interface.
2.  **Backend (`backend`)**: A dedicated Node.js/Express server for heavy lifting, specifically WhatsApp integration and complex media processing.
3.  **Database (`convex`)**: True serverless backend acting as the single source of truth for data and real-time syncing.

---

## 3. Web Application (`web-app`)

The Web App is a modern Next.js 14 application providing the primary interface for users to manage their links and interact with AI.

**Technical Stack:**

- **Framework:** Next.js (App Router)
- **UI Provider:** Shadcn UI + Tailwind CSS
- **State Management:** Convex React Query (Real-time updates without manual refetching)
- **Authentication:** Clerk (integrated with Convex)
- **AI Integration:** Vercel AI SDK + Google Gemini (via Convex Actions)

**Key Features & Implementation:**

- **Dashboard & Link Grid:** Displays categorized links. Uses `useCategories` hooks to subscribe to real-time data changes in Convex.
- **Chat Interface (`Chat.tsx`)**:
  - Direct integration with Convex Actions (`api.ai.processChatMessage`).
  - **No Backend Server dependency**: The chat allows users to talk to the AI directly through Convex's serverless infrastructure.
  - **RAG (Retrieval Augmented Generation)**: The AI Action fetches user's categories, tags, and recent links to provide context-aware answers.
- **Phone Verification:** Custom generic component to link phone numbers for future WhatsApp integration.

---

## 4. Backend Service (`backend`)

The Backend is a robust Express.js server designed to handle asynchronous, long-running, or external integration tasks that fit better outside a serverless function.

**Technical Stack:**

- **Runtime:** Node.js
- **Server:** Express.js
- **Database Access:** Convex (via `convex` npm client)
- **Integrations:** Official WhatsApp Cloud API, Google GenAI SDK.

**Core Responsibilities:**

1.  **WhatsApp Bot Integration:**
    - Receives messages via Webhooks from **Official WhatsApp Cloud API**.
    - Identifies the user via phone number (matched against `profiles` in Convex).
    - **Dual AI Implementation**: Implements its own `processChatMessage` logic (in `ai.service.ts`) to handle WhatsApp conversations locally without depending on the frontend's running state.
    - **Link Saving**: When a URL is shared on WhatsApp, the backend performs "Deep Analysis" (fetching metadata, optionally downloading video/transcripts) and saves it to Convex.
2.  **Media Processing**:
    - Uses `ytdlp-nodejs` and `fluent-ffmpeg` to download and process content from social platforms (Instagram, TikTok) to generate rich previews and transcripts for the AI to understand.

---

## 5. Data Model (Convex)

The schema in `convex/schema.ts` defines the application's brain.

- **`users`**: Core identity.
- **`links`**: The main data entity. Contains `url`, `title`, `description`, `content` (transcripts), and relations to categories.
- **`categories` / `subCategories`**: Hierarchical organization structure.
- **`tags` / `linkTags`**: flexible tagging system.
- **`chatSessions` / `chatMessages`**: Stores conversation history for both Web Chat and WhatsApp.
- **`profiles`**: Links users to Phone Numbers for the WhatsApp integration.
- **`subscriptions`**: Polar billing and entitlement state.

---

## 6. Product Impact

### 🚀 "Capture Flow" Impact

**Technical:** The separation of Backend (WhatsApp) and Frontend (Web) allows for a seamless "Capture Flow".
**Product Benefit:** Users don't need to open the app to save something. They simply forward a message to DoryAI on WhatsApp. The Backend wakes up, processes it, categorizes it using AI, and pushes it to Convex. When the user next opens the Web App, the link is _already there_, categorized and ready.

### 🧠 "Contextual AI" Impact

**Technical:** Both the Web App and Backend feed the AI (Gemini) with the user's specific taxonomy (Categories/Tags) before asking it to process a link.
**Product Benefit:** The AI doesn't just "save a link". It acts like a personal librarian. It knows _your_ folders. If you have a "Recipes" folder, it puts food links there. If `web-app` defines a new category, the `backend` knows about it instantly via Convex.

### ⚡️ Real-time Sync

**Technical:** Convex provides reactive bindings.
**Product Benefit:** If a user saves a link on WhatsApp, they can watch it appear on their Web Dashboard in real-time without refreshing the page. This creates a highly responsive and magical user experience.
