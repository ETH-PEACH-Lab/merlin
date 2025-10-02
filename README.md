# Merlin Study

Merlin Study is a modified version of Merlin designed for conducting user studies on the syntax of Merlin Lite.

To participate in the study, visit our [Study Link Placeholder]().

## Study Environment Features

### User Experience
- **Group Assignment**: Participants are randomly assigned to Group A (Merlin-first) or Group B (Tikz-first) to test tool ordering effects.
- **Progressive Tasks**: Study includes introduction, multiple coding tasks, and final survey.
- **Real-time Feedback**: Immediate syntax validation and error highlighting for Merlin Lite code.
- **Documentation Access**: Integrated help system accessible during tasks.

### Logging and Analytics
The study environment automatically logs comprehensive user interaction data:

- **Task Events**: Start/completion of exercises, phase transitions (explore/task).
- **Code Interactions**: Parse/compile errors, suggestion acceptance, copy/paste actions.
- **Navigation**: Documentation access, link clicks.
- **Code Snapshots**: Periodic captures of code state for analysis.
- **Performance Metrics**: Task duration, error counts, completion status.

### Integrations
- **PostHog**: Tracks user behavior and analytics throughout the study session.
- **Tally.so**: Collects structured feedback and survey responses at study completion.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or pnpm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ETH-PEACH-Lab/merlin.git
   cd merlin
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory based on `.env.example`. This file should include API keys for the following services:
   - **PostHog**: For analytics and user behavior tracking.
   - **Tally.so**: For collecting user feedback and study responses.

   Example `.env` file:
   ```
   POSTHOG_API_KEY=your_posthog_api_key_here
   POSTHOG_HOST=your_posthog_host_here
   ```

   **Note**: Replace the placeholder Tally.so survey link in `src/study/StudyUI.jsx` with the actual survey URL. For your form use the hidden field `uid`, this will be automatically filled with the uid from the user. Also provide a file upload, where the user can upload the backup file.

4. Note: The GUI editor is disabled in this study version.

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:8080`

## Study Components

### LogInspector

The LogInspector is a tool for analyzing study participant data and logs. It provides multiple views and features:

#### Modes

- **Logs**: View individual log entries with filtering by type and content. Supports uploading participant backup JSON files or PostHog CSV exports. Allows exporting filtered logs to CSV.

- **Exercises**: Automatically derives exercises from logs, showing metrics like parse errors, compile errors, suggestions accepted, copy/paste actions, and navigation events. Displays code snapshots and allows rendering of Merlin or Tikz code.

- **Cohort**: Multi-participant analysis view. Upload multiple participant JSON files to compare attempts across users. Shows aggregated metrics per task, supports filtering by completion status and task type. Includes participant merging and hiding features.

- **Cohort Code**: Displays code submissions for a selected exercise across all participants. Shows code length, source (localStorage, snapshot, or context), and allows rendering. Supports exporting codes to CSV for analysis.

#### Features

- Upload participant data from JSON backups or PostHog analytics exports
- Real-time filtering and column visibility toggles
- Code rendering for both Merlin and Tikz syntax
- Export capabilities for logs, attempts, and codes in CSV format
- Participant management (merge, hide/show) for cohort analysis
- Exercise metrics and code snapshot viewing
