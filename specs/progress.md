# Progress Specification — Angular Lab

How learner progress is stored and synchronized. Complements `specs/missions.md` (Mission State) and `specs/auth.md`.

## Storage Model

- **Guest:** progress lives only in the browser's local storage. No network calls related to progress are ever made.
- **Authenticated user:** progress still writes to local storage first (the app never blocks on the network) and is synchronized to the server in the background.
- Progress is scoped per learner and per mission, and follows the mission lifecycle in `specs/missions.md` (not started / in progress / completed / reset).

## What Is Stored

For each mission the learner has touched:

- Current step.
- Code edited per step.
- Whether the mission is completed (and when).
- A last-modified timestamp used for synchronization.

## Synchronization

- Sync starts when a learner becomes authenticated (log in, sign up, or an existing session on app load).
- On sync, local and remote progress are merged per mission: the entry with the most recent last-modified timestamp wins; ties resolve in favor of the remote copy.
- After the merge, the winning entries exist on both sides: newer remote entries are written to local storage, newer local entries are pushed to the server.
- While authenticated, every progress change is also pushed to the server. Pushes are debounced so rapid step or code changes do not produce a request per keystroke.
- Sync failures are silent: local progress is never lost, and the next change or next login retries naturally.

## Logout

- Logging out never deletes local progress. After logout the learner continues as a guest with the same local data.

## Dashboard

- The dashboard shows real progress: missions started, missions completed, and per-mission percentage.
- Guests see the same view based on local data, with copy making clear where the data lives.

## API

Session-cookie authenticated (see `specs/auth.md`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress` | List all progress entries for the current user |
| PUT | `/api/progress` | Upsert one mission's progress |

- Unauthenticated requests return 401.
- Payloads are validated; malformed bodies return 400 with a readable message.
- The server never lets an older entry overwrite a newer one: such a write is ignored and the newer stored entry is returned instead.
- One entry per user and mission; entries are replaced whole (no history).

## Conflict Resolution Notes

- The last-modified timestamp is produced by the learner's browser on each change and trusted by the server only for comparison (last writer wins). Small clock differences between devices are acceptable at this scale.
