# LeelaGitOS

A modern, production-ready web application built with cutting-edge technologies and designed for rapid development with AI assistance.

## 🌟 Project Overview

LeelaGitOS is a comprehensive web application scaffold that combines the power of modern React development with robust backend capabilities. Built with developer experience in mind, this project serves as a foundation for creating scalable, type-safe applications with beautiful user interfaces.

### Project Vision

Our vision is to provide developers with a complete, production-ready foundation that accelerates development while maintaining code quality, type safety, and modern best practices. LeelaGitOS bridges the gap between rapid prototyping and enterprise-grade applications.

## ✨ Key Features

- 🎨 **Beautiful UI Components** - Complete shadcn/ui component library with dark/light theme support
- 🔒 **Type-Safe Development** - Full TypeScript integration with Zod validation
- 🗄️ **Database Ready** - Prisma ORM with type-safe database operations
- 🔐 **Authentication Built-in** - NextAuth.js for secure user authentication
- 📊 **Data Visualization** - Charts, tables, and interactive data components
- 🎭 **Smooth Animations** - Framer Motion for polished user interactions
- 🌍 **Internationalization** - Multi-language support with Next Intl
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🚀 **Performance Optimized** - Built-in optimization for production deployment
- 🤖 **AI-Friendly** - Structured codebase optimized for AI assistance

## 🛠️ Technology Stack

### Core Framework
- **⚡ Next.js 15** - React framework with App Router for server-side rendering and static site generation
- **📘 TypeScript 5** - Type-safe JavaScript for enhanced developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI primitives
- **🎯 Lucide React** - Consistent and beautiful icon library
- **🌈 Framer Motion** - Production-ready animation library for React
- **🎨 Next Themes** - Seamless dark/light mode implementation

### Forms & Validation
- **🎣 React Hook Form** - Performant forms with minimal re-renders
- **✅ Zod** - TypeScript-first schema validation with runtime type checking

### State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management solution
- **🔄 TanStack Query** - Powerful data synchronization and caching for React
- **🌐 Axios** - Promise-based HTTP client for API requests

### Database & Backend
- **🗄️ Prisma** - Next-generation ORM for Node.js and TypeScript
- **🔐 NextAuth.js** - Complete authentication solution for Next.js applications

### Advanced Features
- **📊 TanStack Table** - Headless UI for building powerful data tables
- **🖱️ DND Kit** - Modern drag-and-drop toolkit for React applications
- **📊 Recharts** - Composable charting library built with React and D3
- **🖼️ Sharp** - High-performance image processing for web

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Siddamnandas/LeelaGitOS.git
   cd LeelaGitOS
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and configure your environment variables:
   - Database connection string
   - NextAuth configuration
   - Any API keys or external service credentials

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👨‍💻 Development Workflow

### Available Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Run TypeScript type checking
- `npm run db:studio` - Open Prisma Studio for database management
- `npm run db:reset` - Reset the database schema

### Development Guidelines

1. **Component Development**
   - Use TypeScript for all components
   - Follow the established folder structure
   - Implement proper prop validation with Zod when needed
   - Use shadcn/ui components as building blocks

2. **State Management**
   - Use Zustand for global state
   - Use TanStack Query for server state
   - Keep component state local when possible

3. **Styling**
   - Use Tailwind CSS classes
   - Leverage CSS variables for theming
   - Follow mobile-first responsive design principles

4. **Database Operations**
   - Use Prisma Client for all database interactions
   - Write type-safe queries
   - Handle errors appropriately

## 📁 Code Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/            # Authentication-related pages
│   ├── api/               # API route handlers
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components and validation
│   ├── layout/           # Layout-related components
│   └── features/         # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Prisma client setup
│   ├── utils.ts         # General utility functions
│   └── validations.ts   # Zod schemas for validation
├── stores/              # Zustand store definitions
├── types/               # TypeScript type definitions
└── utils/               # Helper functions and constants
```

### Key Directories

- **`/app`** - Next.js 13+ App Router structure with file-based routing
- **`/components/ui`** - shadcn/ui components (Button, Input, Dialog, etc.)
- **`/lib`** - Core utilities, database setup, and configuration files
- **`/hooks`** - Custom React hooks for reusable logic
- **`/stores`** - Global state management with Zustand
- **`/types`** - TypeScript interfaces and type definitions

## 🤝 Contribution Guide

### Getting Started as a Contributor

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** following our coding standards
5. **Test thoroughly** - ensure all existing tests pass
6. **Submit a pull request** with a clear description

### Coding Standards

- **TypeScript** - All new code must be written in TypeScript
- **ESLint** - Follow the configured ESLint rules
- **Prettier** - Use Prettier for consistent code formatting
- **Naming Conventions**:
  - Components: PascalCase (e.g., `UserProfile.tsx`)
  - Files: kebab-case (e.g., `user-profile.utils.ts`)
  - Functions: camelCase (e.g., `getUserProfile`)

### Pull Request Guidelines

- Provide a clear description of changes
- Include screenshots for UI changes
- Reference related issues if applicable
- Ensure all tests pass and no TypeScript errors
- Update documentation as needed

### Issue Reporting

- Use the provided issue templates
- Include steps to reproduce bugs
- Provide system information and versions
- Add labels to categorize the issue

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Configure environment variables** in the Vercel dashboard
3. **Deploy automatically** on every push to main branch

#### Environment Variables for Vercel:
```
DATABASE_URL=your_database_connection_string
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t leelagitos .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 --env-file .env leelagitos
   ```

### Manual Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Set up environment variables** on your server

3. **Start the production server**
   ```bash
   npm run start
   ```

### Database Migration for Production

```bash
# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate deploy
```

## 📊 Project Stats

- **Components**: 50+ reusable UI components
- **Type Safety**: 100% TypeScript coverage
- **Bundle Size**: Optimized for performance
- **Accessibility**: WCAG 2.1 AA compliant components
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 🐛 Known Issues & Roadmap

### Current Known Issues
- Minor styling inconsistencies in Safari
- Performance optimization needed for large datasets

### Upcoming Features
- Enhanced mobile experience
- Additional chart types
- Real-time collaboration features
- Advanced filtering and search

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components powered by [shadcn/ui](https://ui.shadcn.com/)
- Database operations with [Prisma](https://www.prisma.io/)
- Form validation with [Zod](https://zod.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ for the developer community. Ready to power your next project! 🚀**
