---
layout: default
title: Home
---

# Welcome to My Blog

This is the home page of my new blog. Here you will find my latest posts.

## Pinned Post

<ul>
  {% for post in site.posts %}
    {% if post.pinned %}
      <li>
        <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
        <p class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</p>
        <p>{{ post.excerpt }}</p>
      </li>
    {% endif %}
  {% endfor %}
</ul>

<hr>

## All Posts

<ul>
  {% for post in site.posts %}
    {% unless post.pinned %}
      <li>
        <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
        <p class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</p>
        <p>{{ post.excerpt }}</p>
      </li>
    {% endunless %}
  {% endfor %}
</ul>