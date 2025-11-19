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

I'm a systems-minded engineer who builds end-to-end solutions—from embedded devices to production ML and backend services. Beyond machine learning, I work across C++, Python, databases, and embedded platforms to turn ideas into reliable, deployable systems.

---

## Core Expertise

<div class="skills-grid">
  <div class="skill-card">
    <h3><span class="skill-icon">⚙️</span> C++ & Physics-Inspired Models</h3>
    <p>Custom statistical models with quantum-influenced techniques for precise computation and edge optimization</p>
  </div>

  <div class="skill-card">
    <h3><span class="skill-icon">🧠</span> Python ML & Data Pipelines</h3>
    <p>Particle-identification pipelines with PyTorch and scikit-learn at Thomas Jefferson National Accelerator Facility</p>
  </div>

  <div class="skill-card">
    <h3><span class="skill-icon">⚡</span> Backend & Databases</h3>
    <p>FastAPI and Django services; data modeling and performance tuning across PostgreSQL, EdgeDB, and MySQL</p>
  </div>

  <div class="skill-card">
    <h3><span class="skill-icon">📱</span> Edge & Embedded Systems</h3>
    <p>System-in-Package (SiP) sensor integration on ARM Cortex-M4, embedded Linux, and on-device optimization</p>
  </div>
</div>

---

## Experience

At CMMS, I split my time between software engineering and research administration, including patent development around a SiP-based multi-sensor platform. I care deeply about reproducibility, clear interfaces, and making research-grade ideas production-ready.

<div class="cta-section">
  <p>If you'd like to collaborate or chat about projects, feel free to reach out via <a href="mailto:{{ site.data.socials.email }}">email</a>.</p>
  <p style="margin-top: 1rem;">Please see my <a href="{{ '/cv/' | relative_url }}">resume</a> for more details about my background, experience, and selected projects.</p>
</div>
