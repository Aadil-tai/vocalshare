const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using anon key like the app does

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  try {
    // Create a test file buffer
    const testContent = 'This is a test file';
    const buffer = Buffer.from(testContent);
    const filename = `test-${Date.now()}.txt`;

    console.log('Attempting to upload test file:', filename);

    const { data, error } = await supabase
      .storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType: 'text/plain',
        upsert: false
      });

    if (error) {
      console.error('✗ Upload failed:', error.message);
      console.error('Error details:', error);
      return;
    }

    console.log('✓ Upload successful!');
    console.log('File path:', data.path);

    // Try to get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('uploads')
      .getPublicUrl(filename);

    console.log('Public URL:', publicUrl);

    // Clean up - delete the test file
    const { error: deleteError } = await supabase
      .storage
      .from('uploads')
      .remove([filename]);

    if (deleteError) {
      console.log('Note: Could not delete test file:', deleteError.message);
    } else {
      console.log('✓ Test file cleaned up');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testUpload();
