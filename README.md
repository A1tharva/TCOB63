# AI-Powered Digital Apparel Intelligence & Virtual Fitting Platform

An AI-powered multimodal apparel intelligence platform designed to make online clothing shopping more personalized and interactive.

## Overview

Traditional e-commerce clothing shopping provides limited information about how a garment may fit or feel before purchase. This project explores a multimodal computer vision and deep learning system that combines:

- Real-time human pose estimation
- Human body segmentation
- Body measurement estimation
- Fabric/material analysis
- Garment representation
- Multimodal AI
- Personalized clothing size prediction
- Fit prediction
- Dynamic movement-based fit analysis
- Digital fabric/tactile property estimation
- Virtual fitting

The system is designed to combine information about the user's body, the selected garment, and the garment's material characteristics to generate a personalized apparel representation.

## Proposed Architecture

```text
Camera / Video
       |
       v
Body Perception
       |
       +---- MoveNet
       |
       +---- BodyPix
       |
       v
Body Signature
       |
       |
       +-----------------------------+
       |                             |
       v                             v
Garment Intelligence           Fabric Intelligence
       |                             |
       v                             v
Garment Signature             Fabric Signature
       |                             |
       +-------------+---------------+
                     |
                     v
             Multimodal Fusion
                     |
                     v
          Personalized Apparel
              Representation
                     |
          +----------+----------+
          |          |          |
          v          v          v
        Size        Fit        Feel
       Prediction  Prediction  Prediction
                     |
                     v
             Digital Shopping UI
```

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Computer Vision
- MoveNet
- BodyPix
- OpenCV

### Machine Learning
- Python
- PyTorch
- CNN
- CBAM
- Multimodal learning

### Backend
- FastAPI
- REST APIs

## Main Modules

### 1. Body Intelligence
Processes real-time video to detect human body keypoints and body silhouette, followed by body measurement and temporal analysis.

### 2. Fabric & Garment Intelligence
Analyzes garment and fabric images to identify material characteristics and generate structured fabric and garment representations.

### 3. Multimodal Fusion
Combines body, garment, and fabric representations to estimate personalized size, fit, and material compatibility.

### 4. Digital Shopping Experience
Integrates the AI modules into an interactive web application for personalized apparel evaluation and virtual fitting.

## Getting Started

To run the virtual atelier digital shopping experience locally:

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the studio application.

## Project Status

🚧 Currently under development.

The project is being developed as a final-year engineering project and research prototype.

## Team

Team Size: 4

## Future Scope

- Improved body measurement accuracy
- Dynamic movement-based fitting
- Advanced virtual try-on
- Personalized fabric preference modeling
- E-commerce integration
- Large-scale apparel datasets
- Real-time inference optimization
