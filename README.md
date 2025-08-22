# Expert Determination Website

This directory contains the deployment files for https://expert-determination.justice-minds.com/

## Files Structure

```
expert-determination-site/
├── index.html          # Main Expert Determination Report
├── .htaccess          # Apache configuration (security, HTTPS redirect)
├── deploy.sh          # Deployment script
├── README.md          # This file
└── audio_slices/      # Directory for audio evidence files (to be uploaded)
```

## Quick Fix for Current SSL Issue

The website is currently failing due to SSL/TLS connectivity issues. Here's how to fix it:

### Option 1: Using a CDN/Static Hosting (Recommended)

1. **Netlify** (Free HTTPS):
   ```bash
   # Drag and drop the files to netlify.com
   # Or use Netlify CLI:
   npm install -g netlify-cli
   netlify deploy --prod --dir=.
   ```

2. **Vercel** (Free HTTPS):
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **GitHub Pages** (Free HTTPS):
   - Push files to a GitHub repository
   - Enable GitHub Pages in repository settings
   - Use custom domain: expert-determination.justice-minds.com

### Option 2: Traditional Web Hosting

1. Upload all files to your web hosting provider's root directory
2. Ensure SSL certificate is configured for expert-determination.justice-minds.com
3. Test the deployment

## Audio Files

The website references audio files in the `audio_slices/` directory. These files need to be uploaded separately:

- statutory_advocacy_rights_denied.mp3
- mckenzie_friend_rights_dismissed.mp3
- reading_support_inadequate.mp3
- special_guardianship_mishandling.mp3
- kinship_assessment_failure.mp3

## Deployment

Run the deployment script:

```bash
./deploy.sh staging    # For testing
./deploy.sh production # For live deployment
```

## Troubleshooting

### SSL Certificate Issues
- Ensure your hosting provider has installed a valid SSL certificate
- Check that the certificate covers the exact domain: expert-determination.justice-minds.com
- Verify DNS is pointing to the correct server

### Audio File Issues
- Upload audio files to the `audio_slices/` directory
- Ensure file permissions allow web access
- Test audio playback functionality

## Contact

For technical support: consult@justice-minds.com