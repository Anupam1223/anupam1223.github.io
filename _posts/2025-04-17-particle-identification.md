---
layout: distill
title: Deep Learning-Based Particle Identification In The Glue-X Experiment
description: A comprehensive study on applying deep learning and hyperparameter optimization for particle classification in nuclear physics
tags: deep-learning particle-physics neural-networks machine-learning
giscus_comments: true
date: 2025-04-17
featured: true
mermaid:
  enabled: false
  zoomable: false
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
      name: Lamar University, Master of Science in Computer Science
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
  - name: Introduction
  - name: Challenges in Particle Identification
  - name: Research Objectives
  - name: Background
  - name: Methodology
    subsections:
      - name: Data Loading and Preprocessing
      - name: Feature Engineering
      - name: Neural Network Architecture
      - name: Model Evaluation
  - name: Results
  - name: Limitations and Future Work
  - name: Conclusion
  - name: References

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
    margin: 0 0 2rem;
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
    font-size: 1.65rem;
    font-weight: 800;
    color: var(--global-theme-color);
    line-height: 1.2;
  }
  .result-pill__label {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.78rem;
    letter-spacing: 0.02em;
    color: var(--global-text-color-light);
  }
  .callout {
    background: var(--global-card-bg-color);
    border: 1px solid var(--global-divider-color);
    border-radius: 10px;
    padding: 1rem 1.2rem;
    margin: 1.25rem 0;
  }
  .callout strong {
    color: var(--global-theme-color);
  }
  .pipeline {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin: 1rem 0 1.75rem;
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
  /* Distill hard-codes near-black KaTeX; force theme text + panel chrome */
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

<div class="result-strip">
  <div class="result-pill">
    <span class="result-pill__value">93%</span>
    <span class="result-pill__label">Test accuracy (unseen)</span>
  </div>
  <div class="result-pill">
    <span class="result-pill__value">5</span>
    <span class="result-pill__label">Particle classes</span>
  </div>
  <div class="result-pill">
    <span class="result-pill__value">Optuna</span>
    <span class="result-pill__label">Hyperparameter search</span>
  </div>
  <div class="result-pill">
    <span class="result-pill__value">PyTorch</span>
    <span class="result-pill__label">Training &amp; deployment</span>
  </div>
</div>

## Introduction

The Glue-X experiment at Jefferson Laboratory (JLAB Hall D) plays a crucial role in exploring Quantum Chromodynamics (QCD) through particle physics research. This experiment produces a photon beam with energies ranging from 6 to 11.7 GeV using the Bremsstrahlung technique, creating conditions to study exotic particles and fundamental interactions.

This thesis builds a practical deep-learning pipeline for particle identification (PID) on GlueX detector data — comparing neural networks with classical baselines, tuning models with Optuna, and packaging a reproducible workflow physicists can run end-to-end.

<div class="callout">
  <strong>At a glance.</strong> Detector hits → cleaned features → optimized DNN → calibrated class probabilities for e±, μ±, π±, p±, and K±.
</div>

<div class="pipeline">
  <span class="pipeline__step">ROOT / CSV / JSON</span>
  <span class="pipeline__arrow">→</span>
  <span class="pipeline__step">Clean &amp; Encode</span>
  <span class="pipeline__arrow">→</span>
  <span class="pipeline__step">Physics Features</span>
  <span class="pipeline__arrow">→</span>
  <span class="pipeline__step">Normalize</span>
  <span class="pipeline__arrow">→</span>
  <span class="pipeline__step">DNN + Softmax</span>
  <span class="pipeline__arrow">→</span>
  <span class="pipeline__step">Optuna Tuning</span>
  <span class="pipeline__arrow">→</span>
  <span class="pipeline__step">Held-out Eval</span>
</div>

### About Glue-X

The Glue-X experiment generates high-energy photon beams with the following specifications:

- **Energy Range**: 6 to 11.7 GeV
- **Momentum**: 50 MeV
- **Angular Coverage**: 1° to 120°
- **Tracked Particles**: e±, μ±, π±, p±, K±

The detector system records particle interactions across multiple subsystems, producing approximately 2 penta-bytes of data over 100 days of operation. Each recorded event contains complex multi-dimensional information that must be processed and classified.

## Challenges in Particle Identification

Traditional particle identification methods in nuclear physics face several critical limitations:

- **Labor-Intensive Tuning**: Expert-driven methods rely on manual parameter tuning, which is susceptible to human error and subjective biases
- **Interpretability Issues**: Difficult to trace misclassifications due to complex inter-feature correlations
- **Deployment Challenges**: Context-dependent methods that struggle to generalize across different experimental conditions
- **Time Delays**: Manual analysis significantly prolongs the time from data collection to publication, delaying scientific insights

## Research Objectives

This research addresses these challenges through three primary objectives:

1. **Comparative Study**: Evaluate deep learning models against classical machine learning approaches (e.g., Random Forests) for particle identification
2. **Hyperparameter Optimization**: Implement advanced optimization techniques using Optuna to fine-tune neural network parameters
3. **Feature Analysis**: Investigate how input features influence model performance and identify the most discriminative features for particle classification
4. **Practical Pipeline**: Develop a plug-and-play pipeline for physicists to run particle identification experiments independently

## Background

### Why Machine Learning for Particle Identification?

Machine learning offers significant advantages over traditional hand-cut methods:

- **Flexibility**: Neural networks can learn complex, non-linear relationships between features that rule-based systems miss
- **Accuracy**: Achieves high classification accuracy while maintaining interpretability through proper analysis
- **Speed**: Dramatically reduces prediction time on large datasets—millions of data points in seconds
- **Scalability**: Computational requirements scale efficiently with modern GPU infrastructure
- **Exploratory Power**: ML models provide insights into particle behavior and dataset properties that human analysis might overlook

### Detector Data Features

The Glue-X detector system provides three primary categories of features:

1. **Ionization Features** (dE/dx vs. momentum): Energy loss per unit distance recorded in the Central Drift Chamber (CDC), which varies predictably with particle type
2. **Calorimeter Ratios**: Ratio of energy deposited in the forward (FCAL) or barrel (BCAL) calorimeters to the CDC signal
3. **Combined Features**: Derived features combining CDC and calorimeter information for enhanced discrimination

## Methodology

### Data Loading and Preprocessing

The pipeline supports multiple input formats: JSON, ROOT (native particle physics format), and CSV files.

**Data Split Strategy**:
- 70% training data
- 30% test data (completely independent for unbiased evaluation)

**Data Cleaning**:
- Rows containing NaN (missing) or Inf (infinite) values are removed
- This ensures clean, consistent input critical for reliable training and reproducible results

**Label Encoding**:

| Particle | Code |
| -------- | ---- |
| K⁺       | 0    |
| p⁺       | 1    |
| π⁺       | 2    |
| e⁺       | 3    |
| μ⁺       | 4    |

All data is transformed into PyTorch tensors with random uniform weight initialization to support weighted loss calculations.

### Feature Engineering

Feature engineering improved model accuracy dramatically—from 80% to 94% in some classification tasks.

**Physics-Motivated Cuts**:
Applied cut-based analysis with thresholds between 0.25 and 1.25 on the benchmark `trk_e_p` variable, filtering events based on established physics principles.

**Feature Normalization**:
All features are normalized to ensure:
- Balanced impact across the network
- Faster convergence during training
- Prevention of large-scale features from dominating network weights

**Multicollinearity Analysis**:
Highly correlated features were identified and removed:
- `trk_fcal_dx_min`, `trk_fcal_dy_min`, `trk_fcal_e`, `trk_fcal_t`, `trk_Nblk`

This reduces model complexity and prevents redundant information from introducing noise.

### Neural Network Architecture

**Activation Function: ReLU**

$$
f(x) = \max(0, x)
$$

ReLU was chosen over alternatives like Sigmoid or Tanh because it:
- Preserves strong activations and zeros out irrelevant ones
- Enables faster convergence during training—critical for extensive hyperparameter optimization
- Mitigates vanishing gradient problems in deep networks

**Layer Configuration**:

Each layer transforms its input through learned parameters, capturing hierarchical features as data flows through the network. The architecture includes dropout layers for regularization and batch normalization for training stability.

**Output Layer: Softmax**

The softmax function converts raw network outputs (logits) into a probability distribution:

$$
\text{softmax}(z_i) = \frac{e^{z_i}}{\sum_j e^{z_j}}
$$

**Example**: For a 5-class particle identification problem with logits [0, 1, 2.0, 0, 1]:

$$
e^0 = 1, \quad e^1 \approx 2.718, \quad e^{2.0} \approx 7.389
$$

$$
\text{Sum} = 1 + 2.718 + 7.389 + 1 + 2.718 = 14.825
$$

$$
P(\text{class 1}) = 2.718 / 14.825 \approx 0.183
$$

### Loss Function: Categorical Cross-Entropy

Cross-entropy measures how close predicted probabilities are to true class labels:

$$
L = -\sum_i y_i \log(\hat{y}_i)
$$

For a true label [0, 0, 1, 0, 0] with predicted probabilities [0.1, 0.2, 0.6, 0.1, 0.0]:

$$
L = -\log(0.6) \approx 0.511
$$


Lower cross-entropy indicates better predictions. During optimization, gradients flow backward through the network to minimize this loss.

### Model Monitoring

During training, gradients for each layer $$i$$ ($$\nabla W_i$$) are continuously monitored for:

- **Vanishing Gradients**: Values very close to 0 prevent lower layers from learning effectively
- **Exploding Gradients**: Excessively large gradients destabilize training
- **Healthy Training**: A consistent ratio close to 1.0 indicates stable learning

### Hyperparameter Optimization

Optuna enables efficient exploration of the hyperparameter space, systematically testing different configurations:

- Learning rate
- Number of layers
- Hidden unit counts
- Dropout rates
- Batch sizes
- Activation function choices

This automated approach identifies optimal parameter combinations that maximize model performance without manual trial-and-error.

## Results

### Validation Performance (Positive Particles)

| Class   | Precision | Recall | F1-Score |
| ------- | --------- | ------ | -------- |
| K⁺      | 0.63      | 0.92   | 0.75     |
| μ⁺      | 0.66      | 0.95   | 0.78     |
| p⁺      | 0.94      | 0.96   | 0.95     |
| e⁺      | 0.93      | 0.99   | 0.96     |
| **Micro Avg** | **0.77** | **0.96** | **0.85** |
| **Macro Avg** | **0.79** | **0.95** | **0.86** |

### Test Performance (Positive Particles, Unseen Data)

| Class   | Precision | Recall | F1-Score |
| ------- | --------- | ------ | -------- |
| K⁺      | 0.88      | 0.85   | 0.87     |
| μ⁺      | 0.90      | 0.98   | 0.94     |
| p⁺      | 0.97      | 0.88   | 0.92     |
| e⁺      | 0.96      | 0.98   | 0.97     |
| **Micro Avg** | **0.93** | **0.93** | **0.93** |
| **Macro Avg** | **0.93** | **0.92** | **0.92** |

The model generalizes well to completely unseen test data, achieving 93% overall accuracy.

### Negative Particle Performance

The model also demonstrated strong performance on negatively charged particles:

| Class   | Precision | Recall | F1-Score |
| ------- | --------- | ------ | -------- |
| K⁻      | 0.82      | 0.80   | 0.81     |
| μ⁻      | 0.77      | 0.91   | 0.83     |
| p⁻      | 0.91      | 0.91   | 0.91     |
| π⁻      | 0.78      | 0.62   | 0.69     |
| e⁻      | 0.95      | 0.97   | 0.96     |
| **Micro Avg** | **0.85** | **0.85** | **0.85** |

### Key Findings

1. **Performance Improvement Through Processing**: Progressive refinement—data cleaning, feature engineering, and normalization—steadily improved model performance
2. **Pion Classification Challenge**: When π⁺ (pion) was included in classification, overall performance decreased. Analysis suggests that distinguishing features between pions and other particle types are not sufficiently well-defined in the current feature set
3. **Dropout Effectiveness**: Introducing dropout layers and adjusting batch/epoch sizes smoothed out noisy training fluctuations, resulting in more stable performance

### Comparison with Classical ML

**Random Forest Results**:
- Achieved competitive accuracy similar to neural networks
- **Critical Limitations**:
  - Required ~50 GB model size
  - Training time: ~32 hours
  - Massive memory requirements
  - Impractical for real-time or large-scale deployment

Neural networks proved vastly more efficient for production environments.

## Limitations and Future Work

### Current Limitations

1. **Optimizer Scope**: Only Adam optimizer was explored; combinations with SGD or adaptive scheduling could yield better results
2. **Angular Generalization**: Models were limited to specific angle degree ranges; broader architectures are needed for full-range angular coverage
3. **Feature Set**: Current features may not optimally discriminate certain particle pairs (e.g., pions)

### Future Directions

- Explore ensemble methods combining multiple model architectures
- Implement advanced optimization strategies (learning rate scheduling, cyclical learning rates)
- Develop angle-independent models for broader experimental applicability
- Investigate additional feature engineering approaches
- Apply techniques like SHAP values for enhanced model interpretability

## Conclusion

This work demonstrates that deep learning provides an effective, scalable approach to particle classification in GlueX data. Key achievements include:

- **93% accuracy** on unseen test data for positive particle identification
- **Efficient deployment** compared to classical ML methods like Random Forests
- **Reproducible methodology** hosted on GitHub with plug-and-play pipeline design
- **Strong generalization** across multiple particle types and charges

While classical models showed competitive accuracy, their computational demands make them unsuitable for real-time or large-scale deployment. This research highlights the transformative potential of machine learning in experimental physics, accelerating the path from raw detector data to published scientific results.

<div class="thesis-banner">
  <div>
    <strong>Read the full thesis</strong><br>
    <span class="thesis-banner__meta">Complete methods, tables, and discussion — open the PDF directly in your browser.</span>
  </div>
  <div class="thesis-cta-row">
    <a class="thesis-cta" href="{{ '/assets/pdf/Siwakoti_Anupam_GlueX_PID_Thesis.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer">Download PDF</a>
  </div>
</div>

## Tools and Technologies

**Deep Learning Framework**:
- PyTorch: Model training and deployment

**Data Processing**:
- Pandas & NumPy: Data manipulation
- Uproot: ROOT file parsing

**Visualization**:
- Matplotlib: Performance visualization

**Optimization**:
- Optuna: Hyperparameter optimization

**Hardware**:
- Dual AMD EPYC 9554 processors (128 cores, 256 threads)
- 1.5 TiB RAM (787 GiB dedicated to buffer/cache)
- NVIDIA T4 GPUs via JLAB HPC cluster (SLURM-managed)

## References

### Papers on ML Applications in Physics

- Palo & Molzon (2024). "Neural network applications to improve drift chamber..." *Nuclear Instruments and Methods in Physics Research*. DOI: 10.1016/j.nima.2024.169404
- Zhou et al. (2023). "Exploring QCD matter in extreme conditions with ML." *Progress in Particle and Nuclear Physics*. DOI: 10.1016/j.ppnp.2023.104084
- He et al. (2024). "ML for double-Λ hypernuclear events in emulsions." *Nuclear Instruments and Methods*. DOI: 10.1016/j.nima.2024.170196
- Yang et al. (2023). "Neural Networks for orienting heavy-ion collision events." *Physics Letters B*. DOI: 10.1016/j.physletb.2023.138359

### Core ML Methodology & Tools

- Schmidhuber (2015). "Deep Learning." *Neural Networks*. DOI: 10.1016/j.neunet.2014.09.003
- Bergstra & Bengio (2012). "Random search for hyperparameter optimization." *JMLR*, 13, 281-305. http://jmlr.org/papers/v13/bergstra12a.html
- Kingma & Ba (2015). "Adam: A method for stochastic optimization." arXiv. https://arxiv.org/abs/1412.6980
- PyTorch Adam Optimizer Documentation: https://pytorch.org/docs/stable/optim.html
- ROOT Data Analysis Framework: https://root.cern/
- Karpathy (2016). "A Recipe for Training Neural Networks." https://karpathy.github.io/

---

*Published: April 17, 2025 | Research conducted at Lamar University in collaboration with Jefferson Laboratory*
