# UI Components Documentation

## Component Architecture

The application uses a modular component architecture with shadcn/ui components and custom implementations.

## Core UI Components

### Authentication Components
- **`SimpleAuthModal`** - Main authentication interface
  - Email/password sign-in
  - Magic link authentication
  - Google OAuth integration
  - Demo mode for development
  - **Fixed**: Removed duplicate rendering that caused DOM conflicts

- **`DevAuthModal`** - Development-only authentication
  - Mock user creation for testing
  - LocalStorage-based session management

### Dashboard Components
- **`DashboardLayout`** - Main dashboard structure
- **`DashboardHeader`** - Navigation and user info
- **`BottomNavigation`** - Mobile navigation
- **`ProgressChartSection`** - VO2Max progress visualization
- **`BloodBiomarkerSection`** - Health metrics display
- **`WeeklyTrackingPanel`** - Weekly data entry
- **`SessionMetricsLogging`** - Training session logging

### Form Components
- **`VO2MaxForm`** - Main VO2Max calculation form
- **`DemographicsTab`** - User demographic information
- **`FitnessTab`** - Fitness assessment data
- **`ProfileModal`** - User profile management

### Protocol Components
- **`ProtocolCard`** - Training protocol display
- **`ProtocolDetailModal`** - Detailed protocol information
- **`ProtocolTooltip`** - Protocol information tooltips
- **`ProtocolCalendarView`** - Protocol scheduling interface

### RAG System Components
- **`RagAdmin`** - RAG pipeline administration
  - Configurable prompt templates
  - Chunking and retrieval settings
  - Real-time pipeline monitoring
  - System configuration management

### Utility Components
- **`ThemeToggle`** - Light/dark mode switching
- **`ErrorBoundary`** - Error handling and recovery
- **`LoadingSpinner`** - Loading state indicators
- **`Toast`** - Notification system

## shadcn/ui Integration

### Base Components
- **Button** - Primary, secondary, outline variants
- **Input** - Text input fields with validation
- **Card** - Content containers with headers
- **Dialog** - Modal dialogs and overlays
- **Form** - Form handling with validation
- **Select** - Dropdown selection components
- **Tabs** - Tabbed interface components
- **Table** - Data table components
- **Badge** - Status and label indicators

### Advanced Components
- **Accordion** - Collapsible content sections
- **Alert** - Information and warning messages
- **Avatar** - User profile images
- **Calendar** - Date selection interface
- **Chart** - Data visualization components
- **Command** - Command palette interface
- **Drawer** - Slide-out navigation panels
- **HoverCard** - Rich tooltip components
- **Menubar** - Application menu system
- **NavigationMenu** - Site navigation
- **Popover** - Contextual information panels
- **Progress** - Progress indicators
- **ScrollArea** - Custom scrollable areas
- **Separator** - Visual dividers
- **Sheet** - Side panel components
- **Skeleton** - Loading placeholders
- **Slider** - Range selection controls
- **Switch** - Toggle controls
- **Textarea** - Multi-line text input
- **Tooltip** - Information tooltips

## Styling System

### Tailwind CSS
- **Utility-first approach** - Rapid styling with utility classes
- **Custom theme** - Brand colors and design tokens
- **Responsive design** - Mobile-first responsive layouts
- **Dark mode support** - Automatic theme switching

### Design Tokens
- **Colors** - Primary, secondary, accent, and semantic colors
- **Typography** - Font families, sizes, and weights
- **Spacing** - Consistent spacing scale
- **Border radius** - Rounded corner specifications
- **Shadows** - Elevation and depth indicators

## Component Patterns

### State Management
- **Local state** - useState for component-specific data
- **Context state** - Global state for auth, theme, forms
- **Custom hooks** - Reusable state logic

### Error Handling
- **Error boundaries** - Catch and display errors gracefully
- **Form validation** - Client-side and server-side validation
- **Loading states** - User feedback during async operations

### Accessibility
- **ARIA labels** - Screen reader support
- **Keyboard navigation** - Full keyboard accessibility
- **Focus management** - Proper focus handling
- **Color contrast** - WCAG compliance

## Recent Improvements

### Session Management
- **Fixed duplicate modals** - Resolved DOM ID conflicts
- **Improved error handling** - Better user experience
- **Loading states** - Clear feedback during operations

### RAG Admin Dashboard
- **Configurable interface** - Editable prompt templates
- **Real-time monitoring** - Live pipeline status
- **Theme integration** - Consistent styling with app theme

### Component Organization
- **Modular structure** - Clear separation of concerns
- **Reusable patterns** - Consistent component design
- **Type safety** - Full TypeScript integration 