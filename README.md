# EZCalc - Age Calculator

A beautiful, SEO-optimized Age Calculator built with Next.js 15, Tailwind CSS, and Hero UI (NextUI). Calculate your exact age and discover fascinating life insights!

## ✨ Features

- **Exact Age Calculation**: Calculate your precise age in years, months, and days
- **Total Time Lived**: See your life in days, hours, and minutes
- **Next Birthday Countdown**: Real-time countdown to your next birthday
- **Life Insights**: Discover fascinating statistics:
  - Water consumed (liters)
  - Oxygen inhaled (liters)
  - CO₂ exhaled (liters)
  - World population percentage
- **Famous Birthdays**: Find celebrities and historical figures who share your birthday
- **FAQ Section**: Comprehensive answers to common questions
- **SEO Optimized**: Full metadata, structured data, and semantic HTML
- **Monetization Ready**: Ad placement spaces included

## 🚀 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Hero UI (NextUI)
- **Animations**: Framer Motion
- **Date Utilities**: date-fns

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎨 Design Features

- **Dark Mode**: Beautiful dark theme with vibrant gradients
- **Glassmorphism**: Modern glass effects with backdrop blur
- **Animated Counters**: Smooth number animations using Framer Motion
- **Responsive Design**: Mobile-first approach, works on all devices
- **Micro-animations**: Hover effects and transitions for engaging UX

## 📊 SEO Strategy

- Comprehensive metadata using Next.js Metadata API
- Structured data (JSON-LD) for rich snippets
- Semantic HTML5 markup
- Open Graph and Twitter Card tags
- Optimized for "age calculator" and related keywords
- FAQ section for featured snippets

## 🗂️ Project Structure

```
EzCalc/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Main calculator page
│   └── globals.css         # Global styles
├── components/
│   ├── AgeCalculator.tsx   # Date input component
│   ├── ResultsDisplay.tsx  # Age results with animations
│   ├── LifeInsights.tsx    # Life statistics
│   ├── FamousBirthdays.tsx # Famous people component
│   ├── FAQ.tsx             # FAQ accordion
│   └── AdPlaceholder.tsx   # Ad space component
├── lib/
│   ├── ageCalculations.ts  # Age calculation logic
│   └── formatters.ts       # Number/date formatting
├── data/
│   └── famousBirthdays.ts  # Famous people database
└── public/                 # Static assets
```

## 🎯 Key Calculations

### Age Calculation
- Precise calculation accounting for leap years
- Handles month-end edge cases correctly
- Calculates total days, hours, minutes, and seconds

### Life Insights
- Water: ~2.5 liters/day average
- Oxygen: ~550 liters/day average
- CO₂: ~200 liters/day average
- Population percentage based on age demographics

## 🌟 Future Enhancements

- [ ] Add more famous people to the database
- [ ] Integrate with Wikipedia API for dynamic famous birthdays
- [ ] Add social sharing functionality
- [ ] Create age comparison tool
- [ ] Add zodiac sign information
- [ ] Multi-language support
- [ ] Dark/Light mode toggle
- [ ] Export results as image

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Tailwind CSS, and Hero UI
