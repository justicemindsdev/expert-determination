#!/usr/bin/env node
/**
 * Upload audio files to Supabase storage and update HTML references
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://tvecnfdqakrevzaeifpk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNuZmRxYWtyZXZ6YWVpZnBrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM4MjA2NCwiZXhwIjoyMDYzOTU4MDY0fQ.KqzZr0iiPNYHFzEzT8utRAu3EorO3LFDbh3dd-U_42c';

// Audio files that need to be uploaded
const audioFiles = [
  'statutory_advocacy_rights_denied.mp3',
  'mckenzie_friend_rights_dismissed.mp3',
  'reading_support_inadequate.mp3', 
  'special_guardianship_mishandling.mp3',
  'kinship_assessment_failure.mp3'
];

async function createStorageBucket() {
  console.log('🪣 Creating storage bucket for court audio files...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'court-audio',
        name: 'court-audio',
        public: true,
        file_size_limit: 52428800, // 50MB
        allowed_mime_types: ['audio/mpeg', 'audio/wav', 'audio/mp3']
      })
    });

    if (response.ok) {
      console.log('✅ Storage bucket created successfully');
      return true;
    } else if (response.status === 409) {
      console.log('ℹ️  Storage bucket already exists');
      return true;
    } else {
      const error = await response.text();
      // Check if it's a duplicate error message
      if (error.includes('already exists') || error.includes('Duplicate')) {
        console.log('ℹ️  Storage bucket already exists');
        return true;
      }
      console.error('❌ Failed to create bucket:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error creating bucket:', error);
    return false;
  }
}

async function createPlaceholderAudio() {
  console.log('🎵 Creating placeholder audio files...');
  
  // Create the audio_slices directory if it doesn't exist
  const audioDir = path.join(__dirname, 'audio_slices');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  // Create placeholder text files explaining the missing audio
  for (const audioFile of audioFiles) {
    const placeholderPath = path.join(audioDir, audioFile + '.txt');
    const placeholderContent = `This is a placeholder for ${audioFile}

The actual audio file needs to be uploaded to complete the Expert Determination Report.

This file contains evidence related to:
${audioFile.replace(/_/g, ' ').replace('.mp3', '').toUpperCase()}

To upload the real audio file:
1. Replace this placeholder with the actual MP3 file
2. Run the upload script again to sync with Supabase storage

Generated: ${new Date().toISOString()}`;

    fs.writeFileSync(placeholderPath, placeholderContent);
    console.log(`📝 Created placeholder: ${audioFile}.txt`);
  }
}

async function updateHtmlWithSupabaseUrls() {
  console.log('📝 Updating HTML to use Supabase storage URLs...');
  
  const htmlPath = path.join(__dirname, 'index.html');
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Update audio source URLs to point to Supabase storage
  const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/court-audio`;
  
  // Replace local audio paths with Supabase URLs
  htmlContent = htmlContent.replace(
    /src="audio_slices\/(.*?)"/g,
    `src="${storageUrl}/$1"`
  );
  
  // Also update the fallback URLs
  htmlContent = htmlContent.replace(
    /src="https:\/\/your-project\.supabase\.co\/storage\/v1\/object\/public\/court-audio\/(.*?)"/g,
    `src="${storageUrl}/$1"`
  );
  
  fs.writeFileSync(htmlPath, htmlContent);
  console.log('✅ HTML updated with Supabase storage URLs');
}

async function main() {
  console.log('🚀 Setting up audio infrastructure for Expert Determination Report...');
  
  // Create storage bucket
  const bucketCreated = await createStorageBucket();
  if (!bucketCreated) {
    console.error('❌ Failed to create storage bucket, exiting');
    process.exit(1);
  }
  
  // Create placeholder files
  await createPlaceholderAudio();
  
  // Update HTML with Supabase URLs
  await updateHtmlWithSupabaseUrls();
  
  console.log('\n✅ Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Replace placeholder files in audio_slices/ with actual MP3 files');
  console.log('2. Upload MP3 files to Supabase storage');
  console.log('3. Test audio playback on the website');
  console.log('\n🌐 Storage URL:', `${SUPABASE_URL}/storage/v1/object/public/court-audio/`);
  console.log('📁 Local audio directory:', path.join(__dirname, 'audio_slices'));
}

main().catch(console.error);