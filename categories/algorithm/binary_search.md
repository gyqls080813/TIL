---
layout: default
title: "Binary Search"
permalink: /categories/algorithm/binary_search/
---

## Binary Search

This page explains the Binary Search algorithm and includes an interactive simulator.

<style>
  #bs-container {
    font-family: monospace;
    margin: 2em 0;
  }
  .bs-array-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1em;
  }
  .bs-cell {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 2px;
    min-width: 30px;
    text-align: center;
    position: relative;
    background-color: #f9f9f9;
    transition: background-color 0.5s ease;
  }
  .bs-cell .bs-index {
    font-size: 0.7em;
    color: #666;
    position: absolute;
    top: -1.5em;
    left: 50%;
    transform: translateX(-50%);
  }
  .bs-cell.low .bs-pointer.low,
  .bs-cell.high .bs-pointer.high,
  .bs-cell.mid .bs-pointer.mid {
    display: block;
  }
  .bs-pointer {
    font-size: 0.8em;
    font-weight: bold;
    position: absolute;
    bottom: -1.8em;
    left: 50%;
    transform: translateX(-50%);
    display: none; /* Hide by default */
  }
  .bs-pointer.low { color: #d9534f; }
  .bs-pointer.high { color: #5bc0de; }
  .bs-pointer.mid { color: #5cb85c; }
  #bs-controls {
    margin-bottom: 1em;
  }
  #bs-output {
    border: 1px solid #eee;
    background: #fafafa;
    padding: 1em;
    min-height: 50px;
    white-space: pre-wrap;
    line-height: 1.5;
  }
</style>

<div id="bs-container">
  <h3>Simulator</h3>
  <div class="bs-array-container" id="bs-array-container">
    <!-- Array will be generated here by JS -->
  </div>
  <div id="bs-controls">
    <label for="target-value">Value to find:</label>
    <input type="number" id="target-value" value="7">
    <button id="bs-search-btn">Search</button>
    <button id="bs-reset-btn">Reset</button>
  </div>
  <h3>Log</h3>
  <div id="bs-output"></div>
</div>

<script src="{{ '/assets/js/binary-search-simulator.js' | relative_url }}"></script>