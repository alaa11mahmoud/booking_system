# عيادة د. هالة — Clinic Management System

A full-stack web application for managing a psychological clinic (Dr. Hala's Clinic). Built with **Laravel 12** (backend API) and **React 19** (frontend SPA).

## Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Backend  | Laravel 12, PHP 8.2+, Sanctum, SQLite                  |
| Frontend | React 19, Vite, Tailwind CSS 4, i18next, React Router  |
| Realtime | Laravel Echo + Pusher                                   |
| Auth     | Laravel Sanctum (API tokens)                            |

## Features

### Public Pages
- **Landing Page** — Hero section, services, 3D video carousel, certifications, testimonials, FAQ, social links, subscription programs
- **Video Library** — Browse educational psychological videos
- **Blog / Posts** — View clinic posts and articles

### Authentication
- User registration, login, logout
- Forgot password / reset password via email

### Patient Features
- **Online Booking** — Select date and available time slot, add notes, submit appointment request
- **Patient Dashboard** — View all appointments, filter by status (pending / approved / rejected / upcoming), see cancellation reasons

### Admin Features
- **Admin Dashboard** — Manage appointment requests (accept / reject with optional message), filter by status
- **Post Subscriptions** — View subscribers per post with member limits
- **Working Hours** — Configure available appointment slots dynamically
- **Content Management System (CMS)**
  - Manage About section (title, content, image, stats)
  - Upload and manage educational videos (YouTube / direct)
  - Manage certifications (title, issuer, date, image, description)
  - Create and manage blog posts (with price, member limits, date range)
  - Manage social media links (WhatsApp, Facebook, Telegram, Instagram, YouTube, Twitter)
  - Manage testimonials (name, role, avatar, review text)
  - Manage FAQs (question / answer pairs)
  - Image and video file upload

### Notifications
- Real-time notifications via Pusher for booking status updates
- Notification bell with unread count
- Mark individual or all notifications as read

### Internationalization
- Full Arabic (RTL) support via i18next
- Arabic-first UI with appropriate date/time formatting

## Getting Started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 20+
- SQLite (or another database supported by Laravel)

### Backend Setup

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Development (both servers concurrently)

```bash
cd backend
composer run dev
```

This runs the Laravel server, queue listener, log viewer, and Vite dev server concurrently.

## Project Structure

```
clinic/
├── backend/          # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # API controllers
│   │   ├── Models/                  # Eloquent models
│   │   └── Enums/                   # PHP enums
│   ├── config/                      # Laravel config
│   ├── database/migrations/         # DB migrations
│   └── routes/api.php               # API routes
├── frontend/         # React SPA
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   ├── components/              # Shared components
│   │   ├── contexts/                # React contexts
│   │   ├── lib/                     # Axios instance
│   │   └── locales/                 # i18n translations
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| POST   | `/api/register`                   | Register new user        |
| POST   | `/api/login`                      | Login                    |
| POST   | `/api/logout`                     | Logout                   |
| POST   | `/api/forgot-password`            | Send reset link          |
| POST   | `/api/reset-password`             | Reset password           |
| GET    | `/api/slots`                      | Get available slots      |
| POST   | `/api/bookings`                   | Create booking           |
| GET    | `/api/bookings`                   | List bookings            |
| PATCH  | `/api/bookings/{id}/status`       | Update booking status    |
| GET    | `/api/cms/about`                  | Get about section        |
| GET    | `/api/cms/videos`                 | Get videos               |
| GET    | `/api/cms/posts`                  | Get posts                |
| GET    | `/api/cms/testimonials`           | Get testimonials         |
| GET    | `/api/cms/faqs`                   | Get FAQs                 |
| GET    | `/api/notifications`              | Get notifications        |
| ...    | (see `routes/api.php` for full)   |                          |

## License

MIT
