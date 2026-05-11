---
layout: page
title: Projects
permalink: /projects/
description: Ongoing projects and expertise — click any project to explore it interactively.
nav: true
nav_order: 3
---

<!-- Project Cards Grid -->
<div class="project-cards-grid">

  <div class="project-card">
    <div class="project-card__badge">Interactive</div>
    <div class="project-card__icon">🌊</div>
    <h3 class="project-card__title">Normalizing Flows</h3>
    <p class="project-card__desc">An interactive visual explainer stepping through the intuition behind normalizing flows — bijective transformations, change of variables, and density estimation.</p>
    <div class="project-card__tags">
      <span class="project-tag">React</span>
      <span class="project-tag">Math Viz</span>
      <span class="project-tag">ML Theory</span>
    </div>
    <button class="project-card__btn" onclick="openProjectModal('slider-app')">View Project</button>
  </div>

  <div class="project-card">
    <div class="project-card__badge">Interactive</div>
    <div class="project-card__icon">🔥</div>
    <h3 class="project-card__title">PyTorch Theory</h3>
    <p class="project-card__desc">A slide-by-slide interactive walkthrough of PyTorch fundamentals — tensors, autograd, neural network modules, training loops, and more.</p>
    <div class="project-card__tags">
      <span class="project-tag">React</span>
      <span class="project-tag">PyTorch</span>
      <span class="project-tag">Deep Learning</span>
    </div>
    <button class="project-card__btn" onclick="openProjectModal('pytorch-app')">View Project</button>
  </div>

  <div class="project-card">
    <div class="project-card__badge">ML Pipeline</div>
    <div class="project-card__icon">⚙️</div>
    <h3 class="project-card__title">Genesis ML Pipeline</h3>
    <p class="project-card__desc">A full ML pipeline for anomaly detection on industrial SCADA data. Includes normalizing flow models, W&B experiment tracking, data preprocessing, and edge export.</p>
    <div class="project-card__tags">
      <span class="project-tag">Python</span>
      <span class="project-tag">SCADA</span>
      <span class="project-tag">Normalizing Flows</span>
      <span class="project-tag">scikit-learn</span>
    </div>
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button class="project-card__btn" onclick="openProjectModal('genesis-app')">View Docs</button>
      <a class="project-card__btn" style="background: var(--global-card-bg-color); color: var(--global-theme-color); border: 1px solid var(--global-theme-color);" href="https://github.com/Anupam1223/Genesis" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </div>

</div>

<!-- Modal Overlay -->
<div id="project-modal" class="project-modal-overlay" onclick="closeProjectModal(event)">
  <div class="project-modal-box">
    <button class="project-modal-close" onclick="closeProjectModal()">✕ Close</button>
    <iframe id="project-modal-iframe" src="" frameborder="0"></iframe>
  </div>
</div>

<style>
.project-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.75rem;
  margin-top: 2rem;
}

.project-card {
  background: var(--global-card-bg-color);
  border: 1px solid var(--global-divider-color);
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  position: relative;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.15);
  border-color: var(--global-theme-color);
}

.project-card__badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--global-theme-color);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 10px;
  border-radius: 20px;
}

.project-card__icon {
  font-size: 2.5rem;
  line-height: 1;
}

.project-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--global-text-color);
}

.project-card__desc {
  font-size: 0.9rem;
  color: var(--global-text-color-light);
  line-height: 1.6;
  flex-grow: 1;
  margin: 0;
}

.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.project-tag {
  background: var(--global-bg-color);
  border: 1px solid var(--global-divider-color);
  border-radius: 20px;
  font-size: 0.75rem;
  padding: 2px 10px;
  color: var(--global-text-color-light);
}

.project-card__btn {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: var(--global-theme-color);
  color: white !important;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: opacity 0.2s ease;
}

.project-card__btn:hover {
  opacity: 0.85;
}

/* Modal */
.project-modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.project-modal-overlay.active {
  display: flex;
}

.project-modal-box {
  background: var(--global-bg-color);
  border-radius: 16px;
  width: 92vw;
  height: 90vh;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
}

.project-modal-close {
  align-self: flex-end;
  margin: 0.75rem 1rem 0;
  padding: 0.4rem 1rem;
  background: transparent;
  border: 1px solid var(--global-divider-color);
  border-radius: 8px;
  color: var(--global-text-color);
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.project-modal-close:hover {
  background: var(--global-divider-color);
}

#project-modal-iframe {
  flex: 1;
  width: 100%;
  border: none;
}
</style>

<script>
function openProjectModal(appPath) {
  const modal = document.getElementById('project-modal');
  const iframe = document.getElementById('project-modal-iframe');
  iframe.src = '/assets/' + appPath + '/index.html';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal(event) {
  if (event && event.target !== document.getElementById('project-modal') && !event.target.classList.contains('project-modal-close')) return;
  const modal = document.getElementById('project-modal');
  const iframe = document.getElementById('project-modal-iframe');
  modal.classList.remove('active');
  iframe.src = '';
  document.body.style.overflow = '';
}
</script>
