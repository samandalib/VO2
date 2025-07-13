# Switch Builder.io to Push to New Repository

## 🎯 Goal: Make Builder.io push to `vo2max-training-app` instead of `VO2`

## Commands to Run:

If Builder.io has a terminal or you have access to run git commands:

```bash
cd code

# Remove old connection
git remote remove origin

# Add new repository connection
git remote add origin https://github.com/samandalib/vo2max-training-app.git

# Switch to main branch
git branch -M main

# Verify new setup
git remote -v
git branch

# Push to new repository
git push -u origin main
```

## Result:

- ✅ Future "Push Code" clicks will go to `vo2max-training-app`
- ✅ Code will go to `main` branch (standard)
- ✅ Clean, fresh repository with no password history

## If You Can't Run Commands:

Look for these Builder.io settings:

- **Project Settings** → **Git Integration**
- **Repository URL** setting
- **Branch** setting
- **GitHub Integration** options

Change the repository URL to: `https://github.com/samandalib/vo2max-training-app.git`
