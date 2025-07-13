#!/bin/bash

# Script to change where Builder.io pushes your code
# Choose your destination:

echo "🔧 Git Remote Configuration Options:"
echo ""
echo "OPTION 1: Push to NEW repository (vo2max-training-app)"
echo "OPTION 2: Push to OLD repository (VO2) but on main branch"
echo "OPTION 3: Keep current setup (VO2 repo, ai_main branch)"
echo ""

read -p "Which option do you want? (1/2/3): " choice

case $choice in
  1)
    echo "🔄 Changing to NEW repository..."
    git remote remove origin
    git remote add origin https://github.com/samandalib/vo2max-training-app.git
    git branch -M main
    echo "✅ Now pushes to: vo2max-training-app repository, main branch"
    ;;
  2)
    echo "🔄 Keeping OLD repository, changing to main branch..."
    git branch -M main
    echo "✅ Now pushes to: VO2 repository, main branch"
    ;;
  3)
    echo "✅ Keeping current setup: VO2 repository, ai_main branch"
    ;;
  *)
    echo "❌ Invalid choice. No changes made."
    ;;
esac

echo ""
echo "Current git configuration:"
git remote -v
git branch
