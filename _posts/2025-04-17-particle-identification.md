---
layout: distill
title: Deep Learning-Based Particle Identification In The Glue-X Experiment
description: A comprehensive study on applying deep learning and hyperparameter optimization for particle classification in nuclear physics
tags: deep-learning particle-physics neural-networks machine-learning
giscus_comments: true
date: 2025-04-17
featured: true
mermaid:
  enabled: true
  zoomable: true
code_diff: false
map: false
chart:
  chartjs: false
  echarts: false
  vega_lite: false
tikzjax: false
typograms: false

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
  .fake-img {
    background: #bbb;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
  }
  .fake-img p {
    font-family: monospace;
    color: white;
    text-align: left;
    margin: 12px 0;
    text-align: center;
    font-size: 16px;
  }
---

## Introduction

The Glue-X experiment at Jefferson Laboratory (JLAB Hall D) plays a crucial role in exploring Quantum Chromodynamics (QCD) through particle physics research. This experiment produces a photon beam with energies ranging from 6 to 11.7 GeV using the Bremsstrahlung technique, creating conditions to study exotic particles and fundamental interactions.

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

$$f(x) = \max(0, x)$$

ReLU was chosen over alternatives like Sigmoid or Tanh because it:
- Preserves strong activations and zeros out irrelevant ones
- Enables faster convergence during training—critical for extensive hyperparameter optimization
- Mitigates vanishing gradient problems in deep networks

**Layer Configuration**:

Each layer transforms its input through learned parameters, capturing hierarchical features as data flows through the network. The architecture includes dropout layers for regularization and batch normalization for training stability.

**Output Layer: Softmax**

The softmax function converts raw network outputs (logits) into a probability distribution:

$$\text{softmax}(z_i) = \frac{e^{z_i}}{\sum_j e^{z_j}}$$

**Example**: For a 5-class particle identification problem with logits [0, 1, 2.0, 0, 1]:
$$e^0 = 1, \quad e^1 ≈ 2.718, \quad e^{2.0} ≈ 7.389$$
$$\text{Sum} = 1 + 2.718 + 7.389 + 1 + 2.718 = 14.825$$
$$P(\text{class 1}) = 2.718 / 14.825 ≈ 0.183$$

### Loss Function: Categorical Cross-Entropy

Cross-entropy measures how close predicted probabilities are to true class labels:

$$L = -\sum_i y_i \log(\hat{y}_i)$$

For a true label [0, 0, 1, 0, 0] with predicted probabilities [0.1, 0.2, 0.6, 0.1, 0.0]:

$$L = -\log(0.6) ≈ 0.511$$

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
