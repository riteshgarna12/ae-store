// ============================================================
// FIREBASE CONFIG — Replace with your own from Firebase Console
// ============================================================
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// ============================================================
// YOUR UPI DETAILS — Replace with yours
// ============================================================
export const UPI_ID = import.meta.env.VITE_UPI_ID;           // e.g. john@paytm
export const UPI_NAME = import.meta.env.VITE_UPI_NAME;       // shown on QR
export const INSTAGRAM_HANDLE = "@motionvault.in";   // for footer

// ============================================================
// BUNDLES — Add/edit your packs here
// ============================================================
export const bundles = [
    {
    id: "AnimatedBG Pack",
    name: "Animated Backgrounds Pack",
    tagline: "100+ Looping backgrounds for your videos",
    price: 99,
    originalPrice: 199,
    badge: "NEW",
    color: "#3B82F6",
    category: "pr",
    includes: [
      "100+ Looping Backgrounds",
      "4K Resolution Support",
      "Seamless Loops",
      "Color Variations Included",
      "Free Support"
    ],
    preview: "/AnimatedBG Pack.png",
    features: "Perfect for presentations, social media, and more.",
    specs: {
      "Software": "Premiere Pro CC 2019+",
      "File Size": "120 MB",
      "Format": ".mp4 / .mov",
      "Plugins": "None Required",
      "License": "Commercial & Personal"
    } 
  },
  {
    id: "transitions-pro",
    name: "Transitions Pro Pack",
    tagline: "50+ Advanced transitions for any edit",
    price: 299,
    originalPrice: 599,
    badge: "BESTSELLER",
    color: "#7C3AED",
    category: "ae",
    includes: [
      "50+ Advanced Transitions",
      "Glitch & Distortion FX",
      "Zoom & Spin Variants",
      "Tutorial Included",
      "Lifetime Updates"
    ],
    preview: "/Advanced Transition Pack.png",
    features: "Works with AE CC 2020 and above. No plugins needed.",
    specs: {
      "Software": "After Effects CC 2020+",
      "File Size": "142 MB",
      "Format": ".aep & Presets",
      "Plugins": "None Required",
      "License": "Commercial & Personal"
    }
  },
  {
    id: "Text-Animations-Bundle",
    name: "Text Animations Bundle",
    tagline: "Dynamic text animations for your videos",
    price: 149,
    originalPrice: 299,
    badge: "POPULAR",
    color: "#F59E0B",
    category: "ae",
    includes: [
      "100+ Text Animations",
      "Kinetic Typography Styles",
      "Lower Thirds Pack",
      "Font Suggestions PDF",
      "Free Support"
    ],
    preview: "/Advanced Text Pack.png",
    features: "Easy to customize. Works with AE CC 2019+.",
    specs: {
      "Software": "Premiere Pro ",
      "File Size": "95 MB",
      "Format": ".aep Project File",
      "Plugins": "None Required",
      "License": "Commercial & Personal"
    }
  },

  {
    id: "titles-cinematic",
    name: "Cinematic Titles Bundle",
    tagline: "Hollywood-style text animations",
    price: 199,
    originalPrice: 399,
    badge: "HOT",
    color: "#22D3EE",
    category: "pr",
    includes: [
      "80 Title Templates",
      "Kinetic Typography",
      "Lower Thirds Pack",
      "Font Suggestions PDF",
      "Free Support"
    ],
    preview: "/Cinematic Titles Bundle.png",
    features: "Easy to customize. Works with AE CC 2019+",
    specs: {
      "Software": "Premiere Pro CC 2019+",
      "File Size": "85 MB",
      "Format": ".mogrt",
      "Plugins": "None Required",
      "License": "Commercial & Personal"
    }
  },
  {
    id: "motion-graphics-kit",
    name: "Motion Graphics Mega Kit",
    tagline: "Everything you need in one pack",
    price: 499,
    originalPrice: 999,
    badge: "BEST VALUE",
    color: "#F59E0B",
    category: "ae",
    includes: [
      "200+ Elements",
      "Transitions + Titles",
      "Social Media Templates",
      "Logo Reveal Pack",
      "Premium Support"
    ],
    preview: "/Motion Graphics Mega Kit.png",
    features: "The complete toolkit. AE CC 2020+ required.",
    specs: {
      "Software": "After Effects CC 2020+",
      "File Size": "412 MB",
      "Format": ".aep Project File",
      "Plugins": "None Required",
      "License": "Commercial & Personal"
    }
  },
  {
    id: "glitch-pack",
    name: "Glitch & VHS Effects",
    tagline: "Retro digital distortion presets",
    price: 149,
    originalPrice: 299,
    badge: "NEW",
    color: "#EF4444",
    category: "pr",
    includes: [
      "60 Glitch Presets",
      "VHS Overlay Pack",
      "Chromatic Aberration FX",
      "Noise & Grain Textures",
      "Video Tutorial"
    ],
    preview: "/Glitch & VHS Effects.png",
    features: "Perfect for music videos and social content.",
    specs: {
      "Software": "Premiere Pro CC 2019+",
      "File Size": "98 MB",
      "Format": ".prfpset & Overlays",
      "Plugins": "None Required",
      "License": "Commercial & Personal"
    }
  },
  {
    id: "free-titles",
    name: "Minimal Typography Pack",
    tagline: "15 Clean & minimal titles for your videos",
    price: 0,
    originalPrice: 99,
    badge: "FREE",
    color: "#10B981",
    category: "free",
    includes: [
      "15 Title Templates",
      "Fully Customizable",
      "4K Resolution support",
      "Lifetime Access",
      "Commercial Use Allowed"
    ],
    preview: "/Minimal Typography Pack.png",
    features: "Quick to customize, drag and drop into your sequence.",
    downloadUrl: "https://drive.google.com/drive/folders/your-free-assets-drive-link",
    specs: {
      "Software": "Premiere Pro & After Effects CC 2019+",
      "File Size": "12 MB",
      "Format": ".mogrt / .aep",
      "Plugins": "None Required",
      "License": "Royalty-Free Commercial"
    }
  }
];
