---
layout: about
title: About
permalink: /
subtitle: <em>Machine Learning at the Edge for Environmental & Physical Sciences</em>

profile:
  align: right
  image: prof_pic.jpg
  image_circular: true # crops the image to make it circular
  more_info: >
    <p>1401 little elm trail</p>
    <p>Austin, TX</p>

selected_papers: false # hide selected publications section (plugin not available on GitHub Pages)
social: true # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: true
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

<style>
  /* Adding modern styling for enhanced visual appeal */
  .about-intro {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    margin-bottom: 4rem;
  }

  .about-intro p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--global-text-color);
    margin-bottom: 1rem;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
  }

  .skill-card {
    padding: 2rem;
    background: var(--global-card-bg-color);
    border-radius: 12px;
    border-left: 4px solid var(--global-theme-color);
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .skill-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }

  .skill-card h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--global-text-color);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .skill-card p {
    color: var(--global-text-color-light);
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
  }

  .skill-icon {
    font-size: 1.3rem;
  }

  .cta-section {
    background: var(--global-card-bg-color);
    color: var(--global-text-color);
    padding: 3rem 2rem;
    border-radius: 12px;
    margin-top: 3rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .cta-section a {
    color: var(--global-theme-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .cta-section a:hover {
    color: var(--global-hover-color);
  }

  @media (max-width: 768px) {
    .about-intro {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .skills-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

## About Me

I'm a software developer and ML researcher building end-to-end systems — from real-time anomaly detection pipelines and physics-informed ML models to embedded Linux platforms and full-stack web services. Currently at the **Center for Midstream Management and Science (CMMS)**, I develop production-grade ML systems that operate at sub-millisecond speeds on industrial data streams, combining rigorous physics intuition with modern deep learning. My background spans nuclear physics research at Jefferson Lab (GlueX), backend engineering at a software startup in Kathmandu, and embedded systems for IoT sensor platforms. I care deeply about reproducibility, clean interfaces, and turning research-grade ideas into reliable deployable systems.

---

## Core Expertise

<div class="skills-grid">
  <div class="skill-card">
    <h3><span class="skill-icon">🔬</span> Physics-Informed ML & Anomaly Detection</h3>
    <p>real-time anomaly detection systems combining Vector Autoregression (VAR) with tensor train fingerprinting, Built stochastic MPC architectures using Functional PCA and Normalizing Flows for multi-variable distribution prediction.</p>
  </div>

  <div class="skill-card">
    <h3><span class="skill-icon">🧠</span> Deep Learning & ML Pipelines</h3>
    <p>Built PyTorch-based ML pipelines with Optuna for hyperparameter optimization on GlueX detector data at Jefferson Lab.</p>
  </div>

  <div class="skill-card">
    <h3><span class="skill-icon">🐳</span> MLOps, Streaming & DevOps</h3>
    <p>Containerized full anomaly-detection pipelines (Kafka, C++ forecaster, Python analytics) using Docker Compose Deployed Prometheus + InfluxDB monitoring with Grafana dashboards.</p>
  </div>

  <div class="skill-card">
    <h3><span class="skill-icon">📡</span> Embedded Systems & Edge Computing</h3>
    <p>Built embedded Linux solutions on the Octavo OSD32MP1-BRK platform with I2C sensors, Cat-M1/NB-IoT modules, and STM32 ARM Cortex-M4 firmware.</p>
  </div>

  <div class="skill-card">
    <h3><span class="skill-icon">⚡</span> Backend Engineering & APIs</h3>
    <p>Delivered production backend systems at Codavatar — secure authorization with OSO + Python, Twilio-powered APIs, GraphQL + FastAPI + Pandas developer analytics, and Django REST Framework APIs for enterprise clients. Full-stack experience across PostgreSQL, Docker, and async services.</p>
  </div>
  </div>
</div>

---

## Experience

**Software Developer — CMMS, Beaumont TX** *(Jun 2025 – Present)*  
Building physics-informed ML systems for real-time industrial analytics, embedded IoT platforms, and containerized streaming pipelines.

**Graduate Research Assistant — Lamar University × Jefferson Lab** *(May 2024 – May 2025)*  
ML-based particle identification for the GlueX Collaboration at HallD, Virginia. PyTorch DNN pipelines deployed in C++ for real-time nuclear physics analysis.

**Software Engineer — Codavatar, Kathmandu** *(Nov 2021 – Jun 2023)*  
Full-stack and backend engineer across multiple products — Dialaxy (comms platform) and Entegra (enterprise APIs) — using Django, FastAPI, GraphQL, and Docker.

<div class="cta-section">
  <p>If you'd like to collaborate or chat about projects, feel free to reach out via <a href="mailto:{{ site.data.socials.email }}">email</a>.</p>
  <p style="margin-top: 1rem;">Please see my <a href="{{ '/cv/' | relative_url }}">resume</a> for full details on my background and selected projects.</p>
</div>
