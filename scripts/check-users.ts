import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('🔍 Checking current users in database...\n');

  try {
    // Check user_profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('❌ Error fetching user profiles:', profilesError);
      return;
    }

    console.log(`📊 Found ${profiles.length} user profiles:`);
    
    if (profiles.length === 0) {
      console.log('   No users found yet. Try signing up!');
    } else {
      profiles.forEach((profile, index) => {
        console.log(`\n👤 User ${index + 1}:`);
        console.log(`   ID: ${profile.id}`);
        console.log(`   Email: ${profile.email}`);
        console.log(`   Name: ${profile.name || 'Not set'}`);
        console.log(`   Created: ${profile.created_at}`);
        console.log(`   Updated: ${profile.updated_at}`);
      });
    }

    // Also check auth.users (if we have access)
    console.log('\n🔐 Checking auth.users table...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('   ⚠️  Cannot access auth.users (requires admin privileges)');
    } else {
      console.log(`   Found ${authUsers.users.length} auth users`);
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
  }
}

checkUsers(); 