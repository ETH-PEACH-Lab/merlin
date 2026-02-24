# Merlin Git Workflow

## Core Philosophy

All students **collaboratively maintain the `main` branch**. This is the only long-lived branch containing everyone's work.

- ✅ **Main branch** = Shared development branch with latest code
- ✅ **Feature branches** = Short-lived branches, merge back to main when done
- ✅ **Frequent integration** = Merge as soon as a feature is complete, avoid large divergence  
- ✅ **Pull latest** = Always `git pull` before starting work to get others' code
- ✅ **Code review** = Yang reviews and approves all PRs to main


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


## GitHub Settings

### 1. Protect Main Branch

```

☑ Require a pull request before merging
  ☑ Require approvals: 1 (Yang's approval required)
  ☐ Dismiss stale pull request approvals when new commits are pushed

☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  ☑ Status checks: build (from GitHub Actions)

☐ Require conversation resolution before merging
☑ Do not allow bypassing the above settings
```


### 2. GitHub Actions 

File: `.github/workflows/pr-check.yml`

Features:
- Every PR automatically runs `pnpm build`
- Build fails = PR cannot merge
- After merging to main, auto-deploys to GitHub Pages



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

