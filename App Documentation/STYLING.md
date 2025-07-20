# Styling Structure

## Framework
- **Tailwind CSS** for utility-first styling
- **Custom classes** for overrides and layout
- **shadcn/ui** for reusable, themeable components

## Color Palette
- Defined in `tailwind.config.ts`
- Uses CSS variables for easy theming
- Supports light/dark mode
- Example colors: `primary`, `secondary`, `background`, `foreground`, `accent`, `muted`, `destructive`, etc.

## Fonts
- Set in `tailwind.config.ts` and `global.css`
- Default: Inter, system-ui, sans-serif
- Can be customized per component

## Theming
- Theme toggle (light/dark) via `ThemeContext` and `theme-toggle.tsx`
- All shadcn/ui components support theme switching

## Customization
- Extend Tailwind config for new colors, spacing, breakpoints
- Override styles with custom classes or Tailwind utilities

---
See also: `tailwind.config.ts`, `client/global.css`, and `components/ui/`. 