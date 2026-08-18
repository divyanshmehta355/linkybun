# LinkyBun

LinkyBun is a modern, high-performance link-in-bio platform built for creators, professionals, and brands. It allows users to create a customizable, centralized page to share all their important links with their audience in one place.

## 🚀 Features

- **Personalized Public Profiles:** Claim a unique username (e.g., `linkybun.com/creator`) and customize your public-facing bio and links.
- **Intuitive Dashboard:** A seamless, easy-to-use dashboard to add, edit, and delete links.
- **Drag-and-Drop Reordering:** Effortlessly organize your links with smooth drag-and-drop functionality using `@dnd-kit`.
- **Advanced Analytics:** Track the performance of your links with beautiful, interactive charts powered by `Recharts`. Monitor clicks over time and discover what content resonates most with your audience.
- **Pro Upgrades:** Users can upgrade to a Pro tier for premium features, with payment processing integrated via Razorpay.
- **Secure by Default:** Built on Supabase with robust Row Level Security (RLS) to ensure your data is perfectly protected.
- **High Performance:** Statically generated public profiles and dynamic, authenticated dashboards utilizing Next.js App Router and Turbopack.

## 🛠️ Technology Stack

- **Framework:** Next.js 15+ (App Router, Turbopack, Server Actions)
- **Database & Auth:** Supabase (PostgreSQL, GoTrue Auth, Row Level Security)
- **Styling:** Tailwind CSS, `shadcn/ui`
- **Charts:** Recharts
- **Drag & Drop:** `@dnd-kit`
- **Payments:** Razorpay

## 🌊 Application Flows

LinkyBun's architecture is designed around several core user flows:

### 1. Onboarding & Authentication Flow
- **Sign Up / Log In:** Users authenticate via Supabase Auth (`/auth/login`). 
- **Middleware Protection:** Our custom Next.js middleware intelligently protects authenticated routes while allowing public profiles to remain completely open.
- **Claiming a Username:** New users are automatically routed to `/onboarding` to claim a unique username and setup their profile before they can access the dashboard.

### 2. Creator Dashboard Flow
- **Link Management:** In the `/dashboard`, users can instantly add new links, toggle their visibility, delete them, and rearrange them via a drag-and-drop interface.
- **Real-Time Updates:** Changes are instantly synced with the Supabase backend via Server Actions and automatically revalidated.
- **Analytics View:** Creators can analyze their link performance over the past 7 days, filtering by specific links to view granular data.

### 3. Public Profile Flow
- **Visitor Access:** When a visitor lands on a creator's page (e.g., `/[username]`), they are served a lightning-fast, SEO-optimized page.
- **Click Tracking:** Interactions on the public page securely increment click counts in the backend for the creator's analytics, entirely anonymously.

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- A Supabase Project (Database, Auth)
- A Razorpay Account (for testing payments)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/divyanshmehta355/linkybun.git
   cd linkybun
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Rename `.env.local.example` to `.env.local` and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security Notes

- **Row Level Security (RLS):** Policies are strictly enforced at the database level. Creators can only modify their own profiles and links, while public profile reads are allowed globally.
- **Click Tracking:** In a production environment, it is highly recommended to implement rate limiting on the `/clicks` endpoint to prevent abuse of analytics data.

---

Built with ❤️ for creators.
