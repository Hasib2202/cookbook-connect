# 🍳 CookBook Connect

A modern, full-featured recipe sharing platform built with Next.js 15, where food enthusiasts can discover, create, and share their favorite recipes with a vibrant community of home cooks and professional chefs.

![CookBook Connect](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🔐 **Authentication & User Management**
- **Secure Authentication**: NextAuth.js integration with email/password and social login support
- **User Profiles**: Personalized profiles with avatar support and bio sections
- **Session Management**: Persistent login sessions with secure token handling

### 🍽️ **Recipe Management**
- **Rich Recipe Creation**: Comprehensive recipe forms with step-by-step instructions
- **Image Gallery**: Multiple image uploads with Swiper.js carousel display
- **Recipe Categories**: Organized categorization system (Breakfast, Main Course, Desserts, etc.)
- **Difficulty Levels**: Easy, Medium, and Hard difficulty classification
- **Prep & Cook Times**: Detailed timing information for meal planning
- **Serving Sizes**: Adjustable serving size recommendations

### 🔍 **Advanced Search & Discovery**
- **Smart Search**: Real-time recipe search across titles and descriptions
- **Filter System**: Advanced filtering by category, difficulty, and cooking time
- **Search Pagination**: Efficient pagination for large recipe collections
- **Categories Browse**: Dedicated categories page with recipe counts
- **SQLite Optimized**: Database-compatible search queries for optimal performance

### ⭐ **Interactive Rating System**
- **5-Star Ratings**: Comprehensive rating system with visual star displays
- **Review Comments**: Detailed written reviews and feedback
- **Average Calculations**: Automatic average rating computations
- **Review Management**: Edit and update existing ratings

### ❤️ **Favorites & Social Features**
- **Recipe Favorites**: Save and organize favorite recipes
- **Personal Collections**: Build custom recipe collections
- **Social Sharing**: Share recipes within the community
- **User Interactions**: Like, comment, and engage with other cooks

### 📱 **Modern UI/UX**
- **Responsive Design**: Mobile-first responsive layout with Tailwind CSS
- **Dark/Light Mode**: Modern UI with Shadcn/ui component library
- **Interactive Components**: Smooth animations and transitions
- **Image Carousels**: Beautiful Swiper.js image galleries
- **Loading States**: Skeleton loaders and optimized loading experiences

### 🏠 **Homepage Features**
- **Featured Recipes**: Carousel display of highlighted recipes
- **Recent Additions**: Paginated recent recipes with navigation
- **Categories Grid**: Visual category exploration
- **Hero Search**: Prominent search section for quick discovery

### ⚡ **Performance & Optimization**
- **Next.js 15**: Latest framework features with App Router
- **Server Components**: Optimized rendering with React Server Components
- **Image Optimization**: Next.js Image component with lazy loading
- **Database Optimization**: Efficient Prisma queries with proper indexing
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form with Zod validation
- **Carousel**: Swiper.js
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### **Backend**
- **Runtime**: Node.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **API**: Next.js API Routes
- **Validation**: Zod schemas
- **File Upload**: Cloudinary integration

### **Development Tools**
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Database Management**: Prisma Studio
- **Development**: Hot reload with Fast Refresh

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hasib2202/cookbook-connect.git
   cd cookbook-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your configuration
   # NEXTAUTH_SECRET=your-secret-here
   # NEXTAUTH_URL=http://localhost:3000
   # DATABASE_URL="file:./dev.db"
   # CLOUDINARY_CLOUD_NAME=your-cloud-name
   # CLOUDINARY_API_KEY=your-api-key
   # CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Create and migrate database
   npm run prisma:migrate
   
   # (Optional) Seed test data
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
cookbook-connect/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── api/               # API routes
│   │   ├── recipes/           # Recipe-related pages
│   │   └── categories/        # Categories page
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── layout/            # Layout components
│   │   ├── recipe/            # Recipe-specific components
│   │   └── ui/                # Shadcn/ui components
│   ├── lib/                   # Utility libraries
│   │   ├── validations/       # Zod schemas
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── prisma.ts         # Prisma client
│   │   └── utils.ts          # Helper functions
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
└── scripts/                   # Utility scripts
```

## 🎯 Key Features Deep Dive

### Recipe Creation & Management
- **Rich Editor**: Multi-step recipe creation with ingredient lists and detailed instructions
- **Image Upload**: Support for multiple recipe images with drag-and-drop interface
- **Validation**: Comprehensive form validation using Zod schemas
- **CRUD Operations**: Full create, read, update, delete functionality for recipe owners

### Search & Filtering System
- **Real-time Search**: Instant search results as you type
- **Multi-criteria Filtering**: Filter by category, difficulty, prep time
- **Pagination**: Efficient pagination for large result sets
- **Category Browsing**: Dedicated category exploration with recipe counts

### User Experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, smooth transitions, and micro-interactions
- **Loading States**: Skeleton loaders and optimistic UI updates
- **Error Handling**: Graceful error handling with user-friendly messages

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and profile information
- **Recipe**: Complete recipe data with JSON fields for complex data
- **Rating**: User ratings and reviews for recipes
- **Favorite**: User's favorite recipes collection
- **Account/Session**: NextAuth.js authentication tables

### Key Relationships
- Users can create multiple recipes
- Users can rate and favorite recipes
- Recipes belong to categories and have difficulty levels
- Many-to-many relationships for user interactions

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run prisma:studio   # Open Prisma Studio
npm run prisma:migrate  # Run database migrations
npm run prisma:generate # Generate Prisma client
npm run prisma:db:pull  # Pull schema from database

# Utilities
npm run seed           # Seed test data
```

## 🌟 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Prisma Team** for the excellent ORM
- **Shadcn** for the beautiful UI components
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for deployment and hosting solutions

## 📞 Support

If you have any questions or need help with setup, please:
- Open an issue on GitHub
- Check the [documentation](docs/)
- Contact the maintainers

---

**Built with ❤️ by Hasib Mostofa**

*Happy Cooking! 🍳*

<!-- Force deployment trigger -->
