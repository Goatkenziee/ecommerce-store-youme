# E-commerce Store

This is a full-stack e-commerce store built with Next.js, TypeScript, Tailwind CSS, Prisma, Clerk for authentication, and Stripe for payments.

## Features

- Product catalog
- Shopping cart
- Stripe checkout
- Order history
- Admin product management

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Goatkenziee/ecommerce-store-youme.git
   cd ecommerce-store-youme
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY"
   CLERK_SECRET_KEY="YOUR_CLERK_SECRET_KEY"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   STRIPE_SECRET_KEY="YOUR_STRIPE_SECRET_KEY"
   STRIPE_WEBHOOK_SECRET="YOUR_STRIPE_WEBHOOK_SECRET"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="YOUR_STRIPE_PUBLISHABLE_KEY"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. Initialize Prisma and seed the database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.
