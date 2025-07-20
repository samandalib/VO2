# Styling System

## Overview

The VO2Max Training App uses Tailwind CSS with a custom design system built on shadcn/ui components. The styling approach emphasizes consistency, accessibility, and maintainability.

## Core Technologies

### Tailwind CSS
- **Utility-first approach** - Rapid development with utility classes
- **Custom configuration** - Extended theme with brand colors
- **Responsive design** - Mobile-first responsive layouts
- **Dark mode support** - Automatic theme switching

### shadcn/ui
- **Component library** - High-quality React components
- **Radix UI primitives** - Accessible component foundations
- **Customizable design** - Theme-aware styling
- **Consistent patterns** - Unified design language

## Theme System

### Color Palette

#### Primary Colors
```css
--primary: 222.2 84% 4.9%; /* Dark blue for primary elements */
--primary-foreground: 210 40% 98%;
```

#### Secondary Colors
```css
--secondary: 210 40% 96%; /* Light gray for secondary elements */
--secondary-foreground: 222.2 84% 4.9%;
```

#### Accent Colors
```css
--accent: 210 40% 96%; /* Subtle accent for highlights */
--accent-foreground: 222.2 84% 4.9%;
```

#### Semantic Colors
```css
--destructive: 0 84.2% 60.2%; /* Red for errors/danger */
--destructive-foreground: 210 40% 98%;
--success: 142 76% 36%; /* Green for success states */
--warning: 38 92% 50%; /* Yellow for warnings */
--info: 217 91% 60%; /* Blue for information */
```

### Typography

#### Font Families
- **Primary**: Inter (sans-serif)
- **Monospace**: JetBrains Mono (for code/data)

#### Font Sizes
```css
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
--font-size-2xl: 1.5rem;   /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
```

### Spacing System

#### Consistent Scale
```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

## Component Styling

### Button Variants
```tsx
// Primary button
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">

// Secondary button
<Button variant="secondary" className="bg-secondary text-secondary-foreground">

// Outline button
<Button variant="outline" className="border border-input bg-background">

// Destructive button
<Button variant="destructive" className="bg-destructive text-destructive-foreground">
```

### Card Components
```tsx
// Standard card
<Card className="bg-card text-card-foreground border border-border">

// Elevated card
<Card className="bg-card text-card-foreground shadow-lg">
```

### Form Elements
```tsx
// Input field
<Input className="bg-background border border-input text-foreground">

// Textarea
<Textarea className="bg-background border border-input text-foreground">

// Select
<Select className="bg-background border border-input">
```

## Dark Mode Support

### Automatic Theme Switching
- **System preference detection** - Follows user's OS theme
- **Manual toggle** - User can override system preference
- **Persistent preference** - Remembers user's choice

### Theme-Aware Components
```tsx
// Components automatically adapt to theme
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Secondary text</p>
</div>
```

## Responsive Design

### Breakpoints
```css
/* Mobile first approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Responsive Patterns
```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
```

## Custom Utilities

### Animation Classes
```css
/* Smooth transitions */
.transition-all { transition: all 0.2s ease-in-out; }
.transition-colors { transition: color 0.2s ease-in-out; }

/* Hover effects */
.hover-lift { transform: translateY(-2px); }
.hover-scale { transform: scale(1.05); }
```

### Layout Utilities
```css
/* Centering */
.center-absolute { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

/* Glass effect */
.glass { backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.1); }
```

## Best Practices

### Class Organization
1. **Layout classes first** (display, position, flex, grid)
2. **Spacing classes** (margin, padding)
3. **Sizing classes** (width, height)
4. **Typography classes** (text, font)
5. **Visual classes** (background, border, shadow)
6. **Interactive classes** (hover, focus, active)

### Example
```tsx
<div className="
  flex flex-col md:flex-row    /* Layout */
  gap-4 md:gap-6              /* Spacing */
  w-full md:w-auto            /* Sizing */
  text-lg font-semibold       /* Typography */
  bg-card border rounded-lg   /* Visual */
  hover:shadow-lg transition-all /* Interactive */
">
```

## Recent Improvements

### Theme Consistency
- **Unified color system** - Consistent across all components
- **Improved contrast** - Better accessibility compliance
- **RAG Admin integration** - Theme-aware admin dashboard

### Component Styling
- **Fixed input colors** - Proper theme integration
- **Pipeline diagram colors** - Consistent with app theme
- **Modal styling** - Improved visual hierarchy

### Performance
- **Purged CSS** - Removed unused styles in production
- **Optimized classes** - Efficient utility usage
- **Lazy loading** - Component-based style loading 