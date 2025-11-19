const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupPolicies() {
  try {
    console.log('Setting up storage policies...\n');

    // First, let's check existing policies
    const { data: existingPolicies, error: listError } = await supabase
      .from('pg_policies')
      .select('*')
      .like('tablename', 'objects');

    // Policy for public uploads
    const uploadPolicy = `
      CREATE POLICY IF NOT EXISTS "Allow public uploads"
      ON storage.objects FOR INSERT
      TO public
      WITH CHECK (bucket_id = 'uploads');
    `;

    // Policy for public reads
    const readPolicy = `
      CREATE POLICY IF NOT EXISTS "Allow public reads"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'uploads');
    `;

    // Policy for authenticated deletes
    const deletePolicy = `
      CREATE POLICY IF NOT EXISTS "Allow authenticated deletes"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'uploads');
    `;

    // Execute the policies
    const policies = [uploadPolicy, readPolicy, deletePolicy];

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });

      if (error) {
        console.error('Error creating policy:', error);
      }
    }

    console.log('\n✓ Policies setup complete!');
    console.log('\nYou can now:');
    console.log('1. Upload files to the "uploads" bucket');
    console.log('2. Read files from the "uploads" bucket');
    console.log('3. Delete files (when authenticated)');

  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n⚠️  Could not set policies via API.');
    console.log('\nPlease set the policies manually in Supabase dashboard:');
    console.log('1. Go to: https://supabase.com/dashboard/project/xcxqhbonirkdzqpwknpc/storage/policies');
    console.log('2. Click on the "uploads" bucket');
    console.log('3. Add these policies:');
    console.log('\n   Policy 1 - Allow public uploads:');
    console.log('   - Operation: INSERT');
    console.log('   - Target roles: public');
    console.log('   - WITH CHECK: bucket_id = \'uploads\'');
    console.log('\n   Policy 2 - Allow public reads:');
    console.log('   - Operation: SELECT');
    console.log('   - Target roles: public');
    console.log('   - USING: bucket_id = \'uploads\'');
  }
}

setupPolicies();
