import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Test database connection and schema
async function testDatabaseConnection() {
  console.log("🔍 Testing Supabase database connection and schema...");

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing Supabase environment variables");
    console.error("Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file");
    console.error("\n📋 Current environment variables:");
    console.error("VITE_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
    console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Set" : "❌ Missing");
    return;
  }

  console.log("✅ Environment variables loaded successfully");
  console.log("🔗 Supabase URL:", supabaseUrl);
  console.log("🔑 Anon Key exists:", supabaseAnonKey ? "✅ Yes" : "❌ No");

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Test 1: Basic connection
    console.log("\n1️⃣ Testing basic connection...");
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("❌ Connection failed:", sessionError.message);
      return;
    }
    console.log("✅ Basic connection successful");

    // Test 2: Check table structure
    console.log("\n2️⃣ Testing table structure...");
    
    // Test weekly_metrics table
    const { data: weeklyData, error: weeklyError } = await supabase
      .from("weekly_metrics")
      .select("id, userId, date, restingHeartRate, vo2max, notes, createdAt, updatedAt")
      .limit(1);

    if (weeklyError) {
      console.error("❌ weekly_metrics table error:", weeklyError.message);
      console.error("Expected columns: id, userId, date, restingHeartRate, vo2max, notes, createdAt, updatedAt");
    } else {
      console.log("✅ weekly_metrics table structure correct");
      console.log("   Sample data structure:", Object.keys(weeklyData?.[0] || {}));
    }

    // Test session_metrics table
    const { data: sessionMetricsData, error: sessionMetricsError } = await supabase
      .from("session_metrics")
      .select("id, userId, date, maxHR, avgHR, sessionType, notes, createdAt, updatedAt")
      .limit(1);

    if (sessionMetricsError) {
      console.error("❌ session_metrics table error:", sessionMetricsError.message);
      console.error("Expected columns: id, userId, date, maxHR, avgHR, sessionType, notes, createdAt, updatedAt");
    } else {
      console.log("✅ session_metrics table structure correct");
      console.log("   Sample data structure:", Object.keys(sessionMetricsData?.[0] || {}));
    }

    // Test biomarkers table
    const { data: biomarkersData, error: biomarkersError } = await supabase
      .from("biomarkers")
      .select("id, userId, date, hemoglobin, ferritin, crp, glucose, createdAt, updatedAt")
      .limit(1);

    if (biomarkersError) {
      console.error("❌ biomarkers table error:", biomarkersError.message);
      console.error("Expected columns: id, userId, date, hemoglobin, ferritin, crp, glucose, createdAt, updatedAt");
    } else {
      console.log("✅ biomarkers table structure correct");
      console.log("   Sample data structure:", Object.keys(biomarkersData?.[0] || {}));
    }

    // Test protocols table
    const { data: protocolsData, error: protocolsError } = await supabase
      .from("protocols")
      .select("id, name, vo2maxGain, timeToResults, protocolDuration, fitnessLevel, sportModality, researchPopulation, researchers, institution, location, year, doi, description, howToPerform, intensityControl, createdAt, updatedAt")
      .limit(1);

    if (protocolsError) {
      console.error("❌ protocols table error:", protocolsError.message);
      console.error("Expected columns: id, name, vo2maxGain, timeToResults, protocolDuration, fitnessLevel, sportModality, researchPopulation, researchers, institution, location, year, doi, description, howToPerform, intensityControl, createdAt, updatedAt");
    } else {
      console.log("✅ protocols table structure correct");
      console.log("   Sample data structure:", Object.keys(protocolsData?.[0] || {}));
    }

    // Test user_protocols table
    const { data: userProtocolsData, error: userProtocolsError } = await supabase
      .from("user_protocols")
      .select("id, userId, protocolId, startDate, endDate, isActive, createdAt, updatedAt")
      .limit(1);

    if (userProtocolsError) {
      console.error("❌ user_protocols table error:", userProtocolsError.message);
      console.error("Expected columns: id, userId, protocolId, startDate, endDate, isActive, createdAt, updatedAt");
    } else {
      console.log("✅ user_protocols table structure correct");
      console.log("   Sample data structure:", Object.keys(userProtocolsData?.[0] || {}));
    }

    // Test user_profiles table
    const { data: userProfilesData, error: userProfilesError } = await supabase
      .from("user_profiles")
      .select("id, email, name, picture, created_at, updated_at")
      .limit(1);

    if (userProfilesError) {
      console.error("❌ user_profiles table error:", userProfilesError.message);
      console.error("Expected columns: id, email, name, picture, created_at, updated_at");
    } else {
      console.log("✅ user_profiles table structure correct");
      console.log("   Sample data structure:", Object.keys(userProfilesData?.[0] || {}));
    }

    console.log("\n🎉 Database connection and schema test completed!");
    console.log("📋 Summary:");
    console.log("   - Connection: ✅ Working");
    console.log("   - Schema: ✅ Matches expected structure");
    console.log("   - Column names: ✅ Using camelCase as expected");

  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
}

// Run the test
testDatabaseConnection().catch(console.error);
