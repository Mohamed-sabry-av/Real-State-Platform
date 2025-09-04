# Real Estate Platform

A full-stack real estate platform built with Node.js and Angular, allowing users to browse, post, and interact with property listings.

## Features

- 🏠 Property Listings
- 🔍 Advanced Property Search & Filtering
- 💬 Real-time Chat System
- 🗺️ Interactive Property Maps
- 👤 User Authentication
- 💾 Save Favorite Properties
- 📱 Responsive Design
- 🖼️ Image Upload Support

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO (for real-time chat)
- JWT Authentication

### Frontend
- Angular
- SCSS
- Leaflet Maps
- Socket.IO Client

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Angular CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/realState.git
cd realState
```

2. Install Backend Dependencies
```bash
npm install
```

3. Install Frontend Dependencies
```bash
cd Client
npm install
```

4. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

5. Start the Backend Server
```bash
npm start
```

6. Start the Angular Development Server
```bash
cd Client
ng serve
```

The application will be available at `http://localhost:4200`

## Project Structure

```
├── Client/                 # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── guards/
│   └── public/            # Static assets
└── src/                   # Node.js Backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── socket/
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Properties
- `GET /api/posts` - Get all properties
- `POST /api/posts` - Create new property listing
- `GET /api/posts/:id` - Get specific property
- `PUT /api/posts/:id` - Update property listing
- `DELETE /api/posts/:id` - Delete property listing

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Messages
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send new message

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

Your Name - [Mohamed.sabry.av@gmail.com](mailto:Mohamed.sabry.av@gmail.com)

Project Link: [https://github.com/Mohamed-sabry-av/Real-State-Platform](https://github.com/Mohamed-sabry-av/Real-State-Platform)

