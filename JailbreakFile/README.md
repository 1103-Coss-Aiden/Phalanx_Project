# LLM Jailbreak Evaluation Framework
## Setup Instructions

### 1. Create and Activate a Virtual Environment (Recommended)

**On macOS / Linux**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows**
```bash
python -m venv venv
venv\Scripts\activate
```

---

### 2. Install Dependencies
Make sure you have Python 3.9+ installed, then run:
```bash
pip install -r requirements.txt
```

---

### 3. Set Up Environment Variables
This project prototype requires a Groq API key.

Create a `.env` file in the project root:
```plaintext
GROQ_API_KEY=your_api_key_here
```

---

### 4. Configure the Experiment
Edit `config.yaml` to specify:
- Target model
- Judge model
- Path to the attacks JSON file
- Results output directory

---

### 5. Add Attack Prompts
Ensure an `attacks.json` file exists in the project root containing the jailbreak and benign prompts to evaluate.

---

### 6. Run the Evaluation

Using the simple runner:
```bash
python runner.py
```

Or using the command-line interface:
```bash
python cli.py run
```

---

### 7. View Results
Evaluation outputs are saved under the `results/` directory, including:
- A detailed JSON file with per-attack results
- A summary JSON file containing computed metrics

Note: ChatGPT was used to help with portions of this experiment.