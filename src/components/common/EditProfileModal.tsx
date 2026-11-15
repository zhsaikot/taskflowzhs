import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import {
  X,
  Camera,
  Upload,
  Link as LinkIcon,
  Check,
  User,
  Briefcase,
  Mail,
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    updateCurrentUser,
  } = useTasks();

  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState(currentUser.role);
  const [email, setEmail] = useState(currentUser.email);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isProfileModalOpen) {
      setName(currentUser.name);
      setRole(currentUser.role);
      setEmail(currentUser.email);
      setAvatar(currentUser.avatar);
      setCustomUrl('');
      setShowUrlInput(false);
    }
  }, [isProfileModalOpen, currentUser]);

  if (!isProfileModalOpen) return null;

  // Handle local image file upload -> Base64 Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security & sanity checks: Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Security Alert: Only valid image files (JPEG, PNG, WebP, GIF) are permitted.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB to ensure fast storage and performance.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result && result.startsWith('data:image/')) {
        setAvatar(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customUrl.trim();
    if (!trimmed) return;

    // Security check: Only allow safe HTTP/HTTPS or data:image/ protocols
    const isSafeUrl =
      /^(https?:\/\/)/i.test(trimmed) ||
      /^data:image\/(png|jpeg|webp|gif);base64,/i.test(trimmed);

    if (!isSafeUrl) {
      alert('Security Alert: Please enter a valid, secure image URL starting with https://');
      return;
    }

    setAvatar(trimmed);
    setShowUrlInput(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateCurrentUser({
      name: name.trim(),
      role: role.trim() || 'Tech Lead',
      email: email.trim() || 'user@acmecorp.io',
      avatar,
    });

    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-teal-500/20 overflow-hidden flex flex-col max-h-[90vh] bg-white dark:bg-obsidian-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Edit Profile & DP</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Change your display picture, name, role and details</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-obsidian-750 space-y-3">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-teal-500/40 shadow-glow-brand transition group-hover:brightness-75"
              />
              <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white text-[10px] font-medium">
                <Camera className="w-5 h-5 mb-0.5 text-teal-300" />
                <span>Upload DP</span>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Upload Buttons & Options */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-600/20 dark:hover:bg-teal-600/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 text-xs font-semibold cursor-pointer transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-obsidian-800 hover:bg-slate-100 dark:hover:bg-obsidian-750 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-obsidian-700 text-xs font-semibold cursor-pointer transition"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image URL</span>
              </button>
            </div>

            {/* Custom URL Input popdown */}
            {showUrlInput && (
              <div className="w-full flex items-center gap-2 pt-1 animate-in fade-in duration-100">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="Paste image URL (https://...)..."
                  className="flex-1 text-xs bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  disabled={!customUrl.trim()}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Set
                </button>
              </div>
            )}

            {/* Preset Avatars Row */}
            <div className="w-full pt-2 border-t border-slate-200 dark:border-obsidian-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Or pick a preset DP:
                </span>
              </div>
              <div className="flex items-center justify-center gap-2.5">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`relative rounded-full transition transform hover:scale-105 cursor-pointer ${
                      avatar === preset ? 'ring-2 ring-teal-500 ring-offset-2 ring-offset-white dark:ring-offset-obsidian-950 scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset}
                      alt={`Preset ${idx + 1}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {avatar === preset && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MD. Ziaul Hasan"
              className="w-full text-sm font-semibold bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Role / Job Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Job Title / Role</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Founder & Tech Lead, Engineering Manager"
              className="w-full text-xs font-medium bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Work Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ziaul.hasan@acmecorp.io"
              className="w-full text-xs font-medium bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-obsidian-750">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white text-xs font-bold shadow-glow-brand transition cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
