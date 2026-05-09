---
layout: page
title: Projects
permalink: /projects/
description: Ongoing projects and expertise including an interactive normalizing flow slider.
nav: true
nav_order: 3
display_categories: [work, fun]
horizontal: false
---

<div style="width: 100%; border: 1px solid var(--global-divider-color); border-radius: 8px; margin-bottom: 2rem; overflow: hidden; background: white;">
  <div style="padding: 10px; background: var(--global-bg-color); border-bottom: 1px solid var(--global-divider-color); font-weight: bold;">Normalizing Flow Interactive Slider</div>
  <iframe src="{{ '/assets/slider-app/index.html' | relative_url }}" width="100%" height="800px" frameborder="0" style="border: none; display: block;"></iframe>
</div>

<div style="width: 100%; border: 1px solid var(--global-divider-color); border-radius: 8px; margin-bottom: 2rem; overflow: hidden; background: white;">
  <div style="padding: 10px; background: var(--global-bg-color); border-bottom: 1px solid var(--global-divider-color); font-weight: bold;">PyTorch Theory Interactive Slider</div>
  <iframe src="{{ '/assets/pytorch-app/index.html' | relative_url }}" width="100%" height="800px" frameborder="0" style="border: none; display: block;"></iframe>
</div>

<div style="width: 100%; border: 1px solid var(--global-divider-color); border-radius: 8px; margin-bottom: 2rem; padding: 1.5rem; background: var(--global-card-bg-color);">
  <h3>Genesis ML Pipeline</h3>
  <p>A comprehensive ML pipeline project requiring dedicated hardware to run fully. Includes Jupyter notebooks, W&B integration, and complete lifecycle tools.</p>
  <a href="https://github.com/Anupam1223/Genesis" class="btn btn-primary" target="_blank" rel="noopener noreferrer">View Genesis on GitHub</a>
</div>

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
