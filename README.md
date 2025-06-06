# SmartCare - Healthcare Communication Platform

SmartCare is a modern healthcare communication platform built with Next.js, WebRTC, and Firebase. It enables seamless communication between doctors and patients through video calls, voice calls, and chat functionality.

## Features

- **Real-time Video Calls**: High-quality video conferencing using WebRTC
- **Voice Calls**: Crystal clear audio calls
- **Chat System**: Real-time messaging with support for text, images, and files
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Call Quality Monitoring**: Real-time monitoring of call quality
- **File Sharing**: Share medical documents and images
- **Online Status**: See when users are online/offline
- **Message Status**: Track message delivery and read status

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Real-time Communication**: WebRTC
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context API
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smartcare.git
cd smartcare
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Firebase configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
smartcare/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Patient dashboard
│   ├── doctor/           # Doctor dashboard
│   └── calls/            # Call pages
├── components/            # Reusable components
├── contexts/             # React contexts
├── lib/                  # Utility functions
├── public/              # Static assets
└── styles/              # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- WebRTC for real-time communication
- Firebase for backend services
- Next.js team for the amazing framework
- All contributors who have helped shape this project

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#   C a p s t o n e - 
 
 