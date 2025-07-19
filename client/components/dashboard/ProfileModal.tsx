import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, User as UserIcon, Upload as UploadIcon, Lock as LockIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";

const RACE_OPTIONS = [
  "White",
  "Black or African American",
  "Asian",
  "Hispanic or Latino",
  "Native American",
  "Pacific Islander",
  "Other",
];

const SEX_OPTIONS = ["Male", "Female"];

interface ProfileModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
}

const PLACEHOLDER_IMG = "https://ui-avatars.com/api/?name=User&background=eee&color=888&size=128";

// Password validation function
const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
};

function getDefaultName(user: any) {
  if (user?.name && user.name.trim() !== "") return user.name;
  if (user?.email) return user.email.split("@")[0];
  return "User";
}

export function ProfileModal({ user, open, onClose }: ProfileModalProps) {
  const isDemo = import.meta.env.DEV && user?.provider === "demo";
  const [profile, setProfile] = useState({
    name: "",
    picture: "",
    age: "",
    weight: "",
    height: "",
    race: "",
    sex: "",
  });
  const [initialProfile, setInitialProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastLoadedUserId = useRef<string | null>(null);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  
  // Password reset state
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

  // Conversion helpers
  const kgToLbs = (kg: string) => kg ? (parseFloat(kg) * 2.20462).toFixed(1) : '';
  const lbsToKg = (lbs: string) => lbs ? (parseFloat(lbs) / 2.20462).toFixed(1) : '';
  const cmToInches = (cm: string) => cm ? (parseFloat(cm) / 2.54).toFixed(1) : '';
  const inchesToCm = (inch: string) => inch ? (parseFloat(inch) * 2.54).toFixed(1) : '';

  // When toggling units, convert displayed values
  const handleUnitToggle = () => {
    setProfile(prev => {
      let newWeight = prev.weight;
      let newHeight = prev.height;
      if (unitSystem === 'metric') {
        // Convert to imperial for display
        newWeight = kgToLbs(prev.weight);
        newHeight = cmToInches(prev.height);
      } else {
        // Convert to metric for display
        newWeight = lbsToKg(prev.weight);
        newHeight = inchesToCm(prev.height);
      }
      return { ...prev, weight: newWeight, height: newHeight };
    });
    setUnitSystem(u => u === 'metric' ? 'imperial' : 'metric');
  };

  // On save, always convert to metric before saving
  const handleChangeWithUnit = (field: string, value: string) => {
    let metricValue = value;
    if (unitSystem === 'imperial') {
      if (field === 'weight') metricValue = lbsToKg(value);
      if (field === 'height') metricValue = inchesToCm(value);
    }
    handleChange(field, metricValue);
  };

  useEffect(() => {
    if (!open || !user?.id) return;
    if (lastLoadedUserId.current === user.id) return; // Already loaded for this user
    lastLoadedUserId.current = user.id;
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      if (isDemo) {
        const demoProfile = localStorage.getItem("mock_profile");
        let loaded = demoProfile ? JSON.parse(demoProfile) : {
          name: getDefaultName(user),
          picture: "",
          age: "28",
          weight: "72.5",
          height: "178",
          race: "Other",
          sex: "Male",
        };
        setProfile(loaded);
        setInitialProfile(loaded);
        setLoading(false);
        return;
      }
      try {
        const { data: userProfile } = await supabase
          .from("user_profiles")
          .select("name, picture")
          .eq("id", user.id)
          .single();
        const { data: userDetails } = await supabase
          .from("user_details")
          .select("age, weight, height, race, sex")
          .eq("id", user.id)
          .single();
        const loaded = {
          name: userProfile?.name && userProfile.name.trim() !== "" ? userProfile.name : getDefaultName(user),
          picture: userProfile?.picture || "",
          age: userDetails?.age?.toString() || "",
          weight: userDetails?.weight?.toString() || "",
          height: userDetails?.height?.toString() || "",
          race: userDetails?.race || "",
          sex: userDetails?.sex || "",
        };
        setProfile(loaded);
        setInitialProfile(loaded);
      } catch (e) {
        setError("Failed to load profile");
      }
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, open, isDemo]);

  // Reset lastLoadedUserId when modal closes
  useEffect(() => {
    if (!open) lastLoadedUserId.current = null;
  }, [open]);

  const autoSave = async (newProfile: typeof profile) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      if (isDemo) {
        localStorage.setItem("mock_profile", JSON.stringify(newProfile));
        // Do NOT setProfile(newProfile) here, only update initialProfile
        setInitialProfile(newProfile);
        setSuccess(true);
        setLoading(false);
        return;
      }
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          name: newProfile.name,
          picture: newProfile.picture,
        })
        .eq("id", user.id);
      const { error: detailsError } = await supabase
        .from("user_details")
        .upsert({
          id: user.id,
          age: newProfile.age ? Number(newProfile.age) : null,
          weight: newProfile.weight ? Number(newProfile.weight) : null,
          height: newProfile.height ? Number(newProfile.height) : null,
          race: newProfile.race,
          sex: newProfile.sex,
        });
      if (profileError || detailsError) {
        setError("Failed to save profile");
      } else {
        // Only update initialProfile, not profile
        setInitialProfile(newProfile);
        setSuccess(true);
      }
    } catch (e) {
      setError("Failed to save profile");
    }
    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => {
      const updated = { ...prev, [field]: value };
      // Debounce auto-save
      if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
      autoSaveTimeout.current = setTimeout(() => autoSave(updated), 500);
      return updated;
    });
    setSuccess(false);
    setError("");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      if (isDemo) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setProfile((prev) => ({ ...prev, picture: dataUrl }));
        };
        reader.readAsDataURL(file);
      } else {
        const fileExt = file.name.split('.').pop();
        const filePath = `profile-pictures/${user.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('profile-pictures').upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
        setProfile((prev) => ({ ...prev, picture: data.publicUrl }));
      }
    } catch (e) {
      setError("Failed to upload image");
    }
    setUploading(false);
  };

  const handlePasswordReset = async () => {
    // Validate passwords
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    setResettingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");
    
    // Add timeout to prevent indefinite loading
    const timeoutId = setTimeout(() => {
      setResettingPassword(false);
      setPasswordError("Request timed out. Please try again.");
    }, 10000); // 10 second timeout
    
    try {
      if (isDemo) {
        // For demo users, just simulate success
        setPasswordSuccess("Password updated successfully! (Demo mode)");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordReset(false);
        setResettingPassword(false);
        clearTimeout(timeoutId);
        return;
      }
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session. Please sign in again.");
      }
      
      console.log("🔐 User session found:", session.user.email);
      
      // Use Supabase's built-in auth.updateUser() for password changes
      console.log("🔄 Updating password via Supabase Auth...");
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      console.log("📡 Supabase auth response:", { data, error });
      
      if (error) {
        console.error("❌ Supabase auth error:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("✅ Password updated successfully for user:", data.user.email);
      }
      
      setPasswordSuccess("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordReset(false);
      clearTimeout(timeoutId); // Clear timeout on success
    } catch (error) {
      console.error("❌ Password reset error:", error);
      
      // Provide more specific error messages
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message;
        if (errorMessage.includes('password')) {
          setPasswordError(`Password error: ${errorMessage}`);
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          setPasswordError("Network error. Please check your connection and try again.");
        } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
          setPasswordError("Session expired. Please sign in again.");
        } else {
          setPasswordError(`Update failed: ${errorMessage}`);
        }
      } else {
        setPasswordError("Failed to update password. Please try again.");
      }
    }
    
    setResettingPassword(false);
    clearTimeout(timeoutId); // Clear timeout on error
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="w-6 h-6" /> Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <img
              src={profile.picture || PLACEHOLDER_IMG}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <UploadIcon className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Picture"}
            </Button>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={profile.name} onChange={e => handleChange("name", e.target.value)} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Age</Label>
              <Input value={profile.age} onChange={e => handleChange("age", e.target.value)} type="number" min="0" step="1" />
            </div>
            <div className="flex-1">
              <Label>Sex at Birth</Label>
              <Select
                value={profile.sex || ""}
                onValueChange={value => handleChange("sex", value)}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sex..." />
                </SelectTrigger>
                <SelectContent>
                  {SEX_OPTIONS.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</Label>
              <Input
                value={unitSystem === 'metric' ? profile.weight : kgToLbs(profile.weight)}
                onChange={e => handleChangeWithUnit('weight', e.target.value)}
                type="number"
                min="0"
                step="any"
              />
            </div>
            <div className="flex-1">
              <Label>Height ({unitSystem === 'metric' ? 'cm' : 'inches'})</Label>
              <Input
                value={unitSystem === 'metric' ? profile.height : cmToInches(profile.height)}
                onChange={e => handleChangeWithUnit('height', e.target.value)}
                type="number"
                min="0"
                step="any"
              />
            </div>
            <div className="flex flex-col items-center justify-end pb-2">
              <Label className="sr-only">Unit System</Label>
              <ToggleGroup
                type="single"
                value={unitSystem}
                onValueChange={val => {
                  if (val && val !== unitSystem) handleUnitToggle();
                }}
                className="w-full"
                size="sm"
              >
                <ToggleGroupItem value="metric">Metric</ToggleGroupItem>
                <ToggleGroupItem value="imperial">Imperial</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          <div>
            <Label>Race</Label>
            <Select
              value={profile.race}
              onValueChange={value => handleChange("race", value)}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select race..." />
              </SelectTrigger>
              <SelectContent>
                {RACE_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          {/* Password Reset Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LockIcon className="w-5 h-5 text-gray-600" />
              <Label className="text-base font-medium">Password Settings</Label>
            </div>
            
            {!showPasswordReset ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordReset(true)}
                className="w-full"
              >
                Set or Reset Password
              </Button>
            ) : (
              <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 chars, uppercase, lowercase, number)"
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    minLength={8}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={resettingPassword || !newPassword || !confirmPassword}
                    className="flex-1"
                  >
                    {resettingPassword ? "Updating..." : "Update Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordReset(false);
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                    disabled={resettingPassword}
                  >
                    Cancel
                  </Button>
                </div>
                {passwordError && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {passwordSuccess}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {error && <div className="flex items-center text-red-600 text-sm mt-2"><AlertCircle className="w-4 h-4 mr-1" />{error}</div>}
          {success && <div className="flex items-center text-green-600 text-sm mt-2"><CheckCircle className="w-4 h-4 mr-1" />Profile saved!</div>}
          {/* Save button removed, auto-save is now active */}
        </div>
      </DialogContent>
    </Dialog>
  );
} 