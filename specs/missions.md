# Mission Specification — Angular Lab

## Mission Structure

Every mission follows the same structure so learners know what to expect.

### Front Matter

- Title: a clear, outcome-focused name.
- Goal: one sentence describing what the learner will be able to do after finishing.
- Prerequisites: a list of missions or concepts the learner should already know.
- Difficulty: beginner, intermediate, or advanced.
- Estimated duration in minutes.

### Sections

1. **Introduction** — explain the real-world problem the mission solves.
2. **Concepts** — present the ideas needed for the mission.
3. **Walkthrough** — guide the learner through a working example.
4. **Practice** — let the learner modify or build code.
5. **Comparison** — discuss alternative approaches.
6. **Checkpoint** — verify understanding with lightweight questions.
7. **Summary** — recap what was learned and preview the next mission.

## Step Rules

- Each step has a single learning objective.
- Steps must not introduce more than one new concept at a time.
- Code in a step must be runnable without extra setup.
- Steps must include a clear call to action.

## Mission State

A mission can be in one of the following states:

- **Not started:** the learner has not opened the mission.
- **In progress:** the learner has completed at least one step.
- **Completed:** the learner has reached the final checkpoint.
- **Reset:** the learner cleared progress and returned to the initial state.

## Reset Behavior

- Resetting a mission restores all code examples to their initial content.
- Resetting does not affect progress in other missions.
- The learner must confirm before a reset occurs.

## Code Examples

- Every code example must have a default state that runs without errors.
- Examples may be read-only or editable.
- Editable examples must save changes to mission state.
- Examples must include a reset button that restores the default code.

## Preview Behavior

- The preview panel shows the result of the current code.
- The preview updates automatically when code changes.
- If the code contains an error, the preview displays a friendly message.
- The preview must be isolated from the rest of the application.

## Mission Catalog Rules

- Missions are grouped by track.
- Missions within a track are ordered by difficulty.
- Learners can filter missions by difficulty and topic.
- Completed missions are visually marked.
