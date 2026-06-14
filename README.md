# PGFinder — Find Verified PGs & Flats

A full-stack MERN web application for discovering and listing PGs, flats, and rooms across India. Built with a focus on real-world usability, clean UI, and role-based access control.

**Live Demo**: [pg-finder-ashesh.netlify.app](https://pg-finder-ashesh.netlify.app)

---

## Features

**For Tenants**
- Browse and filter listings by city, type, gender, furnishing, and rent range
- View detailed listing pages with images, amenities, and owner info
- Send direct inquiries to property owners
- Register and login securely with JWT auth

**For Owners**
- Add, manage, and delete property listings
- Upload property images via Cloudinary
- View and track tenant inquiries from dashboard
- Role-based dashboard with listing analytics

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs |
| Image Upload | Cloudinary + Multer |
| Deployment | Netlify (frontend), Render (backend) |

---

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- Cloudinary account

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Ashesh88/Pg-Finder.git
cd Pg-Finder

cd server
npm install

cd ../client
npm install
```

### Environment Variables

Create `server/.env`:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

### Run Locally

```bash
cd server
npm run dev

cd client
npm start
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/listings | Get all listings |
| POST | /api/listings | Create listing (owner) |
| GET | /api/listings/:id | Get listing by ID |
| DELETE | /api/listings/:id | Delete listing (owner) |
| POST | /api/inquiries | Send inquiry (tenant) |
| GET | /api/inquiries/listing/:id | Get inquiries (owner) |

---

## Author

**Ashesh Singh**  
B.Tech CSE | Galgotias College of Engineering and Technology  
[LinkedIn](https://linkedin.com/in/asheshsingh01) • [GitHub](https://github.com/Ashesh88) • [Portfolio](https://asheshh.netlify.app)
