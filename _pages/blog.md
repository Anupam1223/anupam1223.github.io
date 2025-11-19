---
layout: default
permalink: /blog/
title: Blog
nav: true
nav_order: 1
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 5
  sort_field: date
  sort_reverse: true
  trail:
    before: 1
    after: 3
---

<style>
  .blog-hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 2rem;
    margin-bottom: 3rem;
    border-radius: 12px;
  }

  .blog-hero h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
  }

  .blog-hero h2 {
    font-size: 1.1rem;
    font-weight: 300;
    opacity: 0.95;
  }

  .tag-category-list {
    display: flex;
    gap: 1rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
  }

  .tag-category-list ul {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .tag-category-list li {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tag-category-list a {
    text-decoration: none;
    color: var(--global-theme-color);
    font-weight: 500;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
  }

  .tag-category-list a:hover {
    color: var(--global-hover-color);
    border-bottom-color: var(--global-hover-color);
  }

  .featured-posts {
    margin-bottom: 2rem;
  }

  .featured-card {
    background: var(--global-card-bg-color);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    height: 100%;
    border: 2px solid transparent;
  }

  .featured-card:hover {
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: var(--global-theme-color);
    transform: translateY(-4px);
  }

  .card-body {
    padding: 1.8rem;
  }

  .featured-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: #fef3c7;
    color: #d97706;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .card-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0.5rem 0 1rem;
    color: var(--global-text-color);
    line-height: 1.4;
  }

  .card-text {
    color: var(--global-text-color-light);
    font-size: 0.95rem;
    margin-bottom: 1.2rem;
    line-height: 1.6;
  }

  .post-meta {
    display: flex;
    gap: 0.8rem;
    font-size: 0.85rem;
    color: var(--global-text-color-light);
    flex-wrap: wrap;
    align-items: center;
  }

  .post-meta a {
    color: var(--global-theme-color);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .post-meta a:hover {
    color: var(--global-hover-color);
  }

  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .post-list li {
    background: var(--global-card-bg-color);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1.8rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-left: 4px solid var(--global-theme-color);
    transition: all 0.3s ease;
  }

  .post-list li:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    transform: translateX(4px);
  }

  .post-list h3 {
    margin: 0 0 0.8rem 0;
  }

  .post-title {
    color: var(--global-text-color);
    text-decoration: none;
    font-size: 1.4rem;
    font-weight: 700;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .post-title:hover {
    color: var(--global-theme-color);
  }

  .post-description {
    color: var(--global-text-color-light);
    font-size: 1rem;
    margin: 0.8rem 0 1.2rem;
    line-height: 1.6;
  }

  .post-tags {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
  }

  .post-tags a {
    color: var(--global-theme-color);
    text-decoration: none;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .post-tags a:hover {
    color: var(--global-hover-color);
  }

  .divider {
    margin: 3rem 0;
    border: none;
    border-top: 1px solid var(--global-divider-color);
  }

  .row.post-row {
    gap: 2rem;
  }

  .post-thumbnail {
    border-radius: 8px;
    object-fit: cover;
    width: 100%;
    height: 250px;
  }

  @media (max-width: 768px) {
    .blog-hero h1 {
      font-size: 1.8rem;
    }

    .featured-card {
      margin-bottom: 1.5rem;
    }

    .post-list li {
      padding: 1.5rem;
    }

    .post-title {
      font-size: 1.1rem;
    }
  }
</style>

<div class="post">
  {% assign blog_name_size = site.blog_name | size %}
  {% assign blog_description_size = site.blog_description | size %}

  {% if blog_name_size > 0 or blog_description_size > 0 %}
    <div class="blog-hero">
      <h1>{{ site.blog_name }}</h1>
      <h2>{{ site.blog_description }}</h2>
    </div>
  {% endif %}

  {% if site.display_tags and site.display_tags.size > 0 or site.display_categories and site.display_categories.size > 0 %}
    <div class="tag-category-list">
      <ul class="p-0 m-0">
        {% for tag in site.display_tags %}
          <li>
            <i class="fa-solid fa-hashtag fa-sm"></i> <a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">{{ tag }}</a>
          </li>
          {% unless forloop.last %}
            <p>&bull;</p>
          {% endunless %}
        {% endfor %}
        {% if site.display_categories.size > 0 and site.display_tags.size > 0 %}
          <p>&bull;</p>
        {% endif %}
        {% for category in site.display_categories %}
          <li>
            <i class="fa-solid fa-tag fa-sm"></i> <a href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">{{ category }}</a>
          </li>
          {% unless forloop.last %}
            <p>&bull;</p>
          {% endunless %}
        {% endfor %}
      </ul>
    </div>
  {% endif %}

  {% assign featured_posts = site.posts | where: "featured", "true" %}
  {% if featured_posts.size > 0 %}
    <div class="featured-posts">
      <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--global-text-color);">
        <i class="fa-solid fa-star" style="color: #fbbf24;"></i> Featured
      </h2>
      {% assign is_even = featured_posts.size | modulo: 2 %}
      <div class="row row-cols-{% if featured_posts.size <= 2 or is_even == 0 %}2{% else %}3{% endif %}">
        {% for post in featured_posts %}
          <div class="col mb-4">
            <a href="{{ post.url | relative_url }}" style="text-decoration: none;">
              <div class="featured-card">
                <div class="featured-badge">
                  <i class="fa-solid fa-thumbtack fa-xs"></i> Featured
                </div>
                <div class="card-body">
                  <h3 class="card-title">{{ post.title }}</h3>
                  <p class="card-text">{{ post.description }}</p>

                  {% if post.external_source == blank %}
                    {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
                  {% else %}
                    {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
                  {% endif %}
                  {% assign year = post.date | date: "%Y" %}

                  <div class="post-meta">
                    <span><i class="fa-solid fa-clock fa-sm"></i> {{ read_time }} min read</span>
                    <a href="{{ year | prepend: '/blog/' | relative_url }}">
                      <i class="fa-solid fa-calendar fa-sm"></i> {{ year }}
                    </a>
                  </div>
                </div>
              </div>
            </a>
          </div>
        {% endfor %}
      </div>
    </div>
    <hr class="divider">
  {% endif %}

  <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--global-text-color);">Latest Posts</h2>
  <ul class="post-list">
    {% if page.pagination.enabled %}
      {% assign postlist = paginator.posts %}
    {% else %}
      {% assign postlist = site.posts %}
    {% endif %}

    {% for post in postlist %}
      {% if post.external_source == blank %}
        {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
      {% else %}
        {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
      {% endif %}
      {% assign year = post.date | date: "%Y" %}
      {% assign tags = post.tags | join: "" %}
      {% assign categories = post.categories | join: "" %}

      <li>
        <div class="row post-row">
          <div class="col-sm-9">
            <h3>
              {% if post.redirect == blank %}
                <a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
              {% elsif post.redirect contains '://' %}
                <a class="post-title" href="{{ post.redirect }}" target="_blank">
                  {{ post.title }}
                  <svg width="1.2rem" height="1.2rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="currentColor" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </a>
              {% else %}
                <a class="post-title" href="{{ post.redirect | relative_url }}">{{ post.title }}</a>
              {% endif %}
            </h3>
            <p class="post-description">{{ post.description }}</p>
            <div class="post-tags">
              <span style="color: var(--global-text-color-light);"><i class="fa-solid fa-calendar fa-sm"></i> {{ post.date | date: '%B %d, %Y' }}</span>
              <span style="color: var(--global-divider-color);">&bull;</span>
              <span style="color: var(--global-text-color-light);"><i class="fa-solid fa-clock fa-sm"></i> {{ read_time }} min</span>

              {% if post.external_source %}
                <span style="color: var(--global-divider-color);">&bull;</span>
                <span style="color: var(--global-text-color-light);">{{ post.external_source }}</span>
              {% endif %}

              {% if tags != "" %}
                <span style="color: var(--global-divider-color);">&bull;</span>
                {% for tag in post.tags %}
                  <a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">
                    <i class="fa-solid fa-hashtag fa-sm"></i> {{ tag }}</a>
                  {% unless forloop.last %}
                    <span style="color: var(--global-divider-color);">•</span>
                  {% endunless %}
                {% endfor %}
              {% endif %}

              {% if categories != "" %}
                <span style="color: var(--global-divider-color);">&bull;</span>
                {% for category in post.categories %}
                  <a href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">
                    <i class="fa-solid fa-tag fa-sm"></i> {{ category }}</a>
                  {% unless forloop.last %}
                    <span style="color: var(--global-divider-color);">•</span>
                  {% endunless %}
                {% endfor %}
              {% endif %}
            </div>
          </div>

          {% if post.thumbnail %}
            <div class="col-sm-3">
              <img class="post-thumbnail" src="{{ post.thumbnail | relative_url }}" alt="{{ post.title }}">
            </div>
          {% endif %}
        </div>
      </li>
    {% endfor %}
  </ul>

  {% if page.pagination.enabled %}
    {% include pagination.liquid %}
  {% endif %}
</div>