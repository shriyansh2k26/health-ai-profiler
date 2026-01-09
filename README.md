# 🏥 Health Risk Profiler


A Node.js backend service that uses Large Language Models to analyze patient data and generate clinical risk assessments.


---

## 🧐 Overview
The **Health Risk Profiler** transforms unstructured clinical text into structured health insights. It solves the problem of manual data interpretation by automating the extraction of key health metrics.

## 🏗 Architecture
The system employs a **Modular AI Pipeline** to ensure accuracy and safety:

```mermaid
graph TD;
    A[Unstructured Input] --> B[Extraction Layer];
    B --> C{Validation Engine};
    C -->|Valid| D[Risk Scoring Logic];
    C -->|Invalid| E[Error Handler];
    D --> F[Final Health Report];




## ✨ Key Features
* **Multimodal Extraction**: Seamlessly supports various clinical data formats, including unstructured text and medical records.
* **Predictive Scoring**: Provides real-time risk assessment for chronic conditions by combining AI analysis with deterministic logic.
* **Safety Guardrails**: Implements strict schema enforcement and validation (via Zod) to prevent AI hallucinations and ensure data integrity.

---

## 🏗 Architecture
The system utilizes a modular pipeline to process health data safely and accurately:
1. **Extraction Layer**: Parses raw input into a structured JSON format.
2. **Scoring Engine**: Evaluates extracted data against clinical risk parameters.
3. **Guardrail Layer**: Validates all outputs against predefined schemas.

---

## 🚀 Getting Started

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/shriyansh2k26/health-ai-profiler
   cd health-ai-profiler

2.**Configure environment variables: Create a .env file in the root directory**:
Code snippet:
  a)GROQ_API_KEY=your_api_key_here
  b)PORT=3000

## API USAGE EXAMPLE:
  
  Endpoint: POST /api/v1/health/analyze
  {
  "textData": "Patient is 45, smoker, and rarely exercises."
  }



