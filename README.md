# Phalanx_Project
repository for the phalanx project group.
# --- Setup and Cloning ---

## Clone the repo (first time setup)
Explanation: Downloads the entire Phalanx repository to your local machine. Run this once.
git clone https://github.com/yourusername/phalanx.git

 Add remote (if needed, e.g., after local init)
 Explanation: Links your local repo to GitHub. Only needed if you didn't clone.
git remote add origin https://github.com/yourusername/phalanx.git

# --- Updating Your Local Repo ---

## Pull latest changes
###Explanation: Syncs your local branch with GitHub to avoid conflicts. Always run before starting work.
git pull origin main

# --- Creating Branches ---

## Switch to a base branch first (e.g., main or develop)
### Explanation: Ensures your new branch starts from the right point. Options:
   - From main: Pros - Quick, stable base; Cons - Features might not integrate smoothly if dependent.
   - From develop: Pros - Better for staging/combining features; Cons - Extra step, more potential conflicts.
git checkout main  # Or 'develop' for more structure

## Create and switch to a new branch
### Explanation: Creates a branch and switches to it for immediate work. Use for features, bugfixes, etc.
git checkout -b feature/jailbreak-library  # Example

## Alternative: Create without switching
### Explanation: Just creates the branch; switch later. Pros: Plan multiple at once; Cons: Easy to forget switching.
git branch feature/ui-dashboard

## Push new branch to GitHub
### Explanation: Shares the branch with the team for collaboration/PRs.
git push origin feature/jailbreak-library

# --- Working on Branches ---

## Add changes to staging
### Explanation: Prepares files for commit. '.' adds all; specify paths for selective.
git add .  # Or git add file/path

## Commit changes
### Explanation: Saves your work locally with a message. Keep messages descriptive for team reviews.
git commit -m "Add initial jailbreak attacks"

## Push updates to GitHub
### Explanation: Uploads your commits to the remote branch.
git push origin branch-name

# --- Switching and Viewing ---

## Switch branches
### Explanation: Moves to another branch, e.g., back to main after work.
git checkout main

## List all branches (local and remote)
### Explanation: Shows what branches exist. '-a' includes remotes (origin/*).
git branch -a

## View branch graph/history
### Explanation: Visualizes branches and commits. Helpful for seeing structure.
git log --graph --oneline --all

# --- Merging and PRs ---

## Merge another branch (locally)
### Explanation: Combines changes, Options:
   - Merge: Pros - Preserves history; Cons - Can create merge commits (messy graph).
git merge feature/branch-name  # Run on target branch, e.g., develop

## Alternative: Rebase
### Explanation: Rewrites history for a linear graph. Pros: Cleaner; Cons: Risky for shared branches, can lose context.
git rebase develop  # Run on your feature branch

# --- Deleting Branches ---

## Delete local branch (safe)
### Explanation: Removes after checking if merged. Use for cleanup post-PR.
git branch -d branch-name

##Delete local branch (force)
### Explanation: Deletes even if unmerged. Pros: Discards failed experiments; Cons: Permanent loss of work.
git branch -D branch-name

## Delete remote branch
### Explanation: Removes from GitHub. Do after local delete.
git push origin --delete branch-name

# --- Troubleshooting ---

## Undo last commit (keep changes)
### Explanation: Resets commit but keeps files. Useful for fixing messages.
git reset --soft HEAD~1

## Undo last commit (discard changes)
### Explanation: Fully reverts. Pros: Clean undo; Cons: Loses work—use cautiously.
git reset --hard HEAD~1

## Stash changes temporarily
### Explanation: Saves unfinished work to switch branches. Apply later.
git stash  # Save
git stash apply  # Restore

# --- Workflow Tips ---
## Always: Pull before pushing to avoid conflicts.
## For Phalanx: Use playground/experiments for JS/TS trials—branch it from main for independence
