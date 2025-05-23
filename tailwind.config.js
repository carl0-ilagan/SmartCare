/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
<<<<<<< HEAD
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
=======
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
<<<<<<< HEAD
        "soft-amber": "#F5B17B",
        "deep-amber": "#E67E22",
        "pale-stone": "#F5F5F5",
        "drift-gray": "#6B7280",
        graphite: "#333333",
        "soft-blue": "#60A5FA",
        "deep-blue": "#2563EB",
        "soft-green": "#34D399",
        "deep-green": "#059669",
        "soft-red": "#F87171",
        "deep-red": "#DC2626",
=======
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
<<<<<<< HEAD
=======
        "soft-amber": "#F5A623",
        "pale-stone": "#F5F5F0",
        "earth-beige": "#E5E5E0",
        graphite: "#333333",
        "drift-gray": "#666666",
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
<<<<<<< HEAD
        "pulse-slow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 },
        },
=======
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
<<<<<<< HEAD
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
=======
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
}
