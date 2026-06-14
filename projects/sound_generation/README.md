# 🎵 Creative Mirror: Audio Generation via Normalizing Flows

**Creative Mirror** is an advanced generative machine learning project designed to act as a *"subconscious musical explorer."* Instead of standard text-to-audio generation, this project maps raw audio inputs (like a human hum or a guitar chord) into a smooth probability distribution using **Variational Autoencoders (VAEs)** and **Normalizing Flows**.

This allows an artist to sample the immediate mathematical "neighborhood" of their idea, generating coherent, unexpected audio variations spanning human vocals, instruments, and environmental textures.

---

## 🏗️ Architecture Overview

The system operates in a **two-stage generative pipeline**:

### 1. The Audio Bottleneck — Convolutional VAE
Raw 3-second `.wav` files are converted into 2D Mel-Spectrograms ($80 \times 258$). Because Normalizing Flows struggle with immense dimensions, a Convolutional VAE acts as a compressor, squashing the audio image into a dense **256-dimensional Latent Vector** ($z$).

### 2. The Flow Explorer — RealNVP Affine Flow
A high-efficiency Affine Coupling Normalizing Flow learns to bijectively map this 256-dimensional audio latent space to a standard Gaussian distribution. During inference, we sample standard noise, run it **backward** through the Flow to get a latent vector, and decode it through the VAE to dream up entirely new sounds.

> **Hardware Optimized:** Built specifically to leverage Apple Silicon (`mps`) and NVIDIA (`cuda`) architectures for rapid, in-memory training.

---

## 🛠️ Setup & Installation

We recommend using a dedicated virtual environment.

```bash
# Create and activate environment
python3 -m venv venv
source venv/bin/activate

# Upgrade pip and install requirements
pip install --upgrade pip
pip install -r requirements.txt
```

### Weights & Biases (W&B) Dashboard

This project is deeply integrated with W&B for real-time visualization of **Reconstruction Loss**, **KL Divergence**, and live rendering of *"Dreamt"* Mel-Spectrograms during training.

```bash
wandb login
```

---

## 📊 Data Preparation

Before running the pipeline, download the following datasets and place them directly into your `data/raw/` directory:

| Dataset | File |
|---------|------|
| [VocalSet](https://zenodo.org/record/1442513) | `VocalSet.zip` |
| [NSynth](https://magenta.tensorflow.org/datasets/nsynth) | `nsynth-valid.jsonwav.tar` |

---

## 🚀 Running the Project

The training process strictly follows a **3-step pipeline**. Do not skip steps.

### Step 1: Preprocess the Audio *(Data Engineering)*

Extracts the raw archives, crawls for `.wav` files, standardizes them to 3 seconds at 22,050 Hz, converts them to normalized Mel-Spectrograms, and saves them as PyTorch `.pt` tensors.

```bash
python src/data/preprocessing.py
```

### Step 2: Train the Bottleneck *(Compression)*

Trains the Convolutional VAE to compress the $80 \times 258$ audio images into a 256-dimensional space and reconstruct them.

**Output:** `outputs/checkpoints/vae_best.pt`

```bash
python scripts/train_vae.py
```

### Step 3: Train the Normalizing Flow *(Generation)*

Loads the frozen `vae_best.pt` to encode the dataset on-the-fly. Trains the Affine Normalizing Flow on the resulting 256-dimensional latent space to learn the overall sound distribution.

**Output:** `outputs/checkpoints/flow_best.pt`

```bash
python scripts/train_flow.py
```

---

## 📂 Project Structure

```
.
├── data/
│   ├── raw/                  # Place downloaded .zip / .tar datasets here
│   └── processed/            # Preprocessed .pt Mel-Spectrogram tensors
├── outputs/
│   └── checkpoints/          # Trained model weights (vae_best.pt, flow_best.pt)
├── notebooks/
│   └── explore_preprocessing.ipynb  # Visually inspect 2D audio representations
├── src/
│   ├── data/
│   │   ├── dataset.py        # PyTorch Dataset class
│   │   └── preprocessing.py  # Audio → Mel-Spectrogram pipeline
│   └── models/               # VAE components, AudioLatentFlow, LatentFlowTrainer
└── scripts/                  # Execution scripts for each training phase
```


afconvert -f WAVE -d LEI16 data/raw/seed_audio.m4a data/raw/seed_audio.wav