# Merlin Git Workflow
**Last Updated:** February 24, 2026  
**Workflow Model:** Trunk-Based Development  
**Project Lead & Reviewer:** Yang Wu

---

## Core Philosophy

All students **collaboratively maintain the `main` branch**. This is the only long-lived branch containing everyone's work.

- ✅ **Main branch** = Shared development branch with latest code
- ✅ **Feature branches** = Short-lived branches, merge back to main when done
- ✅ **Frequent integration** = Merge as soon as a feature is complete, avoid large divergence  
- ✅ **Pull latest** = Always `git pull` before starting work to get others' code
- ✅ **Code review** = Yang reviews and approves all PRs to main

---

## Branch Strategy

```
main (shared trunk, everyone's code lives here)
 ├─ feature/student-a-generation      # Student A: Auto generation
 ├─ feature/student-b-editor-ui       # Student B: Editor UI improvements
 ├─ feature/student-c-study-env       # Student C: Study environment
 └─ hotfix/critical-bug               # Emergency fixes
```

### Main Branch
- **Purpose**: Shared development branch where all work ultimately lands
- **Requirements**:
  - ✅ Must build successfully (`pnpm build` passes)
  - ✅ No direct commits, must use Pull Requests
  - ✅ Work-in-progress allowed, but cannot break the build
  - ✅ Auto-deploys to GitHub Pages

### Feature Branches
- **Naming**: `feature/<project-feature-description>`
- **Examples**: 
  - `feature/auto-generation-llm`
  - `feature/editor-redesign-toolbar`
  - `feature/study-visualization`
- **Lifecycle**: Keep short (1-5 days), merge when complete
- **Requirements**: Created from main, regularly sync with main updates

---

## Daily Workflow

### 1️⃣ Start a New Feature

```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/my-new-feature

# 3. Develop and commit
# ... write code ...
git add .
git commit -m "feat: add my new feature"

# 4. Push to remote
git push origin feature/my-new-feature
```

### 2️⃣ Sync with Others' Updates

**Do this every day before starting work!**

```bash
# Sync main updates into your feature branch
git checkout feature/my-feature
git fetch origin
git merge origin/main

# If there are conflicts, resolve them:
git add .
git commit -m "merge: sync with main"
git push
```

### 3️⃣ Merge to Main (Feature Complete)

```bash
# 1. Ensure you've synced with latest main
git merge origin/main

# 2. Test locally
pnpm install
pnpm build

# 3. Push
git push origin feature/my-feature

# 4. Create Pull Request on GitHub
# Target: main ← feature/my-feature
```

**On GitHub:**
1. Open PR: `feature/my-feature` → `main`
2. Fill in PR description (what you did)
3. Request review from **@yangwu** (required)
4. Wait for CI to pass
5. **Wait for Yang's approval**
6. Yang will merge the PR
7. Delete feature branch after merging

### 4️⃣ Pull Latest Main

```bash
# After merge, return to main and update
git checkout main
git pull origin main

# Now your local main has your and others' latest code
# Start next feature
git checkout -b feature/next-feature
```

---

## Pull Request Requirements

### PR to Main Checklist

- [ ] **Build succeeds**: `pnpm build` with no errors
- [ ] **Synced with latest**: Merged latest main, no conflicts
- [ ] **Functionality works**: Manually tested, feature works properly
- [ ] **No breakage**: Does not break others' features
- [ ] **Clear description**: PR explains what changed
- [ ] **CI passes**: GitHub Actions build passes (automatic check)
- [ ] **Review requested**: @yangwu assigned as reviewer

### PR Description Template

Create file `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Feature Description
Briefly describe what this PR does

## Changes Made
- Added XXX feature
- Modified YYY component
- Fixed ZZZ bug

## Testing
- [x] Build succeeds locally
- [x] Manually tested
- [x] Does not affect other features

## Screenshots/Demo
(If UI changes, attach screenshots)

## Related Project
Which thesis project does this belong to?
```

### Code Review (Required)

**All PRs to main require Yang's review and approval.**

- **Yang (@yangwu)** reviews all PRs before merging
- Yang checks: code quality, potential breakage, alignment with project goals
- Students should respond to review comments promptly
- After approval, Yang will merge the PR

**Review Process:**
1. Create PR and request review from @yangwu
2. Yang will review within 1-2 business days
3. Address any requested changes
4. Yang approves and merges when ready

---

## Handling Conflicts

### Situation 1: Your Feature Branch is Behind

```bash
# Sync main into your branch
git checkout feature/my-feature
git merge origin/main

# If conflicts:
# 1. Open conflicted files, resolve manually
# 2. Remove <<<<<<< ======= >>>>>>> markers
# 3. Keep the correct code
git add .
git commit -m "fix: resolve merge conflicts with main"
git push
```

### Situation 2: Conflicts When Merging PR

```bash
# GitHub will show conflicts, click "Resolve conflicts" button
# Or locally:
git checkout feature/my-feature
git merge origin/main
# ... resolve conflicts ...
git push
# PR will update automatically
```

### Conflict Example

```javascript
<<<<<<< HEAD (your code)
function parse(text) {
  return newParser(text);
}
=======  (code in main)
function parse(text, options) {
  return advancedParser(text, options);
}
>>>>>>> origin/main

// Solution: merge both implementations
function parse(text, options = {}) {
  return advancedParser(text, options);
}
```

---

## Code Sharing Scenarios

### Scenario 1: You Need Someone's New Feature

**Best approach: Have them merge to main first**

```
You: @teammate, I need your XX feature. Can you merge to main soon?
Teammate: Sure, I'll merge today

# After teammate merges
git checkout feature/my-feature
git merge origin/main  # Get teammate's code
```

### Scenario 2: Urgently Need an Unmerged Commit

**Use cherry-pick**

```bash
# Find the commit you need
git log origin/feature/other-feature --oneline
# Output: a1b2c3d feat: add utility function

# Copy that commit to your branch
git checkout feature/my-feature
git cherry-pick a1b2c3d
git push

# ⚠️ Note the source in commit message
git commit --amend -m "feat: add utility function (cherry-picked from @student's branch)"
```

### Scenario 3: Two People Need to Co-develop a Feature

**Option A: Work together on one feature branch**

```bash
# Student A creates branch
git checkout -b feature/shared-component main
git push origin feature/shared-component

# Student B joins
git checkout feature/shared-component
git pull
# ... develop ...
git push

# When done, PR together to main
```

**Option B: One person does foundation, another continues**

```bash
# Student A does foundation first
# PR: feature/base-component → main (merge)

# Student B continues based on latest main
git checkout main && git pull
git checkout -b feature/extend-component
# Use Student A's code to continue development
```

---

## Avoiding Common Problems

### ❌ Don't Wait Too Long to Merge

```bash
# Bad: Feature branch exists for 2 weeks, far from main
feature/my-feature (created 2 weeks ago, not merged)
# Risk: Massive conflicts, difficult to merge

# Good: Merge in stages
Week 1: feature/step1 → main (merge)
Week 2: feature/step2 → main (merge), based on latest main
```

**Recommendations:**
- Feature branches live max 3-5 days
- Break large features into smaller PRs
- Even if feature is incomplete, can merge parts (but don't break build)

### ❌ Don't Commit Directly to Main

```bash
# Wrong approach
git checkout main
# ... make changes ...
git commit -m "quick fix"
git push origin main  # ❌ Will be rejected (branch protection)

# Correct approach
git checkout -b feature/quick-fix
# ... make changes ...
git commit -m "fix: quick fix"
git push origin feature/quick-fix
# Create PR → main
```

### ❌ Don't Forget to Sync

```bash
# Every day before starting work
git checkout feature/my-feature
git fetch origin
git merge origin/main  # Get others' updates

# If you forget to sync, you'll have many conflicts during PR
```

---

## Hotfix (Emergency Fixes)

If production environment (GitHub Pages) has a critical bug:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull
git checkout -b hotfix/critical-bug

# 2. Quick fix
# ... make changes ...
git commit -m "fix: resolve critical bug"
git push origin hotfix/critical-bug

# 3. Immediately PR to main (priority review and merge)
gh pr create --base main --label "hotfix"

# 4. Notify team
# "🚨 Critical fix PR #123, please review ASAP"
```

---

## Version Management

### Tagging Important Versions

When reaching milestones (e.g., midterm presentation, thesis submission):

```bash
# Tag on main
git checkout main
git pull
git tag -a v1.0.0 -m "Version 1.0: Midterm presentation"
git push origin v1.0.0

# Can always return to this version later
git checkout v1.0.0
```

### Suggested Tag Milestones
- `v0.1.0` - Core features complete
- `v0.5.0` - Midterm presentation
- `v1.0.0` - Thesis submission version
- `v2.0.0` - Final presentation

---

## GitHub Settings

### 1. Protect Main Branch

**Settings → Branches → Add rule for `main`:**

```
Branch name pattern: main

☑ Require a pull request before merging
  ☑ Require approvals: 1 (Yang's approval required)
  ☐ Dismiss stale pull request approvals when new commits are pushed

☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  ☑ Status checks: build (from GitHub Actions)

☐ Require conversation resolution before merging
☑ Do not allow bypassing the above settings
```

**Recommended: Add Yang (@yangwu) as required reviewer in CODEOWNERS**

Create file `.github/CODEOWNERS`:
```
# All code requires Yang's review
* @yangwu
```

### 2. GitHub Actions (Already Configured)

File: `.github/workflows/pr-check.yml`

Features:
- Every PR automatically runs `pnpm build`
- Build fails = PR cannot merge
- After merging to main, auto-deploys to GitHub Pages

---

## Command Cheat Sheet

| Task | Command |
|------|---------|
| Update main | `git checkout main && git pull` |
| Create feature branch | `git checkout -b feature/name` |
| Sync main updates | `git merge origin/main` |
| Commit changes | `git add . && git commit -m "message"` |
| Push branch | `git push origin feature/name` |
| Create PR (CLI) | `gh pr create --base main` |
| Delete local branch | `git branch -d feature/name` |
| View all branches | `git branch -a` |
| Check status | `git status` |
| View commit history | `git log --oneline --graph` |
| Stash changes | `git stash` |
| Restore stashed | `git stash pop` |
| Cherry-pick commit | `git cherry-pick <hash>` |
| View remote branches | `git branch -r` |
| Undo local changes | `git restore <file>` |
| Undo last commit | `git reset --soft HEAD~1` |

---

## Workflow Example

### Complete Week Workflow

```bash
# ============ Monday ============
# Morning: Start work
git checkout main
git pull                                    # Get weekend updates from others
git checkout -b feature/week1-work          # Create this week's branch

# During day: Develop
# ... write code, test ...
git add src/components/NewFeature.js
git commit -m "feat: add new feature component"
git push origin feature/week1-work

# ============ Tuesday ============
# Morning: Sync main (others may have merged new things)
git checkout feature/week1-work
git fetch origin
git merge origin/main                       # Sync
# ... if conflicts, resolve them ...

# Continue development
git add .
git commit -m "feat: complete feature logic"
git push

# ============ Wednesday ============
# Feature complete, ready to merge
git merge origin/main                       # Final sync
pnpm build                                  # Ensure build succeeds
git push origin feature/week1-work

# On GitHub: Create PR: feature/week1-work → main
# Wait for CI to pass, click Merge

# ============ Thursday ============
# Start new feature
git checkout main
git pull                                    # Includes your work from yesterday
git checkout -b feature/week2-new

# Repeat process...
```

---

## FAQ

### Q: Can I merge to main if my feature isn't complete?
**A:** Yes, but ensure:
- ✅ Does not break existing features
- ✅ Build passes
- ✅ Optional: Use feature flags to hide incomplete functionality

```javascript
// Use feature flag in code
const ENABLE_NEW_FEATURE = false; // Change to true when complete

if (ENABLE_NEW_FEATURE) {
  // New feature code
}
```

### Q: I need a teammate's code, but their branch isn't merged yet?
**A:** Three options (in priority order):
1. **Best**: Wait for them to merge to main (usually 1-2 days)
2. **Urgent**: Cherry-pick their specific commit
3. **Discuss**: Work together on one branch

### Q: I get "rejected, main is protected" when pushing?
**A:** Normal! Main branch doesn't allow direct pushes, must use PRs. This ensures all code goes through CI checks.

### Q: Two people modified the same file, what now?
**A:** Git will try to auto-merge. If it fails:
```bash
# Open conflicted file, you'll see:
<<<<<<< HEAD
Your code
=======
Someone else's code
>>>>>>> origin/main

# Decide what to keep or keep both, remove markers
# Then: git add . && git commit
```

### Q: I accidentally committed wrong code?
**A:** 
```bash
# If haven't pushed yet
git reset --soft HEAD~1        # Undo last commit, keep changes

# If already pushed but no one is using it
git push -f origin feature/my-branch  # Use cautiously!

# If already merged to main
git revert <commit-hash>       # Create new commit to undo
```

### Q: Should main always be deployable?
**A:** Ideally yes, but brief WIP is allowed. Key requirements:
- ✅ **Must**: Build succeeds (CI checks this)
- ✅ **Recommended**: Features are stable
- ⚠️ **Allowed**: Partial features incomplete (but don't break other parts)

### Q: How often should I merge to main?
**A:** Recommendations:
- Small features: 1-2 days
- Large features: Break into chunks, each 2-3 days
- **Max 1 week**

Benefits of frequent merging:
- Reduce conflicts
- Others can use your code earlier
- Continuous integration, find problems early

### Q: Do I need code review?
**A:** Yes, all PRs to main require Yang's review and approval.

**Review expectations:**
- Yang reviews within 1-2 business days
- Respond to review comments promptly
- Make requested changes in new commits
- Request re-review after addressing feedback

**Tips for faster reviews:**
- Keep PRs small (<500 lines)
- Write clear PR descriptions
- Test thoroughly before submitting
- Highlight any areas needing special attention

### Q: Can I delete merged branches?
**A:** Yes, and recommended!
```bash
# GitHub will prompt to delete after merging PR
# Or manually:
git push origin --delete feature/my-feature  # Delete remote
git branch -d feature/my-feature             # Delete local
```

---

## Migrating Existing Branches

### Current State
```bash
$ git branch -a
* automatic_generation
  main
  remotes/origin/Editor-redesign
  remotes/origin/GUI-refactoring
  remotes/origin/study-environment
```

### Migration Plan

#### Step 1: Prepare Branches (Each Student)

```bash
# 1. Checkout your project branch
git checkout automatic_generation  # Replace with your branch name

# 2. Sync with latest main
git fetch origin
git merge origin/main
# ... resolve conflicts ...

# 3. Test build
pnpm install
pnpm build

# 4. Push
git push origin automatic_generation
```

#### Step 2: Merge to Main One by One

```bash
# Each student creates PR
gh pr create --base main \
  --title "feat: merge [project name] work to main" \
  --body "Merging [project name] completed features to main branch"

# Or create PR on GitHub web interface:
# automatic_generation → main
# Editor-redesign → main
# GUI-refactoring → main
# study-environment → main
```

#### Step 3: Cleanup After Merging

```bash
# After PR merges, update local main
git checkout main
git pull origin main

# Now main contains everyone's code
# Delete old project branch (optional)
git branch -d automatic_generation
git push origin --delete automatic_generation

# Going forward, create new feature branches from main
git checkout -b feature/my-next-feature
```

#### Step 4: If Project Has Lots of Unfinished Work

If your branch has many incomplete features and you don't want to merge all at once:

```bash
# Option A: Merge in stages
git checkout automatic_generation
git checkout -b feature/generation-part1  # Only completed parts
# ... organize code, keep only stable features ...
gh pr create --base main  # Merge stable parts

# Continue developing incomplete features on original branch
git checkout automatic_generation
# ... continue development ...

# Option B: Rename to feature branch
git branch -m automatic_generation feature/auto-generation-full
git push origin feature/auto-generation-full
git push origin --delete automatic_generation
```

### Migration Timeline

| Time | Task | Owner |
|------|------|-------|
| **Week 1** | Read new workflow, team discussion | Everyone |
| **Week 2** | Organize branches, prepare to merge | Each student |
| **Week 3** | Create PRs, merge to main one by one | Each student + Review |
| **Week 4 onwards** | Develop based on main, use feature branches | Everyone |

---

## Best Practices

### ✅ Do These

1. **Sync main daily** - First thing in morning: `git pull`
2. **Small commits** - Each commit does one thing, easy to rollback
3. **Clear commit messages** - Use `feat:`, `fix:`, `refactor:`, etc.
4. **Merge promptly** - Feature branches no longer than 3-5 days
5. **Test builds** - Run `pnpm build` locally before merging
6. **Communicate** - Notify team before changing shared code
7. **Resolve conflicts** - Sync early, avoid large-scale conflicts
8. **Delete merged branches** - Keep repo clean

### ❌ Avoid These

1. **Long-lived branches** - Don't keep feature branches >1 week
2. **Direct pushes to main** - Always use PRs
3. **Ignoring conflicts** - Don't wait until end to merge
4. **Breaking builds** - Ensure main always builds
5. **Large PRs** - Split into smaller, reviewable PRs (<500 lines)
6. **Forgetting docs** - Update README for important features
7. **Not testing** - Must test locally before merging
8. **Force pushing** - Avoid `git push -f` unless certain no one depends on it

---

## Team Collaboration Tips

### Commit Message Format

Use semantic commit messages:

```bash
feat: add new feature
fix: fix bug
refactor: refactor code (no behavior change)
docs: update documentation
style: formatting changes (no functional impact)
test: add tests
chore: build or tooling changes
perf: performance optimization

# Examples
git commit -m "feat: add automatic code generation from prompts"
git commit -m "fix: resolve editor crash on window resize"
git commit -m "refactor: simplify compiler parsing logic"
git commit -m "docs: update README with new workflow"
```

### Communication Templates

**Need someone's code:**
```
@teammate Hey! I'm working on XX feature and need your YY code.
When can you merge your feature/xxx branch to main?
Or can I cherry-pick commit abc123?
```

**About to modify shared code:**
```
💬 Heads up: I plan to modify src/compiler/parser.js tomorrow
This might affect functionality that depends on it. If anyone is using it, let me know
We can coordinate timing or compatibility approach
```

**Request review:**
```
@teammate Can you review PR #123?
I changed XX component logic, want to confirm it doesn't affect your feature
About 100 lines of code, should take 5 minutes
```

**Merge notification:**
```
✅ My PR #123 has been merged to main
Added XXX feature, you can git pull to use it
Let me know if any issues
```

---

## Recommended Tools

### 1. GitHub CLI (gh)

Quick PR creation and management:

```bash
# Install (macOS)
brew install gh
gh auth login

# Quick create PR
gh pr create --base main --fill

# View PR list
gh pr list

# Checkout a PR locally to test
gh pr checkout 123

# Merge PR
gh pr merge 123 --squash

# View PR status
gh pr view 123
```

### 2. Git Aliases

Add to `~/.gitconfig`:

```ini
[alias]
  # Common shortcuts
  co = checkout
  br = branch
  ci = commit
  st = status
  
  # Sync main
  sync = !git fetch origin && git merge origin/main
  
  # Pretty log
  lg = log --oneline --graph --decorate --all -20
  
  # View latest commit
  last = log -1 HEAD
  
  # Undo last commit (keep changes)
  undo = reset --soft HEAD~1
  
  # Clean merged local branches
  cleanup = !git branch --merged main | grep -v 'main' | xargs git branch -d
```

Usage:
```bash
git co main          # checkout main
git sync             # sync main
git lg               # view graphical log
git cleanup          # clean merged branches
```

### 3. VS Code Git Extensions

Recommended installations:
- **GitLens** - View code history and authors
- **Git Graph** - Visualize branch graph
- **Git History** - File history

---

## Summary

| Aspect | Description |
|--------|-------------|
| **Main branch** | `main` (everyone shares, only long-lived branch) |
| **Development branches** | `feature/<name>` (short-term, 1-5 days) |
| **Merge method** | Pull Request + CI auto-check |
| **Sync frequency** | At least once daily |
| **Branch lifespan** | 1-5 days (max 1 week) |
| **Code review** | Required - Yang reviews and approves all PRs |
| **Review time** | 1-2 business days |
| **Conflict handling** | Sync promptly, merge in small steps, catch issues early |
| **Core principles** | Frequent integration, collective maintenance, short branches, fast feedback |

---

## Workflow Diagram

```
Start Work
   ↓
git checkout main && git pull  (Get latest code)
   ↓
git checkout -b feature/xxx    (Create feature branch)
   ↓
Develop, test, commit
   ↓
git merge origin/main          (Sync daily)
   ↓
Feature complete?
   ├─ No → Continue development
   └─ Yes ↓
     git push
     Create PR → main
     Wait for CI to pass
     Merge PR
     Delete feature branch
     ↓
   git checkout main && git pull (Back to main)
   ↓
Start next feature (loop)
```

---

## Next Steps

1. **This week**: Team meeting to discuss this workflow
2. **Next week**: Start migrating existing branches
3. **Week 3**: Fully adopt new workflow

**Core principles: Simple, Frequent, Shared**

Questions? Discuss in team Slack/chat anytime! 🚀
