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

### Test Credentials

- email : bella@gmail.com
- Password: Rugoogamu123#

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

## Deployment

### Vercel + Neon

1. **Created Neon database**

2. **Deployed to Vercel**

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
