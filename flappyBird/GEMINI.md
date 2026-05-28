# GEMINI.md

## Project Overview
This repository is dedicated to the development of a **Flappy Bird** game application. The project's primary objective is to create a playable, feature-complete version of the classic game with a focus on a clean UI and essential gameplay mechanics.

### Core Goals (from prompts.md)
- **Interactive UI**: A simple and functional user interface.
- **Game Controls**: Implementation of Play and Pause features.
- **Scoring System**: A reliable system to track and display the player's score.

## Technology Stack (Proposed)
Based on the project's goal for a "ready to play" application with a simple UI, the following stack is recommended:
- **Frontend**: HTML5, CSS3, and JavaScript (ES6+).
- **Game Engine**: Vanilla JavaScript using the Canvas API for rendering.

## Project Structure (Planned)
- `index.html`: The main entry point and container for the game canvas.
- `style.css`: CSS for styling the UI and game container.
- `script.js`: Core game logic, including physics, collision detection, and scoring.
- `assets/`: Directory for game assets like images and audio.

## Building and Running
- **Running**: Open `index.html` in any modern web browser to play the game once implemented.
- **Development**: No build step is currently required for this vanilla stack.

## Development Conventions
- **Modularity**: Keep game logic, rendering, and state management distinct.
- **Consistency**: Use clear naming conventions for game entities (e.g., `bird`, `pipe`, `score`).
- **Interaction**: Ensure touch and keyboard events are handled for accessibility.

## Next Steps
1. Initialize the project with `index.html`, `style.css`, and `script.js`.
2. Implement the basic game loop and physics.
3. Add the UI elements for Play/Pause and Scoring.
