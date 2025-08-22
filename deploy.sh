#!/bin/bash

# Expert Determination Website Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-staging}
SITE_NAME="expert-determination.justice-minds.com"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

echo "🚀 Deploying Expert Determination Website..."
echo "Environment: $ENVIRONMENT"
echo "Site: $SITE_NAME"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Validate HTML
echo "📝 Validating HTML structure..."
if command -v tidy &> /dev/null; then
    tidy -q -e index.html || echo "⚠️  HTML validation warnings (continuing...)"
else
    echo "ℹ️  HTML Tidy not available, skipping validation"
fi

# Check for required files
echo "📋 Checking required files..."
required_files=("index.html" ".htaccess")
for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
    echo "✅ Found: $file"
done

# Create audio directory if it doesn't exist
echo "🎵 Setting up audio directory..."
mkdir -p audio_slices

# Check if we have audio files (they may be missing and need to be uploaded)
if [[ -d "audio_slices" ]] && [[ $(ls -A audio_slices/ 2>/dev/null | wc -l) -eq 0 ]]; then
    echo "⚠️  Audio directory is empty - audio files need to be uploaded separately"
    echo "   Required audio files:"
    echo "   - statutory_advocacy_rights_denied.mp3"
    echo "   - mckenzie_friend_rights_dismissed.mp3"
    echo "   - reading_support_inadequate.mp3"
    echo "   - special_guardianship_mishandling.mp3"
    echo "   - kinship_assessment_failure.mp3"
fi

# Deployment commands based on environment
case $ENVIRONMENT in
    "production")
        echo "🌐 Deploying to PRODUCTION..."
        # Add your production deployment commands here
        # Examples:
        # rsync -avz --delete ./ user@server:/var/www/expert-determination.justice-minds.com/
        # or upload to your hosting provider
        echo "📋 Production deployment commands:"
        echo "   1. Upload files to web server root directory"
        echo "   2. Ensure SSL certificate is properly configured"
        echo "   3. Test HTTPS connectivity"
        echo "   4. Verify audio file paths"
        ;;
    "staging")
        echo "🔧 Preparing STAGING deployment..."
        echo "📋 Staging checklist:"
        echo "   ✅ HTML file prepared"
        echo "   ✅ .htaccess configured"
        echo "   ⚠️  Audio files need manual upload"
        echo "   ⚠️  SSL certificate needs configuration"
        echo ""
        echo "🔧 Next steps for hosting provider:"
        echo "   1. Upload all files to web root"
        echo "   2. Configure SSL/TLS certificate"
        echo "   3. Point DNS to hosting server"
        echo "   4. Upload audio files to audio_slices/ directory"
        ;;
    *)
        echo "❌ Invalid environment. Use 'production' or 'staging'"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment preparation complete!"
echo "📁 Files ready in: $(pwd)"
echo "🌐 Target site: https://$SITE_NAME/"

# Create deployment summary
cat > deployment-summary.txt << EOF
Expert Determination Website Deployment Summary
=============================================
Date: $(date)
Environment: $ENVIRONMENT
Site: https://$SITE_NAME/

Files Prepared:
- index.html (Expert Determination Report)
- .htaccess (Security & redirects)
- deploy.sh (This deployment script)

Status: Ready for upload to hosting provider

Next Steps:
1. Configure SSL certificate on hosting provider
2. Upload files to web server root directory
3. Upload audio files to audio_slices/ subdirectory
4. Test website functionality
5. Verify all audio players work correctly

Contact: consult@justice-minds.com
EOF

echo "📄 Deployment summary saved to: deployment-summary.txt"