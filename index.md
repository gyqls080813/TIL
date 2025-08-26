---
layout: default
title: Home
---

# Welcome to My Blog

Check out my latest posts:

<ul class="post-list">
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      <p class="post-meta">{{ post.date | date: "%B %-d, %Y" }}</p>
      <p>{{ post.excerpt }}</p>
    </li>
  {% endfor %}
</ul>