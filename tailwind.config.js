/** @type {import('tailwindcss').Config} */

// Palette BuddyEtude. Les noms Tailwind existants (indigo, gray, slate, purple) sont redéfinis
// pour que toutes les pages adoptent l'identité visuelle sans réécrire chaque classe.
const brand = {
  50: "#F4F2FF",
  100: "#EBE7FF",
  200: "#D9D1FF",
  300: "#BBACFF",
  400: "#987DFF",
  500: "#7A55FF",
  600: "#6438F5",
  700: "#5428DA",
  800: "#4522B0",
  900: "#3A1F8C",
  950: "#21105A",
};
const neutral = {
  50: "#F7F7FB",
  100: "#F0F0F6",
  200: "#E4E4EE",
  300: "#CDCDDB",
  400: "#9D9DB3",
  500: "#71718A",
  600: "#55556C",
  700: "#3E3E54",
  800: "#27273B",
  900: "#17172A",
  950: "#0C0C1A",
};
// Surfaces du mode sombre (bleu nuit profond)
const ink = {
  950: "#090A13",
  925: "#0D0E1A",
  900: "#12131F",
  850: "#171828",
  800: "#1D1E30",
  700: "#2A2B42",
  600: "#3D3E58",
};

module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        serif: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(23,23,42,.04), 0 6px 20px -6px rgba(23,23,42,.08)",
        lift: "0 2px 4px rgba(23,23,42,.04), 0 18px 40px -12px rgba(23,23,42,.18)",
        glow: "0 12px 40px -10px rgba(100,56,245,.55)",
        "inner-line": "inset 0 1px 0 rgba(255,255,255,.12)",
      },
      colors: {
        indigo: brand,
        brand,
        purple: {
          50: "#FBF2FF", 100: "#F5E3FF", 200: "#ECC8FF", 300: "#DE9DFF", 400: "#CB66FF",
          500: "#B83DF5", 600: "#9E22D9", 700: "#821BB3", 800: "#6A1A90", 900: "#561875", 950: "#380550",
        },
        gray: neutral,
        slate: neutral,
        ink,
        coral: { 50: "#FFF4F0", 100: "#FFE7DF", 200: "#FFCDBD", 300: "#FFAF95", 400: "#FF8A66", 500: "#FF6B42", 600: "#E8522A", 700: "#BF3F1C" },
        lime: { 100: "#F4FCCF", 200: "#E9F9A1", 300: "#DCF46B", 400: "#CBEA3B", 500: "#ADCF1C", 600: "#8BA814", 700: "#6A800F", 800: "#4E5E10" },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        wave: {
          "0%, 60%, 100%": { transform: "rotate(0deg)" },
          "10%, 30%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" },
        },
        "gradient-x": { "0%, 100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "33%": { transform: "translate(6%, -8%) scale(1.15) rotate(20deg)" },
          "66%": { transform: "translate(-6%, 6%) scale(0.92) rotate(-12deg)" },
        },
        shine: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        wave: "wave 2.2s ease-in-out 0.4s 1",
        "gradient-x": "gradient-x 8s ease infinite",
        marquee: "marquee 45s linear infinite",
        aurora: "aurora 18s ease-in-out infinite",
        "aurora-slow": "aurora 26s ease-in-out infinite reverse",
        shine: "shine 6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
