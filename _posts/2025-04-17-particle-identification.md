---
layout: post
title: "Deep Learning-Based Particle Identification In The Glue-X Experiment"
author: "Anupam Siwakoti"
date: 2025-04-17
categories: [Machine Learning, Physics, Deep Learning]
tags: [particle identification, neural networks, GlueX, quantum chromodynamics]
---

# Deep Learning-Based Particle Identification In The Glue-X Experiment

**Author:** Anupam Siwakoti  
**Supervisor:** Dr. Jing Zhang  
**Co-Advisors:** Dr. Philip L. Cole, Dr. Igal Jaegle

## Introduction

The Glue-X experiment at Jefferson Laboratory (JLAB) in Hall D explores Quantum Chromodynamics (QCD) using advanced particle detection techniques. This research integrates deep learning with hyperparameter optimization to develop an efficient particle identification pipeline for physicists.

## Challenges in Particle Identification

- Traditional methods rely on expert-driven, labor-intensive tuning, susceptible to human error and subjective biases
- Difficult to trace misclassifications due to complex inter-feature correlations
- Deployment challenges dependent on context
- Manual analysis methods significantly prolong data interpretation, delaying insights and increasing publication timelines

## Objectives

1. **Integrating Hyperparameter Optimization** - Optimize model performance through advanced feature engineering and hyperparameter tuning tailored to particle-specific datasets
2. **Investigate Feature Influence** - Study how input features influence model performance for particle identification
3. **Comparative Study** - Compare deep learning models with classical ML approaches like Random Forests
4. **Develop Plug-and-Play Pipeline** - Create a reproducible pipeline for physicists to run particle identification experiments

## Importance of Machine Learning in Particle Identification

- Neural networks offer more flexibility than hand-cuts, allowing parameter tuning and deeper insights
- Machine learning achieves high accuracy, speeds up predictions, and supports exploration of particle behavior
- Handles millions of data points efficiently and scales easily with computational needs
- Potential to accelerate the process from analysis to publication

## The GlueX Experiment

Located at Jefferson Lab Hall D, GlueX uses the Bremsstrahlung technique to produce photon beams with:
- Energy range: 6 to 11.7 GeV
- Momentum: 50 MeV
- Angular range: 1° to 120°
- Tracked particles: e±, μ±, π±, p±, K±

The detector records approximately 2 petabytes of data over 100 days of operation.

## Detector Data Processing

**Key Features Extracted:**
- **dE/dx vs. Momentum**: Energy loss per unit distance recorded in CDC
- **Energy Ratio**: Ratio between energy deposited in calorimeters (BCAL/FCAL) and CDC
- **Combined Features**: Combination of CDC and FCAL/BCAL values

## Tools and Technologies

- **PyTorch** - Deep learning framework for model training and deployment
- **Pandas & NumPy** - Data manipulation and numerical operations
- **Matplotlib** - Data visualization
- **Optuna** - Hyperparameter optimization
- **Uproot** - ROOT file parsing for particle physics datasets
- **JLab HPC** - High-performance computing with GPU support (NVIDIA T4s)

## Hardware Configuration

- **CPU**: Dual AMD EPYC 9554 processors with 128 cores and 256 threads
- **Memory**: 1.5 TiB RAM with 787 GiB dedicated buffer/cache
- **Execution**: SLURM-managed batch jobs on JLab HPC cluster

## Data Loading and Preprocessing

### Data Format Support
- JSON, ROOT, CSV file formats

### Data Split
- 70% Training / 30% Testing

### Label Encoding
- K+: 0
- P+: 1
- π+: 2
- e+: 3
- μ+: 4

### Data Cleaning
Rows containing NaN (missing) or Inf (infinite) values are removed to ensure clean data input critical for:
- Reliable training
- Accurate evaluation
- Reproducibility of experiments

## Feature Engineering

### Cut-Based Analysis
A cut of 0.25 to 1.25 on the trk_e_p benchmark increased accuracy from 80% to 94% in particle identification.

### Feature Selection
Highly correlated features (trk_fcal_dx_min, trk_fcal_dy_min, trk_fcal_e, trk_fcal_t, trk_Nblk) were removed to reduce redundancy.

### Normalization
Normalization ensures:
- Balanced feature impact across the network
- Faster model convergence during training
- Prevention of large-scale features dominating model weights

## Model Architecture

### Activation Function
**ReLU (Rectified Linear Unit)**: $$f(x) = \max(0, x)$$

ReLU was chosen over Sigmoid/Tanh because it:
- Preserves strong activations and zeros out irrelevant ones
- Enables faster convergence during hyperparameter optimization
- Reduces vanishing gradient problems

### Output Layer - Softmax
Converts raw network outputs (logits) into probability distributions:

$$\text{softmax}(z_i) = \frac{e^{z_i}}{\sum_j e^{z_j}}$$

## Loss Function

**Categorical Cross-Entropy**: Measures how close predicted probabilities are to true classes.

$$\text{CrossEntropy} = -\sum_i y_i \log(\hat{y}_i)$$

Where:
- $$y_i$$ = true label (0 or 1)
- $$\hat{y}_i$$ = predicted probability

## Model Monitoring

Gradients are monitored throughout training to detect:
- **Vanishing Gradients**: Very close to 0, stopping lower layers from learning
- **Exploding Gradients**: Very large values destabilizing training
- **Stable Training**: Consistent gradient ratio (close to 1.0)

## Hyperparameter Optimization

Using **Optuna** for automated hyperparameter search:
- Learning rate optimization
- Number of layers and hidden units tuning
- Dropout rate adjustment
- Batch size and epoch tuning
- Activation function selection

This efficient exploration balances architecture complexity with learning dynamics.

## Model Evaluation Metrics

### Precision
Of all particles predicted as μ+, how many were actually μ+?

$$\text{Precision} = \frac{TP}{TP + FP}$$

### Recall
Of all actual μ+ particles, how many were correctly identified?

$$\text{Recall} = \frac{TP}{TP + FN}$$

### F1-Score
Harmonic mean of precision and recall:

$$\text{F1} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

### Confusion Matrix
Detailed breakdown of classification performance across all particle types.

## Experimental Results

### Validation Set Performance (Partial Dataset)
| Class | Precision | Recall | F1-Score |
|-------|-----------|--------|----------|
| k+    | 0.63      | 0.92   | 0.75     |
| μ+    | 0.66      | 0.95   | 0.78     |
| p+    | 0.94      | 0.96   | 0.95     |
| e+    | 0.93      | 0.99   | 0.96     |
| **Micro Avg** | **0.77** | **0.96** | **0.85** |
| **Macro Avg** | **0.79** | **0.95** | **0.86** |

### Test Set Performance (Completely New Data)
| Class | Precision | Recall | F1-Score |
|-------|-----------|--------|----------|
| k+    | 0.88      | 0.85   | 0.87     |
| μ+    | 0.90      | 0.98   | 0.94     |
| p+    | 0.97      | 0.88   | 0.92     |
| e+    | 0.96      | 0.98   | 0.97     |
| **Micro Avg** | **0.93** | **0.93** | **0.93** |
| **Macro Avg** | **0.93** | **0.92** | **0.92** |

### Key Findings
- ✓ **Best Performance**: e+ and p+ with F1-scores greater than 0.95
- ✓ **Model Generalization**: Test set performance validates model robustness
- ⚠ **Challenge**: π+ classification performance decreases overall accuracy due to insufficient feature discrimination

### Negative Particle Classification
| Class | Precision | Recall | F1-Score |
|-------|-----------|--------|----------|
| k-    | 0.82      | 0.80   | 0.81     |
| μ-    | 0.77      | 0.91   | 0.83     |
| p-    | 0.91      | 0.91   | 0.91     |
| e-    | 0.95      | 0.97   | 0.96     |
| **Micro Avg** | **0.85** | **-** | **-** |

Model demonstrates strong performance for negative particles as well.

## Comparative Study: Deep Learning vs Random Forest

### Random Forest Results
- **Model Size**: 50GB (extremely large)
- **Training Time**: ~32 hours
- **Memory Requirements**: Massive RAM footprint
- **Classification Accuracy**: Similar to neural networks
- **Computational Overhead**: Significant

### Conclusion
While Random Forests achieved competitive accuracy, their computational demands make them unsuitable for real-time or large-scale deployment compared to the efficient neural network pipeline.

## Limitations

1. **Optimizer Limitation**: Only Adam optimizer was used. Exploring combinations with SGD or adaptive scheduling could yield better results.
2. **Angular Range Constraint**: Model was limited to classifying specific angle degrees; a broader, more generalizable architecture is needed for full-range angular predictions.

## Conclusion

This research successfully demonstrates that deep learning can effectively classify particles in GlueX detector data, offering a scalable and adaptable approach for particle identification. While classical models like Random Forests showed competitive accuracy, their computational demands make them less suitable for real-time or large-scale deployment.

The study highlights significant potential for further improvements through:
- Advanced optimization strategies
- Development of more generalizable models across broader angular ranges
- Exploration of ensemble methods
- Fine-tuning for specific particle types

The complete codebase has been hosted on GitHub, ensuring code accessibility and reproducibility of the machine learning pipeline for the particle physics community.

## References

### Papers on ML Applications in Physics
- Palo & Molzon (2024). Neural network applications to improve drift chamber. DOI:10.1016/j.nima.2024.169404
- Zhou et al. (2023). Exploring QCD matter in extreme conditions with ML. DOI:10.1016/j.ppnp.2023.104084
- He et al. (2024). ML for double-Λ hypernuclear events in emulsions. DOI:10.1016/j.nima.2024.170196
- Yang et al. (2023). NN for orienting heavy-ion collision events. DOI:10.1016/j.physletb.2023.138359

### Core ML Methodology & Tools
- Schmidhuber (2015). Deep learning overview. DOI:10.1016/j.neunet.2014.09.003
- Bergstra & Bengio (2012). Random search for hyperparameter optimization. http://jmlr.org/papers/v13/bergstra12a.html
- Kingma & Ba (2015). Adam optimizer. https://arxiv.org/abs/1412.6980
- PyTorch – Adam Optimizer. https://pytorch.org/docs/stable/optim.html
- ROOT – Data Analysis Framework. https://root.cern/
- Karpinsky (2016). Recipe for training neural networks. https://karpathy.github.io/