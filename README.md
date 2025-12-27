# Pokédex Application

This is a full-stack Pokédex application featuring a React-based frontend and a Flask-based backend.

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.10 or higher)

## Setup and Running

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  (Optional) Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: If a requirements.txt file doesn't exist, install the necessary packages manually: `pip install flask flask-cors`)*

4.  Run the server:
    ```bash
    python3 app.py
    ```
    The backend server will start on `http://localhost:8080`.

### 2. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:5173`.

## Usage

-   **Browse**: Scroll through the list of Pokémon.
-   **Search**: Use the search bar to find Pokémon by name.
-   **Filter**: Use the type dropdown to filter by Pokémon type.
-   **Sort**: Use the sort buttons (Asc/Desc) to order Pokémon by ID.
-   **Details**: Click on any card (except the capture/release button) to view detailed stats in a holographic 3D modal.
-   **Capture**: Click the "CAPTURE" button to mark a Pokémon as captured.
-   **Release**: Click "RELEASE" to unmark a Pokémon. Captures are persisted in the backend memory while the server is running.
