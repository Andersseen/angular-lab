# Engagement Specification — Angular Lab

How the platform recognizes and reflects sustained practice. Complements
`specs/progress.md` (what is stored) and `specs/missions.md` (mission lifecycle).

Engagement is **reflective, never coercive**: it reports what the learner has
already done. Nothing here gates content, expires, or competes with other
learners — there are no points, no leaderboards, and no notifications.

## Practice Streak

- A **practice day** is any calendar day on which the learner changed mission
  progress (moved between steps, edited code, reset, or completed a mission).
  Merely opening a mission is not practice.
- Days are recorded in the learner's own calendar, so a day is whatever the
  learner's device considers "today".
- The **current streak** counts consecutive practice days ending today. A streak
  that ends yesterday is still current — the day is not over — but any longer
  gap ends it.
- The **longest streak** is the longest run of consecutive practice days ever
  recorded, and never decreases.
- Practice days are stored per learner. Guests keep them on the device;
  authenticated learners have them synchronized (see *Storage & Sync*).

## Badges

- Badges are **derived, never stored**: they are recomputed from completed
  missions and the practice streak, so they can never drift from reality.
- Every badge is always visible. An unearned badge shows its requirement and how
  far along the learner is; it is never hidden or secret.
- A badge, once earned, cannot be lost by a later recomputation, because every
  requirement is based on a value that never decreases (missions completed,
  longest streak).
- The catalogue:

  | Badge | Earned by |
  |-------|-----------|
  | First Launch | Completing the first mission |
  | Getting Serious | Completing 5 missions |
  | Lab Graduate | Completing every mission in the catalog |
  | Deep End | Completing an advanced mission |
  | *Track* Specialist (one per track) | Completing every mission in that track |
  | Three in a Row | Practicing 3 days in a row |
  | Week Streak | Practicing 7 days in a row |

- Track badges follow the catalog: adding a track adds its badge, and a track's
  requirement is the number of missions currently in it.

## Completion Card

- Finishing a mission produces a shareable completion card showing the mission
  title, its track and difficulty, the completion date, the learner's current
  streak, and how many missions they have completed.
- The card can be saved as an image and its summary copied as text. Sharing is
  entirely manual — the platform never posts anywhere on the learner's behalf.
- The card contains no account information: no email, no name, no identifier.
- The completion view also names the badges that **this** completion earned,
  determined by comparing the learner's badges with and without this mission.

## Where It Appears

- **Dashboard → Achievements:** current streak, longest streak, badges earned
  out of total, and the full badge catalogue with per-badge progress.
- **Mission completion view:** the completion card and any newly earned badges.
- A learner with no practice yet sees the catalogue with everything at zero and
  copy explaining how to start — never an error or an empty screen.

## Storage & Sync

- Practice days follow the same model as progress (`specs/progress.md`): written
  locally first, synchronized in the background when authenticated.
- Practice days **merge by union**: a day recorded on any device is a day
  practiced. Nothing is ever removed by a sync, so the two sides cannot conflict.
- Sync failures are silent; local practice days are never lost and the next
  change or login retries.
- Logging out keeps local practice days, so the learner continues as a guest with
  the same streak.
- Deleting the account deletes practice days along with all other user data.

## API

Session-cookie authenticated (see `specs/auth.md`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity` | List the current user's practice days |
| PUT | `/api/activity` | Add practice days; returns the merged set |

- Unauthenticated requests return 401.
- Malformed bodies return 400 with a readable message.
- `PUT` is additive and idempotent: sending a day that is already recorded
  changes nothing and still succeeds.
- Only a bounded recent window of practice days is retained per learner — enough
  to compute streaks, not a permanent audit log.
