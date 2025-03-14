## Security of the Leopardy Project

Leopardy is a web-based quiz game inspired by *Jeopardy!* that allows users to create, save, and play custom game boards.

### Security Policies
- The project avoids using PHP on the server side, opting for Node.js instead.
- User authentication and account management are not yet implemented, but they are planned to be integrated with a secure platform.
- The JSON files used for the game boards include a versioning system (`"version": "2.0"`) and Base64 encryption.
- Protection against unauthorized modifications of JSON files will be implemented in the future with user authentication.

## Supported Versions

The following versions reflect the main security updates and functionality improvements, along with security update support.

| Version | Supported          |
| ------- | ------------------ |
| 0.5.x   | :white_check_mark: |
| 0.4.x   | :white_check_mark: |
| 0.3.x   | :x:                |
| < 0.3   | :x:                |

## Project Versioning

### Version 0.1.0
- Initial project creation.
- Basic structure with HTML, CSS, and JavaScript.
- Use of Bootstrap for UI design.
- Local saving of game boards in JSON format.

### Version 0.2.0
- Added gameplay mode with JSON file loading.
- Introduced `create.html` for creating custom game boards.
- Integrated jQuery for dynamic UI management.

### Version 0.3.0
- Improved graphical interface.
- Support for scoreboard management with multiple players.
- Implemented an overlay for questions with manual answer revelation.

### Version 0.4.0
- Introduced Base64 encryption for questions and answers in JSON files.
- Added versioning management in JSON files (`"version": "2.0"`).
- Fact-checking button with ChatGPT API to verify question answers.

### Version 0.5.0 (WIP)
- Future implementation of a login/signup system with a database.
- Ability to save game boards online with public or private visibility.
- Added security system to prevent manual modification of JSON files.

## Security Best Practices
- **Input Validation**: Not yet implemented, will be integrated with user management.
- **JSON File Protection**: Currently, files can be manually modified, but future updates will include author verification and integrity checks.
- **Authentication and Authorization**: Planned for the future, with secure user credential management.

## Reporting a Vulnerability

To report security issues, contact the project maintainer.
Provide detailed information about the vulnerability and its potential impact. We will keep you updated on the status of the report periodically.
"""
