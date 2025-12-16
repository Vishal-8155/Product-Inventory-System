# Deployment Guide for Render

This guide will help you deploy the Product Inventory System on Render.

## Prerequisites

1. A GitHub account
2. A Render account (sign up at https://render.com)
3. A MongoDB Atlas account (for database hosting)

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user with a password
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your MongoDB connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/database`)

## Step 2: Push Code to GitHub

Make sure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 3: Deploy on Render

### Option A: Using render.yaml (Automatic)

1. Log in to Render (https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Set the environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (e.g., generate one using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
6. Click "Apply" to deploy

### Option B: Manual Setup

1. Log in to Render (https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: product-inventory-system
   - **Environment**: Node
   - **Build Command**: `npm run deploy`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

5. Add Environment Variables:
   - Click "Advanced" → "Add Environment Variable"
   - Add the following variables:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_connection_string_here
     JWT_SECRET=your_jwt_secret_here
     PORT=5000
     ```

6. Click "Create Web Service"

## Step 4: Wait for Deployment

- Render will automatically build and deploy your application
- The build process takes about 5-10 minutes
- You can monitor the progress in the Render dashboard logs

## Step 5: Seed Categories (Optional)

After the first deployment, you may want to seed the categories:

1. Go to your Render service dashboard
2. Click on "Shell" tab
3. Run: `npm run seed`

## Step 6: Access Your Application

Once deployment is complete:
- Your app will be available at: `https://your-app-name.onrender.com`
- The API will be accessible at: `https://your-app-name.onrender.com/api`

## Environment Variables Reference

Create a `.env` file locally for development (already gitignored):

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

For production on Render, set these in the Render dashboard.

## Troubleshooting

### Build fails
- Check the build logs in Render dashboard
- Ensure all dependencies are listed in package.json
- Verify MongoDB connection string is correct

### App crashes on startup
- Check the service logs in Render dashboard
- Verify environment variables are set correctly
- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)

### API requests fail
- Check CORS settings in server.js
- Verify API routes are working
- Check MongoDB connection

### Free tier limitations
- Render free tier services spin down after 15 minutes of inactivity
- First request after inactivity may take 30-50 seconds (cold start)
- Consider upgrading to a paid plan for production use

## Post-Deployment

1. Test all features:
   - User registration and login
   - Adding products
   - Editing products
   - Deleting products
   - Filtering and search
   - Pagination

2. Monitor your app:
   - Check Render dashboard for logs and metrics
   - Monitor MongoDB Atlas for database performance

## Updating Your Application

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect the changes and redeploy your application.

## Support

- Render Documentation: https://render.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com

---

**Note**: Make sure to never commit your `.env` file or expose your environment variables publicly!

