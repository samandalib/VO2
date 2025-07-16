import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUserProfiles() {
  console.log('🔧 Fixing user profiles for existing users...\n');

  try {
    // Get all users from auth (this requires admin privileges, so we'll use a different approach)
    // Instead, let's check what user profiles exist and create missing ones
    
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      console.error('❌ Error fetching user profiles:', profilesError);
      return;
    }

    console.log(`📊 Found ${profiles.length} existing user profiles`);
    
    // For now, we'll create a test user profile manually
    // In a real scenario, you'd want to use admin privileges to get all auth users
    
    console.log('\n💡 To fix this issue:');
    console.log('1. The sign-up function now creates user profiles immediately');
    console.log('2. For existing users, you can manually create profiles in Supabase dashboard');
    console.log('3. Or use the admin API to sync all users');
    
    console.log('\n🔧 Manual fix for existing users:');
    console.log('1. Go to Supabase Dashboard > Authentication > Users');
    console.log('2. Copy the user ID for each user without a profile');
    console.log('3. Go to Table Editor > user_profiles');
    console.log('4. Insert a new row with:');
    console.log('   - id: [user-id-from-auth]');
    console.log('   - email: [user-email]');
    console.log('   - name: [user-name-or-null]');
    console.log('   - picture: null');
    console.log('   - created_at: [current-timestamp]');
    console.log('   - updated_at: [current-timestamp]');

  } catch (error) {
    console.error('❌ Error fixing user profiles:', error);
  }
}

fixUserProfiles(); 