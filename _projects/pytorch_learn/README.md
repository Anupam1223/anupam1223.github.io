
# pytorch_learn

This project is organized as a monorepo containing two main parts:

## Project Structure

- `introduction_theory/` — React Slider App (React-based UI components)
- `introduction_practical/` — PyTorch Practicals (Python scripts and notebooks)

---

## 1. React Slider App (`introduction_theory/`)

This folder contains a React application for interactive slider components and related UI.

### Setup & Installation

```bash
cd introduction_theory
npm install
npm start
```

---

## 2. PyTorch Practicals (`introduction_practical/`)

This folder contains Python scripts and practicals for learning PyTorch.

### Setup & Installation

```bash
cd introduction_practical
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

---

## Notes

- Each environment is isolated. You can work on the React app and Python practicals independently.
- For any new Python dependencies, add them to `requirements.txt` in `introduction_practical/`.
- For new React dependencies, use `npm install <package>` inside `introduction_theory/`.
