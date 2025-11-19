# SoundShare - Music Sharing Platform

A Next.js application for recording, uploading, and sharing music.

## Features

- **User Authentication**: Sign up and login securely.
- **Audio Recording**: Record audio directly from the browser.
- **File Upload**: Upload existing audio files.
- **Music Library**: Manage your uploaded songs.
- **Playback**: Persistent audio player with global state.
- **Premium UI**: Dark mode design with glassmorphism and smooth animations.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (via Prisma)
- **Auth**: NextAuth.js (Credentials)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Set up the database**:
    ```bash
    npx prisma migrate dev --name init
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components (Recorder, Player, Navbar).
- `lib/`: Utility functions and Prisma client.
- `prisma/`: Database schema.
- `public/uploads/`: Directory for stored audio files.

## Note

This is an MVP using local file storage. For production, replace the file upload logic in `app/api/upload/route.ts` with an object storage service like AWS S3 or Supabase Storage.
