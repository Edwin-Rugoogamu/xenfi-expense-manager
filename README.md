# XenFi Expense Manager

A simple internal expense tracking tool built with Next.js, PostgreSQL, and Auth.js.

## Tech Stack

- **Frontend/Backend:** Next.js 14 (App Router) + TypeScript
- **Authentication:** Auth.js (NextAuth) with Credentials
- **Database:** PostgreSQL (Neon recommended)
- **ORM:** Prisma
- **UI:** Tailwind CSS
- **Deployment:** Vercel

## Features

- ✅ User authentication (login/register)
- ✅ Dashboard with expense statistics
- ✅ Expense management (CRUD)
- ✅ Category management (CRUD)
- ✅ Responsive design
- ✅ Data validation with Zod

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or Neon)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd xenfi-expense-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env` and update the values:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/xenfi_expense_manager"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   For production (Vercel + Neon):

   ```env
   DATABASE_URL="postgresql://username:password@hostname:5432/database?sslmode=require"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init

   # (Optional) Seed the database
   npm run db:seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Models

- **User**: Authentication and user data
- **Category**: Expense categories
- **Expense**: Individual expense records

### Relationships

- User has many Expenses
- Category has many Expenses
- Expense belongs to User and Category

## API Routes

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category

### Expenses

- `GET /api/expenses` - List user's expenses
- `POST /api/expenses` - Create new expense

## Deployment

### Vercel + Neon

1. **Create Neon database**

   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Deploy to Vercel**

   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Run migrations on production**
   ```bash
   npx prisma migrate deploy
   ```

## Usage

1. **Register/Login**

   - Create an account or log in with existing credentials

2. **Dashboard**

   - View expense statistics and recent transactions

3. **Manage Categories**

   - Add, view, and organize expense categories

4. **Track Expenses**
   - Record new expenses with amounts, categories, dates, and payment methods

## Demo Account

If seeded, use:

- Email: `demo@example.com`
- Password: `password123`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed the database

### Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   ├── auth/
│   │   ├── categories/
│   │   └── expenses/
│   ├── categories/
│   ├── dashboard/
│   ├── expenses/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Nav.tsx
│   └── SessionProvider.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── validators.ts
└── types/
    └── next-auth.d.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
