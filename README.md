# 👕 AI-Powered Digital Apparel Intelligence & Virtual Fitting Platform

> A multimodal AI platform for personalized digital apparel evaluation, combining
> real-time human body analysis, fabric intelligence, garment understanding, and
> personalized fit prediction.

## 🚀 Overview

Online clothing shopping provides limited information about how a garment will
look, fit, and feel before purchase.

This project aims to bridge the gap between physical apparel shopping and
digital e-commerce by developing an AI-powered system that analyzes:

- 👤 Human body geometry from real-time video
- 🧵 Fabric characteristics from images
- 👕 Garment properties and dimensions
- 📏 Personalized clothing size
- 🎯 Static and movement-aware fit
- ✋ Predicted fabric/tactile properties
- 🛍️ Interactive digital apparel evaluation

The long-term vision is to create a more physical, tangible, and personalized
online clothing-shopping experience without requiring the customer to
physically visit a store.

---

## 🎯 Project Objectives

The project aims to develop a multimodal apparel intelligence system capable of:

1. Detecting and tracking human body keypoints from real-time video.
2. Segmenting the user from the surrounding environment.
3. Constructing a stable body representation from temporal video data.
4. Estimating apparel-relevant body measurements.
5. Identifying fabric/material characteristics from images.
6. Extracting visual and structural fabric representations.
7. Estimating selected fabric properties such as:
   - Softness
   - Stretch
   - Thickness
   - Stiffness
   - Drape
   - Surface characteristics
8. Understanding garment-specific properties.
9. Combining body, garment, and fabric information.
10. Predicting personalized clothing size and fit.
11. Exploring movement-aware/dynamic fit prediction.
12. Providing an interactive virtual apparel evaluation experience.

---

## 🧠 System Architecture

```text
                         USER
                          │
                          ▼
                  ┌───────────────┐
                  │ Camera / Video│
                  └───────┬───────┘
                          │
                          ▼
              ┌──────────────────────┐
              │   BODY INTELLIGENCE  │
              │                      │
              │ MoveNet              │
              │ BodyPix              │
              │ Temporal Processing  │
              └──────────┬───────────┘
                         │
                   Body Signature
                         │
                         │
       ┌─────────────────┴─────────────────┐
       │                                   │
       ▼                                   ▼
┌─────────────────┐               ┌─────────────────┐
│ FABRIC AI       │               │ GARMENT AI      │
│                 │               │                 │
│ CNN + CBAM      │               │ Garment         │
│ Fabric Analysis │               │ Classification  │
│ Property        │               │ & Attributes    │
│ Prediction      │               │                 │
└────────┬────────┘               └────────┬────────┘
         │                                 │
         └──────────────┬──────────────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ MULTIMODAL FUSION   │
              │                     │
              │ Body × Garment ×    │
              │ Fabric              │
              └──────────┬──────────┘
                         │
                         ▼
             ┌────────────────────────┐
             │ PERSONALIZED APPAREL   │
             │ REPRESENTATION         │
             └───────────┬────────────┘
                         │
             ┌───────────┼────────────┐
             ▼           ▼            ▼
          SIZE         FIT           FEEL
       Prediction   Prediction    Estimation
             │           │            │
             └───────────┼────────────┘
                         ▼
                ┌─────────────────┐
                │ E-COMMERCE UI   │
                │                 │
                │ Virtual Apparel │
                │ Experience      │
                └─────────────────┘
```

---

## 🛠️ Tech Stack

This project includes a modern Next.js frontend for the digital fitting studio experience.

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.
