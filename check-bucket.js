const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBucket() {
  try {
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }

    console.log('Available buckets:');
    buckets.forEach(bucket => {
      console.log(`- ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`);
    });

    const uploadsExists = buckets.some(b => b.name === 'uploads');

    if (uploadsExists) {
      console.log('\n✓ The "uploads" bucket exists!');
    } else {
      console.log('\n✗ The "uploads" bucket does NOT exist.');
      console.log('You need to create it in the Supabase dashboard or I can create it for you.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBucket();
