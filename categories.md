---
layout: default
title: Categories
permalink: /categories/
---

<div class="categories-page">
  <h1>All Categories</h1>
  <ul class="category-list">
    {% for category in site.categories %}
      <li class="category-item">
        <a href="#{{ category[0] | slugify }}">{{ category[0] }} ({{ category[1].size }})</a>
      </li>
    {% endfor %}
  </ul>

  <div class="category-posts">
    {% for category in site.categories %}
      <h2 id="{{ category[0] | slugify }}">{{ category[0] }}</h2>
      <ul class="post-list">
        {% for post in category[1] %}
          <li>
            <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
            <span class="post-date"> - {{ post.date | date: "%Y-%m-%d" }}</span>
          </li>
        {% endfor %}
      </ul>
    {% endfor %}
  </div>
</div>
