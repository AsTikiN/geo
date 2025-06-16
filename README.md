# Geo App

This is a Next.js application with Prisma ORM for database management.

## Prerequisites

### For Windows 10
1. Install Docker Desktop for Windows:
   - Download from: https://www.docker.com/products/docker-desktop
   - Run the installer
   - Restart your computer if prompted

### For Windows 7
1. Install Docker Toolbox:
   - Download from: https://docs.docker.com/toolbox/toolbox_install_windows/
   - Run the installer
   - Restart your computer if prompted

### For macOS
1. Install Docker Desktop for Mac:
   - Download from: https://www.docker.com/products/docker-desktop
   - Run the installer
   - Start Docker Desktop

## Running the Application

### Windows Users
1. Make sure Docker Desktop (Windows 10) or Docker Toolbox (Windows 7) is running
2. Double-click `start-app.bat`
3. Wait for the application to start
4. The application will open in your default browser at http://localhost:3000
5. To stop the application, double-click `stop-app.bat`

### macOS Users
1. Open Terminal
2. Navigate to the project directory:
   ```bash
   cd /path/to/geo-app
   ```
3. Start the application:
   ```bash
   docker-compose up -d
   ```
4. Open your browser and go to http://localhost:3000
5. To stop the application:
   ```bash
   docker-compose down
   ```

## Troubleshooting

### If you see "Docker is not running" error:
1. Make sure Docker Desktop (Windows 10/Mac) or Docker Toolbox (Windows 7) is running
2. Wait until Docker is fully started
3. Try running the start script again

### If you see "port already in use" error:
1. Stop the application using `stop-app.bat` or `docker-compose down`
2. Wait a few seconds
3. Try starting the application again

### If you see database errors:
1. Stop the application
2. Delete the `prisma/prod.db` file if it exists
3. Start the application again

### For Windows 7 users:
- The application will be available at the Docker machine IP instead of localhost
- To find the IP, run `docker-machine ip default` in Docker Quickstart Terminal
- Then visit http://[docker-machine-ip]:3000

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
