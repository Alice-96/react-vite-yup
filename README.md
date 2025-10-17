# React Vite Yup Trial App

A React application with Vite for trying out Yup validation with Formik, organized using a **feature-based architecture**.

## Features

- **Basic Validation**: Simple form validation with Yup and Formik
- **Nested Validation**: Complex nested object validation examples
- **Material-UI Integration**: Clean UI with Material-UI components

## Project Structure

This project follows a **feature-based architecture** for better maintainability and scalability:

```
src/
├── features/                 # Feature-based modules
│   ├── home/                # Home page feature
│   │   ├── HomePage.tsx
│   │   └── index.ts
│   ├── validation/          # Validation features
│   │   ├── basic/           # Basic validation examples
│   │   │   ├── BasicValidationPage.tsx
│   │   │   └── index.ts
│   │   ├── nested/          # Nested validation examples
│   │   │   ├── NestedValidationPage.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
├── shared/                   # Shared resources
│   ├── components/          # Reusable components
│   │   └── Page.tsx
│   ├── styles/              # Global styles
│   │   ├── App.css
│   │   └── index.css
│   └── index.ts
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── vite-env.d.ts           # Vite type definitions
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Architecture Benefits

- **Feature Isolation**: Each feature is self-contained with its own components and logic
- **Scalability**: Easy to add new features without affecting existing ones
- **Maintainability**: Clear separation of concerns and organized code structure
- **Reusability**: Shared components and utilities in the `shared` directory
