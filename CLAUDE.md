# Project: [PROJECT_NAME]

## Overview
[Brief description of the project]

## Tech Stack
- Frontend: [e.g., React, Vue, Angular]
- Backend: [e.g., Node.js, Python, Go]
- Database: [e.g., PostgreSQL, MongoDB]
- Infrastructure: [e.g., Docker, AWS, Vercel]

## Code Standards

### Language
- Commits: English
- Code comments: English
- Documentation: English

### Style
- Follow clean code principles
- Prioritize readability for human reviewers
- Avoid overengineering - solve the problem, nothing more
- No premature abstractions
- No unnecessary error handling for impossible scenarios
- Delete unused code completely, no backwards-compatibility hacks

### Commit Convention
```
type(scope): short description

- feat: new feature
- fix: bug fix
- refactor: code restructuring
- docs: documentation
- test: adding tests
- chore: maintenance
```

## Project Structure
```
/src        - source code
/tests      - test files
/docs       - documentation
/scripts    - utility scripts
```

## Development Guidelines
- Run tests before committing
- Keep PRs focused and small
- No console.log/print in production code

## Terminal Commands (Cross-Platform)
**IMPORTANT:** This is a Windows environment with PowerShell/CMD.
- If a terminal command fails twice due to syntax issues (Linux vs Windows, line breaks, chained commands), create a script file in `/scripts/` to solve it:
  - Windows: `.ps1` (PowerShell) or `.bat` (CMD)
  - Cross-platform: `.py` (Python)
- Common issues to avoid:
  - Use `&&` or `;` carefully (different behavior in shells)
  - Avoid heredocs in CMD/PowerShell
  - Path separators: use `/` in code, `\` only when required
  - Line endings: Windows uses CRLF, scripts may need LF
- When in doubt, create a script instead of complex one-liners

## Context for Claude
- [Add specific patterns used in this project]
- [Add libraries/frameworks specifics]
- [Add any domain-specific knowledge]
