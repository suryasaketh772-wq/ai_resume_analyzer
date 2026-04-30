# AI Resume Analyzer

A full-stack, production-ready Single Page Application designed to help candidates optimize their resumes against specific job roles using state-of-the-art Local Generative AI and Natural Language Processing.

## Features

- **True Generative AI**: Uses a local Llama 3 model (via Ollama) to read your resume contextually and generate personalized, actionable feedback and a match score.
- **Smart Contact Extraction**: Automatically extracts the candidate's Name, Email, and Phone Number directly from the uploaded PDF using spaCy (Named Entity Recognition).
- **Categorized Job Roles**: Choose from highly specific tech roles grouped by categories (Web Development, Data & AI, Cloud & DevOps, Testing).
- **Export to PDF**: Generate and download a pixel-perfect A4 report of your AI analysis dashboard with a single click.
- **Full Stack Architecture**: Built with a FastAPI/PostgreSQL backend and a beautifully designed React/Vite frontend.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- TypeScript
- Lucide Icons
- html2canvas & jsPDF (for PDF generation)

**Backend:**
- FastAPI (Python)
- PostgreSQL & SQLAlchemy (Database & ORM)
- PyMuPDF (PDF parsing)
- spaCy (NLP / Named Entity Recognition)
- Ollama (Local LLM Engine)

## Local Setup

### 1. Prerequisites
- **Node.js** (for frontend)
- **Python 3.10+** (for backend)
- **PostgreSQL** (running locally)
- **Ollama** (for local AI engine)

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set up your `.env` file with your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/resume_analyzer"
   ```
4. Run the database seed script to populate job roles:
   ```bash
   python seed.py
   ```
5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 4. Running the Local AI (Ollama)
To enable the Generative AI feedback engine, ensure Ollama is installed on your machine and run the following command to download the Llama 3 model:
```bash
ollama run llama3
```
*Note: If the Ollama server isn't running, the application will seamlessly fall back to a standard keyword-matching algorithm.*

## License
MIT License
