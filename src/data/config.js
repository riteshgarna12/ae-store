// ============================================================
// FIREBASE CONFIG — Replace with your own from Firebase Console
// ============================================================
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ============================================================
// YOUR UPI DETAILS — Replace with yours
// ============================================================
export const UPI_ID = "yourname@upi";           // e.g. john@paytm
export const UPI_NAME = "Your Store Name";       // shown on QR
export const INSTAGRAM_HANDLE = "@motionvault.in";   // for footer

// ============================================================
// BUNDLES — Add/edit your packs here
// ============================================================
export const bundles = [
  {
    id: "transitions-pro",
    name: "Transitions Pro Pack",
    tagline: "120+ seamless transitions for any edit",
    price: 299,
    originalPrice: 599,
    badge: "BESTSELLER",
    color: "#7C3AED",
    category: "ae",
    includes: [
      "120 Smooth Transitions",
      "Glitch & Distortion FX",
      "Zoom & Spin Variants",
      "Tutorial Included",
      "Lifetime Updates"
    ],
    preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
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
    preview: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
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
    preview: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
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
    preview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
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
    preview: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80",
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
