# PetGuardian 🐾

## Web-Based Intelligent Pet Health & Safety System

A comprehensive platform for pet owners to manage their pet's health records, vaccinations, medical history, and connect with veterinarians.

---

### 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

---

### ✨ Features

#### 1. **User Management System**
- Pet owner registration and login
- Veterinarian accounts with clinic details
- Admin dashboard for system management
- Role-based access control (RBAC)

#### 2. **Digital Pet Health Passport**
- Create and manage pet health records
- Store vaccination schedules
- Track medical conditions and allergies
- Generate QR codes for quick sharing

#### 3. **Medical History & Health Analysis**
- Maintain detailed medical records
- AI-powered health predictions
- Disease risk assessment
- Health trend visualization

#### 4. **Chatbot & Community**
- AI chatbot for pet care guidance
- Community discussion forum
- Direct messaging between owners and vets

---

### 🛠 Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React, HTML5, CSS3, JavaScript, Tailwind CSS |
| **Backend** | Java (Spring Boot Framework) |
| **Database** | MySQL 8.0+ |
| **AI/ML** | Python (Flask API, TensorFlow/Keras) |
| **APIs** | Google Maps API, Java ZXing (QR Codes) |
| **Cache** | Redis (Real-time features) |
| **Deployment** | Docker, Docker Compose |

---

### 📁 Project Structure

```
PetGuardian-group5-AIML/
│
├── 📄 README.md                        # Project overview
├── 📄 SETUP.md                         # Setup & installation guide
├── 📄 ARCHITECTURE.md                  # System architecture overview
├── 📄 CONTRIBUTING.md                  # Contribution guidelines
├── 📄 LICENSE                          # Project license
├── 📄 docker-compose.yml               # Multi-service Docker orchestration
├── 📄 .env.example                     # Environment variable template
├── 📄 .gitignore                       # Git ignore rules
│
├── 🌐 frontend/                        # React + Tailwind CSS Frontend
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx
│       ├── index.jsx
│       ├── components/                 # Reusable UI components
│       │   ├── Navbar/
│       │   ├── Footer/
│       │   ├── PetCard/
│       │   ├── VaccinationBadge/
│       │   └── QRCodeDisplay/
│       ├── pages/                      # Route-level page components
│       │   ├── Home/
│       │   ├── Login/
│       │   ├── Register/
│       │   ├── Dashboard/
│       │   ├── PetProfile/
│       │   ├── HealthPassport/
│       │   ├── MedicalHistory/
│       │   ├── VetDirectory/
│       │   ├── Community/
│       │   └── Admin/
│       ├── hooks/                      # Custom React hooks
│       ├── context/                    # React Context providers (Auth, Theme)
│       ├── services/                   # Axios API call wrappers
│       ├── store/                      # State management (Redux / Zustand)
│       ├── utils/                      # Helper functions
│       └── assets/                     # Images, icons, fonts
│
├── ☕ backend/                         # Java Spring Boot REST API
│   ├── pom.xml                         # Maven dependencies
│   ├── config/                         # App config files
│   ├── logs/                           # Application logs
│   └── src/
│       └── main/
│           ├── java/com/petguardian/
│           │   ├── PetGuardianApplication.java   # Entry point
│           │   ├── controller/         # REST controllers
│           │   │   ├── AuthController.java
│           │   │   ├── UserController.java
│           │   │   ├── PetController.java
│           │   │   ├── VaccinationController.java
│           │   │   ├── MedicalRecordController.java
│           │   │   └── ChatbotController.java
│           │   ├── service/            # Business logic layer
│           │   ├── repository/         # Spring Data JPA repositories
│           │   ├── model/              # JPA entity classes
│           │   ├── dto/                # Data Transfer Objects
│           │   ├── security/           # JWT, Spring Security config
│           │   └── config/             # Spring configuration classes
│           └── resources/
│               ├── application.yml
│               ├── application-dev.yml
│               └── application-prod.yml
│
├── 🤖 ai-service/                      # Python Flask AI/ML Microservice
│   ├── app.py                          # Flask application entry point
│   ├── requirements.txt                # Python dependencies
│   ├── models/                         # Trained ML model files (.h5, .pkl)
│   ├── routes/                         # Flask route blueprints
│   │   ├── health_prediction.py
│   │   ├── chatbot.py
│   │   └── disease_risk.py
│   ├── services/                       # ML business logic
│   │   ├── prediction_service.py
│   │   └── nlp_service.py
│   └── training/                       # Model training notebooks & data
│       ├── notebooks/
│       └── datasets/
│
├── 🗄 database/                        # Database scripts
│   ├── schemas/
│   │   └── petguardian_schema.sql      # Full schema definition
│   └── migrations/
│       └── V1__init_schema.sql         # Flyway migration files
│
├── 🐳 deployment/                      # Deployment configuration
│   ├── docker/
│   │   ├── backend.Dockerfile
│   │   ├── frontend.Dockerfile
│   │   └── ai-service.Dockerfile
│   └── kubernetes/
│       ├── namespace.yaml
│       ├── backend-deployment.yaml
│       ├── frontend-deployment.yaml
│       └── ai-service-deployment.yaml
│
├── 📚 docs/                            # Project documentation
│   ├── api-spec/                       # OpenAPI / Swagger specs
│   ├── diagrams/                       # ERD, class diagrams, sequence diagrams
│   ├── requirements/                   # SRS, functional requirements
│   └── wireframes/                     # UI wireframes & mockups
│
├── 🧪 tests/                           # Test suites
│   ├── backend/                        # JUnit + Mockito tests
│   ├── frontend/                       # Jest + React Testing Library
│   └── ai-service/                     # Pytest tests
│
└── 🖼 images/                          # Project screenshots
```

---

### 🚀 Getting Started

See [SETUP.md](SETUP.md) for full installation instructions.

**Quick start with Docker:**
```bash
# 1. Clone the repository
git clone https://github.com/your-org/PetGuardian-group5-AIML.git
cd PetGuardian-group5-AIML

# 2. Create your environment file
cp .env.example .env
# Edit .env with your values

# 3. Start all services
docker-compose up --build
```

**Services will be available at:**
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| AI Service | http://localhost:5000 |
| MySQL | localhost:3306 |
| Redis | localhost:6379 |

---

### 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs

---

### 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit pull requests, code style, and branch naming conventions.

---

### 📜 License

This project is licensed under the terms of the [LICENSE](LICENSE) file.