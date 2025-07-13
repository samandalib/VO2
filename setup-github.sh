#!/bin/bash

# Script to connect this project to your new GitHub repository
# Replace YOUR-USERNAME with your actual GitHub username

echo "🔧 Setting up GitHub connection..."

# Remove existing origin (if any)
git remote remove origin 2>/dev/null || echo "No existing origin to remove"

# Add your new GitHub repository as origin
git remote add origin https://github.com/samandalib/vo2max-training-app.git

# Verify the connection
echo "📡 Checking connection..."
git remote -v

# Check what files will be pushed (should NOT include .env)
echo "📋 Files that will be uploaded:"
git status

echo ""
echo "🚨 IMPORTANT: Look for .env in the file list above"
echo "If you see .env listed, STOP and tell me immediately!"
echo ""
echo "If .env is NOT listed, you're safe to proceed with:"
echo "  git add ."
echo "  git commit -m 'Initial commit'"
echo "  git push -u origin main"
