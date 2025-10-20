---
layout: cv
permalink: /cv/
title: Resume
nav: true
nav_order: 5
cv_pdf: your_actual_filename.pdf # Replace with your actual PDF filename
description: 
---

<!-- PDF Resume Display -->
{% if page.cv_pdf %}
<div class="resume-pdf-container mt-3">
  <embed src="{{ page.cv_pdf | prepend: '/assets/pdf/' | relative_url }}" 
         type="application/pdf" 
         width="100%" 
         height="800px"
         style="border: 1px solid #ddd; border-radius: 8px;" />
</div>
{% endif %}

<style>
.resume-pdf-container {
  margin-top: 2rem;
  text-align: center;
}

.resume-pdf-container embed {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .resume-pdf-container embed {
    height: 600px;
  }
}

/* Style the PDF download button that's already in the layout */
.post-title a {
  font-size: 1.2rem;
  color: #007bff;
  text-decoration: none;
  margin-left: 1rem;
}

.post-title a:hover {
  color: #0056b3;
}
</style>
