---
layout: distill
title: Deep Learning-Based Particle Identification In The Glue-X Experiment
description: M.S. thesis summary — MLP-based PID for GlueX charged tracks, with validation/test results, confusion matrices, and comparison to Random Forest.
tags: deep-learning particle-physics neural-networks machine-learning jefferson-lab gluex
giscus_comments: true
date: 2025-04-17
featured: true
thumbnail: assets/img/gluex-pid/fig4-3-test-confusion.png
mermaid:
  enabled: false
code_diff: false
map: false
chart:
  chartjs: false
  echarts: false
  vega_lite: false
tikzjax: false
typograms: false
external_source: "/assets/pdf/Siwakoti_Anupam_GlueX_PID_Thesis.pdf"

authors:
  - name: Anupam Siwakoti
    url: "https://github.com/anupam1223"
    affiliations:
      name: Lamar University, M.S. Computer Science
  - name: Dr. Jing Zhang
    affiliations:
      name: Lamar University (Supervisor)
  - name: Dr. Philip L. Cole
    affiliations:
      name: Jefferson Laboratory (Co-Advisor)
  - name: Dr. Igal Jaegle
    affiliations:
      name: Jefferson Laboratory (Co-Advisor)

toc:
  - name: Overview
  - name: Problem Setting
  - name: Method
  - name: Results
  - name: Discussion
  - name: Limitations and Outlook
  - name: Conclusion

_styles: >
  .thesis-banner {
    background: var(--global-card-bg-color);
    border: 1px solid var(--global-divider-color);
    border-left: 4px solid var(--global-theme-color);
    border-radius: 10px;
    padding: 1.1rem 1.35rem;
    margin-bottom: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .thesis-banner__meta {
    font-size: 0.9rem;
    color: var(--global-text-color-light);
  }
  a.thesis-cta {
    display: inline-block;
    background: var(--global-theme-color) !important;
    color: #0b1220 !important;
    padding: 0.65rem 1.35rem;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none !important;
    border-bottom: none !important;
    white-space: nowrap;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  }
  a.thesis-cta:hover {
    opacity: 0.92;
    color: #0b1220 !important;
  }
  a.thesis-cta-secondary {
    display: inline-block;
    color: var(--global-theme-color) !important;
    border: 1px solid var(--global-theme-color);
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.85rem;
    text-decoration: none !important;
    border-bottom: none !important;
    white-space: nowrap;
  }
  .thesis-cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;
  }
  .result-strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.85rem;
    margin: 0 0 1.75rem;
  }
  .result-pill {
    background: var(--global-card-bg-color);
    border: 1px solid var(--global-divider-color);
    border-radius: 12px;
    padding: 1rem 1.1rem;
    text-align: center;
  }
  .result-pill__value {
    display: block;
    font-size: 1.55rem;
    font-weight: 800;
    color: var(--global-theme-color);
    line-height: 1.2;
  }
  .result-pill__label {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.75rem;
    letter-spacing: 0.02em;
    color: var(--global-text-color-light);
  }
  .callout {
    background: var(--global-card-bg-color);
    border: 1px solid var(--global-divider-color);
    border-radius: 10px;
    padding: 1rem 1.2rem;
    margin: 1.25rem 0 1.75rem;
  }
  .callout strong {
    color: var(--global-theme-color);
  }
  .pipeline {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin: 0.75rem 0 1.5rem;
  }
  .pipeline__step {
    background: var(--global-card-bg-color);
    border: 1px solid var(--global-divider-color);
    border-radius: 8px;
    padding: 0.45rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--global-text-color);
  }
  .pipeline__arrow {
    color: var(--global-theme-color);
    font-weight: 700;
  }
  .thesis-figure {
    margin: 1.25rem 0 0.35rem;
    text-align: center;
  }
  .thesis-figure img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid var(--global-divider-color);
    background: #fff;
  }
  .thesis-caption {
    font-size: 0.85rem;
    color: var(--global-text-color-light);
    margin: 0.4rem 0 1.5rem;
    text-align: left;
  }
  .figure-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
    margin: 1rem 0 0.25rem;
  }
  .figure-grid .thesis-figure {
    margin: 0;
  }
  .figure-grid .thesis-caption {
    margin-bottom: 0.5rem;
  }
  d-article span.katex,
  d-article span.katex *,
  d-article .katex,
  d-article .katex *,
  d-article .katex-display,
  d-article .katex-display * {
    color: var(--global-text-color) !important;
  }
  d-article .katex-display,
  d-article span.katex-display {
    display: block;
    background: var(--global-card-bg-color);
    border: 1px solid var(--global-divider-color);
    border-radius: 10px;
    padding: 0.85rem 1.1rem;
    margin: 0.85rem 0 1.25rem;
    overflow-x: auto;
  }
  d-article table {
    width: 100%;
    font-size: 0.92rem;
  }
---

<div class="thesis-banner">
  <div>
    <strong>Published Thesis</strong><br>
    <span class="thesis-banner__meta">ProQuest Dissertations &amp; Theses · April 17, 2025 · Lamar University × Jefferson Lab</span>
  </div>
  <div class="thesis-cta-row">
    <a class="thesis-cta" href="{{ '/assets/pdf/Siwakoti_Anupam_GlueX_PID_Thesis.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer">Download PDF</a>
    <a class="thesis-cta-secondary" href="https://www.proquest.com/dissertations-theses/deep-learning-based-particle-identification-gluex/docview/3206450220/se-2" target="_blank" rel="noopener noreferrer">ProQuest record</a>
  </div>
</div>

## Overview

This post summarizes my M.S. thesis on deep-learning particle identification (PID) for the GlueX experiment at Jefferson Lab. The full document covers literature, architecture choices, training diagnostics, and ablations; here I focus on the scientific setting, method, and quantitative results.

<div class="result-strip">
  <div class="result-pill">
    <span class="result-pill__value">93%</span>
    <span class="result-pill__label">Test micro F1<br>(K⁺, μ⁺, p, e⁺)</span>
  </div>
  <div class="result-pill">
    <span class="result-pill__value">98%</span>
    <span class="result-pill__label">Best class recall<br>(e⁺ on validation)</span>
  </div>
  <div class="result-pill">
    <span class="result-pill__value">~95%</span>
    <span class="result-pill__label">Validation accuracy<br>after ~2k epochs</span>
  </div>
  <div class="result-pill">
    <span class="result-pill__value">&gt;20 GB</span>
    <span class="result-pill__label">RF model size<br>(vs compact MLP)</span>
  </div>
</div>

<div class="callout">
  <strong>Takeaway.</strong> A PyTorch MLP trained on Monte Carlo GlueX tracks reaches strong PID performance for K⁺, μ⁺, p, and e⁺ on held-out test data (micro-averaged F1 = 0.93). Including π⁺ exposes a hard separation problem that momentum-binned cuts partially mitigate. Random Forest can match or slightly exceed accuracy, but at impractical memory cost for deployment.
</div>

## Problem Setting

GlueX (JLab Hall D) studies QCD with a tagged photon beam (≈ 6–11.7 GeV) and wide charged-track coverage (polar angles ≈ 1°–120°). Reliable PID of e±, μ±, π±, K±, and protons is required before reconstructing final states; hand-tuned cuts scale poorly with data volume and struggle with combinatorial background and cross-contamination.

This work targets a practical classifier that:

1. Learns from simulated Monte Carlo tracks rather than brittle cut menus
2. Reports class-wise precision / recall / F1 with confusion matrices
3. Remains small enough for large-scale or iterative analysis, unlike multi-GB ensembles

## Method

<div class="pipeline">
  <span class="pipeline__step">ROOT / MC tracks</span>
  <span class="pipeline__arrow">→</span>
  <span class="pipeline__step">Clean &amp; normalize</span>
  <span class="pipeline__arrow">→</span>
  <span class="pipeline__step">Feature selection</span>
  <span class="pipeline__arrow">→</span>
  <span class="pipeline__step">MLP (ReLU → Softmax)</span>
  <span class="pipeline__arrow">→</span>
  <span class="pipeline__step">Metrics &amp; matrices</span>
</div>

<figure class="thesis-figure">
  <img src="{{ '/assets/img/gluex-pid/fig3-1-pipeline.png' | relative_url }}" alt="Model training pipeline from configuration through preprocessing, network training, and analysis">
</figure>
<p class="thesis-caption"><strong>Figure 3.1.</strong> End-to-end training pipeline used in the thesis: configuration, data loading / preprocessing, network training, and post-training visualization.</p>

**Data.** Charged-particle Monte Carlo samples covering the GlueX polar-angle acceptance. Rows with NaN / Inf are removed; features are normalized; highly collinear calorimeter / CDC-derived variables are pruned after correlation analysis. Labels encode particle species (e.g. K⁺, p, π⁺, e⁺, μ⁺). Train / test split is 70 / 30 with the test set held out for final reporting.

<figure class="thesis-figure">
  <img src="{{ '/assets/img/gluex-pid/fig3-5-correlation.png' | relative_url }}" alt="Feature correlation heatmap after mitigating multicollinearity">
</figure>
<p class="thesis-caption"><strong>Figure 3.5.</strong> Correlation structure after removing highly redundant features — used to stabilize training and reduce noise.</p>

**Model.** Multi-layer perceptron in PyTorch with ReLU hidden units, Softmax outputs, Kaiming initialization, Adam, mini-batches of 2048, and categorical cross-entropy. Gradient norms are monitored across layers during training. Hyperparameters are tuned for the GlueX feature space (depth, width, dropout, learning rate). Training ran on JLab HPC (`ifarm2402`: dual AMD EPYC 9554, 1.5 TiB RAM).

<figure class="thesis-figure">
  <img src="{{ '/assets/img/gluex-pid/fig3-6-architecture.png' | relative_url }}" alt="Neural network architecture with ReLU hidden layers and Softmax output">
</figure>
<p class="thesis-caption"><strong>Figure 3.6.</strong> Network schematic: dense ReLU stack with Softmax classification over particle species.</p>

## Results

### Training dynamics

Loss and accuracy on the primary positive-particle configuration converge quickly and remain closely matched between training and validation over 2000 epochs (~95% validation accuracy), indicating stable optimization without severe overfitting.

<figure class="thesis-figure">
  <img src="{{ '/assets/img/gluex-pid/fig4-1-training-curves.png' | relative_url }}" alt="Training and validation loss and accuracy over 2000 epochs">
</figure>
<p class="thesis-caption"><strong>Figure 4.1.</strong> Training vs. validation loss (left) and accuracy (right) over 2000 epochs.</p>

### Positive particles — validation

On the validation set (K⁺, μ⁺, p, e⁺), diagonal dominance is clear: K⁺ 91.66%, μ⁺ 95.45%, p 96.05%, e⁺ 98.81% correct. Residual confusion is concentrated between K⁺ and μ⁺.

| Class | Precision | Recall | F1 |
| --- | ---: | ---: | ---: |
| K⁺ | 0.63 | 0.92 | 0.75 |
| μ⁺ | 0.66 | 0.95 | 0.78 |
| p | 0.94 | 0.96 | 0.95 |
| e⁺ | 0.93 | 0.99 | 0.96 |
| Micro avg | 0.77 | 0.96 | 0.85 |
| Macro avg | 0.79 | 0.95 | 0.86 |

<figure class="thesis-figure">
  <img src="{{ '/assets/img/gluex-pid/fig4-2-val-confusion.png' | relative_url }}" alt="Validation confusion matrix for positive particles">
</figure>
<p class="thesis-caption"><strong>Figure 4.2.</strong> Validation confusion matrix (%), positive combined charged sample at the studied kinematics / angle setting.</p>

### Positive particles — held-out test

Test performance is consistent with validation and is the headline number for generalization: micro-averaged precision / recall / F1 = **0.93**. Class-wise F1 ranges from 0.87 (K⁺) to 0.97 (e⁺).

| Class | Precision | Recall | F1 |
| --- | ---: | ---: | ---: |
| K⁺ | 0.88 | 0.85 | 0.87 |
| μ⁺ | 0.90 | 0.98 | 0.94 |
| p | 0.97 | 0.88 | 0.92 |
| e⁺ | 0.96 | 0.98 | 0.97 |
| Micro avg | 0.93 | 0.93 | 0.93 |
| Macro avg | 0.93 | 0.92 | 0.92 |

<figure class="thesis-figure">
  <img src="{{ '/assets/img/gluex-pid/fig4-3-test-confusion.png' | relative_url }}" alt="Test confusion matrix for positive particles">
</figure>
<p class="thesis-caption"><strong>Figure 4.3.</strong> Test confusion matrix (%). K⁺ is the hardest class (~85% correct); e⁺ and μ⁺ remain above 97%.</p>

### Including π⁺

Adding π⁺ degrades overall PID: in the five-class matrices, π⁺ is frequently confused with μ⁺ (~20–22%) and K⁺. Momentum-binned cuts (0.25–1, 1–2, 2–3, 3–5 GeV/c) improve μ⁺ separation and reduce some K⁺ errors, but π⁺ remains the limiting species — consistent with overlapping detector signatures in the current feature set.

<div class="figure-grid">
  <div>
    <figure class="thesis-figure">
      <img src="{{ '/assets/img/gluex-pid/fig4-4-pion-confusion.png' | relative_url }}" alt="Confusion matrix after including the pion class with data cuts">
    </figure>
    <p class="thesis-caption"><strong>Figure 4.4.</strong> Training / validation matrix after including π⁺ and applying momentum cuts.</p>
  </div>
  <div>
    <figure class="thesis-figure">
      <img src="{{ '/assets/img/gluex-pid/fig4-5-random-forest.png' | relative_url }}" alt="Random Forest confusion matrix on the same five-class setting">
    </figure>
    <p class="thesis-caption"><strong>Figure 4.5.</strong> Random Forest on a comparable setting — competitive accuracy, still weak on π⁺.</p>
  </div>
</div>

### Baseline: Random Forest

A Random Forest with tens of estimators can slightly outperform the MLP on some splits, but the fitted ensemble exceeds ~20 GB and is unsuitable for iterative or resource-constrained analysis. The MLP remains the practical operating point: near-competitive accuracy at a fraction of the memory footprint.

## Discussion

- **What works.** For the four-class positive sample, Softmax MLP + careful preprocessing yields stable training and strong held-out F1 (0.93), with e⁺ / μ⁺ nearly saturated and protons strong.
- **Where it fails.** π⁺–μ⁺–K⁺ confusion dominates when pions are included; features that cleanly separate those species are under-expressed in the current inputs.
- **Angle specialization.** Models were trained and evaluated within specific polar-angle settings. A single angle-invariant model remains an open engineering goal and likely needs multi-angle training plus invariant or adapted features.
- **Deployment criterion.** Accuracy alone is insufficient: Random Forest’s memory cost rules it out for this workflow despite competitive scores.

## Limitations and Outlook

1. Optimizer search was limited primarily to Adam; SGD hybrids, schedules, or cyclical rates may further stabilize late training.
2. Angle-specific models do not yet cover the full 1°–120° acceptance in one network.
3. Feature design for π⁺ discrimination needs deeper physics-motivated engineering (and possibly richer detector variables).
4. Natural next steps: multi-angle datasets, domain adaptation / invariant features, modest ensembles of compact nets, and interpretability (e.g. SHAP) aligned with detector observables.

## Conclusion

Deep learning provides a scalable PID path for GlueX Monte Carlo tracks: a compact MLP reaches **93% micro-averaged F1** on held-out positive particles, far more deployable than a multi-GB Random Forest, while π⁺ inclusion marks the main physics/ML bottleneck. The thesis PDF below contains the full methodology, diagnostics, and tables.

<div class="thesis-banner">
  <div>
    <strong>Full thesis</strong><br>
    <span class="thesis-banner__meta">Methods, tables, and appendices · May 2025</span>
  </div>
  <div class="thesis-cta-row">
    <a class="thesis-cta" href="{{ '/assets/pdf/Siwakoti_Anupam_GlueX_PID_Thesis.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer">Download PDF</a>
    <a class="thesis-cta-secondary" href="https://www.proquest.com/dissertations-theses/deep-learning-based-particle-identification-gluex/docview/3206450220/se-2" target="_blank" rel="noopener noreferrer">ProQuest record</a>
  </div>
</div>

### Selected references

- Kingma &amp; Ba (2015). *Adam: A Method for Stochastic Optimization.* ICLR.
- Bergstra &amp; Bengio (2012). *Random Search for Hyper-Parameter Optimization.* JMLR.
- Radovic et al. (2018). *Machine learning at the energy and intensity frontiers of particle physics.* Nature.
- Palo &amp; Molzon (2024). Neural nets for drift-chamber track position. *Nucl. Instrum. Methods A.*
- PyTorch Optimizer docs; ROOT Data Analysis Framework.
