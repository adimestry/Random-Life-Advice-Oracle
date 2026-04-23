# 🔮 Random Life Advice Oracle

An eccentric, AI-powered mystical experience that provides absurdly wise, hand-scrawled life advice. Built for hackathon purposes with a unique hand-drawn aesthetic.

![Oracle Preview](https://ais-pre-jk657mbccc6pqoddtfxjpv-44682549552.asia-southeast1.run.app/favicon.ico) <!-- Placeholder or relative path if available -->

## 🌟 Overview

The **Random Life Advice Oracle** is a fun and viral web application where users can ask any life question and receive poetic, philosophical, and often absurd advice. The interface is designed to look like hand-drawn scraps of paper pinned to a wall, creating a tactile and mystical atmosphere.

## ✨ Features

- **Philosophical AI Engine:** Powered by Google Gemini AI to generate creative and mood-specific advice.
- **Mood Selector:** Choose between *Serious*, *Absurd*, *Poetic*, or *Brutal* tones.
- **Hand-Drawn Design:** Custom CSS "torn paper" effects, wobbly borders, and handwritten typography.
- **The Wall of Wisdom:** Pin your favorite advice cards to a persistent board.
- **Shareable Wisdom:** Download your advice as a high-quality PNG image.
- **Atmospheric Audio:** Subtle ambient drones and mystical chime sound effects (Web Audio API).
- **Interactive UI:** Smooth animations, haptic-style button presses, and celebratory confetti.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4
- **AI Integration:** Google Gemini AI (@google/genai)
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React
- **Utilities:** `html-to-image`, `canvas-confetti`
- **Audio:** Web Audio API

## 👥 Built By

This project was created by:

- **Aditya Mestry**
  - [GitHub](https://github.com/adimestry)
  - [Instagram](https://www.instagram.com/aditya_mestry_x007/)
- **Dhruv Kasar**
  - [GitHub](https://github.com/dhruvkasar)
  - [Instagram](https://www.instagram.com/dhruvvkasar/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in a `.env` file:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 License

This project is licensed under the Apache-2.0 License.
