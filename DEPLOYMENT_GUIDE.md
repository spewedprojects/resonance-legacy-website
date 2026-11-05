# Resonance Website: Production Deployment & Architecture Guide

This guide explains the architecture of the **Resonance Solutions** website, what is needed to transition from local development to a live production domain, and step-by-step instructions for hosting on both **Netlify** and **Amazon Web Services (AWS)**.

---

## Table of Contents
1. [Executive Summary: What the Code is Currently "Missing" for Production](#1-executive-summary-what-the-code-is-currently-missing-for-production)
   - [A. The LocalStorage vs. Central Database Gap](#a-the-localstorage-vs-central-database-gap)
   - [B. Single Page Application (SPA) Routing & The 404 Refresh Issue](#b-single-page-application-spa-routing--the-404-refresh-issue)
   - [C. Media & Photo Upload Storage (Base64 vs. Object Storage)](#c-media--photo-upload-storage-base64-vs-object-storage)
   - [D. Admin Security & Authentication](#d-admin-security--authentication)
2. [Deployment Option 1: Hosting on Netlify (Fastest & Jamstack)](#2-deployment-option-1-hosting-on-netlify-fastest--jamstack)
   - [Step 1: Push Repository to GitHub](#step-1-push-repository-to-github)
   - [Step 2: Connect Repository to Netlify](#step-2-connect-repository-to-netlify)
   - [Step 3: Configure Build Settings & SPA Redirects](#step-3-configure-build-settings--spa-redirects)
   - [Step 4: Connect Central Database (MongoDB Atlas)](#step-4-connect-central-database-mongodb-atlas)
   - [Step 5: Attach Custom Domain & SSL](#step-5-attach-custom-domain--ssl)
3. [Deployment Option 2: Hosting on Amazon Web Services (AWS)](#3-deployment-option-2-hosting-on-amazon-web-services-aws)
   - [Method A: AWS Serverless (S3 + CloudFront + Route 53) - Recommended](#method-a-aws-serverless-s3--cloudfront--route-53---recommended)
   - [Method B: AWS EC2 (Dedicated Virtual Machine + Ubuntu + Nginx)](#method-b-aws-ec2-dedicated-virtual-machine--ubuntu--nginx)
4. [Connecting a Real Database & Cloud Storage (Code Walkthrough)](#4-connecting-a-real-database--cloud-storage-code-walkthrough)
   - [Database Integration (MongoDB / Supabase / PostgreSQL)](#database-integration-mongodb--supabase--postgresql)
   - [Image Storage (AWS S3 Bucket or Cloudinary)](#image-storage-aws-s3-bucket-or-cloudinary)
5. [Pre-Launch Checklist](#5-pre-launch-checklist)

---

## 1. Executive Summary: What the Code is Currently "Missing" for Production

Right now, this project runs as a high-performance **Vite + React Single-Page Application (SPA)**. When run locally, everything feels fully dynamic because changes are saved to browser `localStorage`. 

To host this website on a public domain so that visitors, team members, and admins can use it across different devices worldwide, here are the architectural gaps to address:

```
+-----------------------------------------------------------------------------------------+
|                               CURRENT LOCAL ARCHITECTURE                                |
|  Visitor Browser A (Local)            Visitor Browser B (Phone)                         |
|  [ localStorage A: Blogs, Team ]       [ localStorage B: Empty / Defaults ]             |
|                  *Changes made on Browser A are NOT visible on Browser B*               |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
|                             PRODUCTION CLOUD ARCHITECTURE                               |
|  Visitors worldwide       ---> CDN (CloudFront / Netlify Edge) ---> Static Assets       |
|  Admin updates / Inquiries ---> Serverless API / Backend       ---> Cloud DB (MongoDB)   |
|  Uploaded Album Photos    ---> S3 Bucket / Cloudinary CDN                               |
+-----------------------------------------------------------------------------------------+
```

### A. The LocalStorage vs. Central Database Gap
* **Current State**: When an administrator updates a blog, changes advisory members, adds gallery albums, or when a student submits an inquiry on `/contact`, the data is saved in **that specific browser's `localStorage`**.
* **What is Needed**: A shared cloud database (such as **MongoDB Atlas**, **Supabase**, or **AWS DynamoDB/RDS**). When the admin publishes a new blog post, it should write to this database so that any user loading the site anywhere in the world immediately sees it.

### B. Single Page Application (SPA) Routing & The 404 Refresh Issue
* **Current State**: React Router handles routing in the browser (`/about`, `/gallery`, `/admin`, `/blog/post-title`).
* **What is Needed**: On a real web server, if a user directly enters `https://yourdomain.com/about` or presses **F5 (Refresh)**, the web server looks for a physical file called `/about/index.html`. Because that file doesn't exist on disk, the server returns an **HTTP 404 Not Found**.
  * **Fix for Netlify**: A `_redirects` or `netlify.toml` file redirecting all traffic to `/index.html` with status `200` (already prepared in this codebase).
  * **Fix for AWS CloudFront**: A Custom Error Response rule redirecting `403` and `404` to `/index.html` with HTTP `200`.
  * **Fix for AWS EC2 / Nginx**: `try_files $uri $uri/ /index.html;`.

### C. Media & Photo Upload Storage (Base64 vs. Object Storage)
* **Current State**: In the Gallery Album manager and Blog editor, uploaded photos are converted into compressed base64 text strings saved in browser storage.
* **What is Needed**: Browser storage has a limit (~5MB to 10MB). In production, images should upload directly to **AWS S3** or **Cloudinary**, and only the resulting image URL (`https://bucket.s3.amazonaws.com/...`) is saved in the database.

### D. Admin Security & Authentication
* **Current State**: Authentication checks a password stored in the browser's storage (`localStorage.isAdminAuthenticated = "true"`).
* **What is Needed**: A server-side authentication route verifying a bcrypt-hashed password and returning a secure, HTTP-only JWT cookie or session token.

---

## 2. Deployment Option 1: Hosting on Netlify (Fastest & Jamstack)

Netlify is the easiest and most cost-effective platform for this codebase because:
- It natively supports Vite React builds.
- It automatically handles free SSL (HTTPS) via Let's Encrypt.
- The repository already contains a `netlify.toml` configuration and pre-built serverless functions in `netlify/functions/`.

### Step 1: Push Repository to GitHub
Ensure all your latest changes are pushed to your GitHub repository:
```bash
git checkout dynamicweb
git push origin dynamicweb
```

### Step 2: Connect Repository to Netlify
1. Sign up or log in at [netlify.com](https://www.netlify.com).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Select **GitHub** and authorize access to your repository: `spewedprojects/resonance-legacy-website`.
4. Choose the branch: `dynamicweb` (or `main` if merged).

### Step 3: Configure Build Settings & SPA Redirects
Netlify will auto-detect the build settings from `netlify.toml`:
* **Build command**: `npm run build`
* **Publish directory**: `dist`
* **Functions directory**: `netlify/functions`

> **Note on SPA Routing**: The included `netlify.toml` in your root directory contains:
> ```toml
> [[redirects]]
>   from = "/*"
>   to = "/index.html"
>   status = 200
> ```
> This guarantees that URLs like `/about`, `/gallery`, `/admin` will never throw 404 errors on refresh.

### Step 4: Connect Central Database (MongoDB Atlas)
To make blogs and inquiries persist across all visitors:
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user with a secure password.
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** > **Drivers** and copy your connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xyz.mongodb.net/resonance?retryWrites=true&w=majority
   ```
5. In Netlify Dashboard:
   - Go to **Site Configuration** > **Environment variables**.
   - Add variable name: `MONGODB_URI`
   - Paste your MongoDB connection string.
6. Trigger a redeploy. Your Netlify functions in `netlify/functions/submit-enquiry.ts` and `netlify/functions/get-blogs.ts` are now live!

### Step 5: Attach Custom Domain & SSL
1. In Netlify Dashboard, go to **Domain management** > **Add a domain**.
2. Enter your custom domain (e.g. `resonancesolutions.in` or `www.resonancesolutions.in`).
3. In your domain registrar (GoDaddy, Namecheap, Hostinger, etc.):
   - Add a **CNAME record**:
     - Name: `www`
     - Value: `<your-site-name>.netlify.app`
   - Add an **A record** (for apex/root domain):
     - Name: `@`
     - Value: `75.2.60.5` (Netlify load balancer IP)
4. Netlify will automatically provision a free Let's Encrypt SSL certificate within a few minutes.

---

## 3. Deployment Option 2: Hosting on Amazon Web Services (AWS)

There are two primary ways to run this website on AWS:
- **Method A (Serverless: S3 + CloudFront)**: Highly recommended. Extremely fast, costs pennies per month ($0.50 - $2/month), auto-scales infinitely, zero server maintenance.
- **Method B (Virtual Server: EC2 + Nginx)**: For teams that prefer a traditional Linux virtual machine where they have root access.

---

### Method A: AWS Serverless (S3 + CloudFront + Route 53) - Recommended

```
[ User Request ] 
       │
       ▼
[ Route 53 (DNS) ] ──▶ [ CloudFront CDN (SSL/HTTPS) ] ──▶ [ S3 Bucket (dist/ files) ]
```

#### Step 1: Build the Production Files Locally or in CI
Run the build command in your terminal:
```bash
npm run build
```
This generates the optimized production bundle inside the `dist/` directory.

#### Step 2: Create and Configure the Amazon S3 Bucket
1. Open the **AWS Management Console** and search for **S3**.
2. Click **Create bucket**:
   - Bucket name: e.g. `resonance-website-prod` (must be globally unique).
   - Region: Choose the closest region to your audience (e.g., `ap-south-1` for Mumbai).
   - Uncheck **Block all public access** (acknowledge the warning, as this bucket serves public web assets).
3. Open the created bucket, go to the **Properties** tab:
   - Scroll down to **Static website hosting** and click **Edit**.
   - Select **Enable**.
   - Index document: `index.html`
   - Error document: `index.html`
   - Click **Save changes**.
4. Go to the **Permissions** tab > **Bucket policy** > click **Edit** and paste:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::resonance-website-prod/*"
           }
       ]
   }
   ```
   *(Replace `resonance-website-prod` with your exact bucket name).*
5. Upload all contents of your local `dist/` folder into this S3 bucket.

#### Step 3: Create CloudFront Distribution (CDN + HTTPS)
1. In the AWS Console, search for **CloudFront** > click **Create distribution**.
2. **Origin domain**: Select your S3 bucket website endpoint (e.g. `resonance-website-prod.s3-website.ap-south-1.amazonaws.com`).
3. **Viewer protocol policy**: Select **Redirect HTTP to HTTPS**.
4. **Custom SSL Certificate**:
   - Request or choose a free certificate from **AWS Certificate Manager (ACM)** in the `us-east-1` (N. Virginia) region.
5. **Alternate domain name (CNAME)**: Add your domain name (e.g. `www.resonancesolutions.in`).
6. **CRITICAL - Fix SPA 404 Routing in CloudFront**:
   - Once the distribution is created, go to the **Error pages** tab.
   - Click **Create custom error response**:
     - HTTP error code: `403: Forbidden`
     - Customize error response: **Yes**
     - Response page path: `/index.html`
     - HTTP Response code: `200: OK`
   - Create another custom error response:
     - HTTP error code: `404: Not Found`
     - Response page path: `/index.html`
     - HTTP Response code: `200: OK`
   *(This ensures refreshing `/gallery` or `/about` works smoothly without 404 errors).*

#### Step 4: Route 53 DNS Configuration
1. In **Route 53**, open your Hosted Zone.
2. Create an **A record**:
   - Check **Alias**.
   - Route traffic to: **Alias to CloudFront distribution**.
   - Select your CloudFront distribution domain name.

---

### Method B: AWS EC2 (Dedicated Virtual Machine + Ubuntu + Nginx)

If your organization prefers hosting everything on an EC2 instance:

```
[ User Browser ] ──HTTPS:443──▶ [ EC2 Security Group ] ──▶ [ Nginx Reverse Proxy ] ──▶ [ dist/ Static Files ]
```

#### Step 1: Launch the EC2 Instance
1. Open the EC2 Console and click **Launch instance**:
   - **Name**: `resonance-web-server`
   - **OS**: Ubuntu 24.04 LTS (HVM)
   - **Instance type**: `t3.micro` or `t3.small`
   - **Key pair**: Select or generate a `.pem` key pair for SSH access.
2. **Network settings / Security Group**:
   - Allow **SSH (Port 22)** from your IP.
   - Allow **HTTP (Port 80)** from Anywhere (`0.0.0.0/0`).
   - Allow **HTTPS (Port 443)** from Anywhere (`0.0.0.0/0`).

#### Step 2: SSH into the Server & Install Software
Connect from your terminal:
```bash
ssh -i "your-key.pem" ubuntu@<ec2-public-ip>
```
Update packages and install Node.js 20, Git, and Nginx:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Step 3: Clone Code & Build the Application
```bash
cd /var/www
sudo git clone -b dynamicweb https://github.com/spewedprojects/resonance-legacy-website.git resonance
cd resonance
sudo npm install
sudo npm run build
```
Verify the production build exists at `/var/www/resonance/dist`.

#### Step 4: Configure Nginx with SPA Routing
Create an Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/resonance
```
Paste the following block (replace `yourdomain.com` with your domain or EC2 Public IP):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/resonance/dist;
    index index.html;

    # Gzip Compression for high-speed page loads
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json image/svg+xml;

    # Browser Caching for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # CRITICAL: React Single Page Application routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    error_page 404 /index.html;
}
```
Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/resonance /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Install Free SSL with Let's Encrypt (Certbot)
Once your domain points to your EC2 Public IP:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot will automatically install the SSL certificates and configure automatic HTTPS renewals.

---

## 4. Connecting a Real Database & Cloud Storage (Code Walkthrough)

To move beyond browser `localStorage` and ensure changes sync globally across all users:

### Database Integration (MongoDB / Supabase / PostgreSQL)

In `src/lib/siteData.ts`, functions currently read from and write to `localStorage`:
```typescript
// CURRENT: LocalStorage
export const getStoredBlogs = (): BlogPost[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BLOGS);
    return data ? JSON.parse(data) : DEFAULT_BLOGS;
};
```

To sync with a cloud API, update these functions to fetch from your backend endpoints:
```typescript
// PRODUCTION: Cloud API Integration
const API_BASE = import.meta.env.VITE_API_URL || '/.netlify/functions';

export const fetchBlogsFromAPI = async (): Promise<BlogPost[]> => {
    try {
        const response = await fetch(`${API_BASE}/get-blogs`);
        const json = await response.json();
        return json.blogs || DEFAULT_BLOGS;
    } catch (e) {
        console.error("API error, falling back to local defaults", e);
        return DEFAULT_BLOGS;
    }
};
```

### Image Storage (AWS S3 Bucket or Cloudinary)

Instead of saving base64 Data URLs, connect image uploads to an AWS S3 bucket:

1. Create an S3 Bucket: `resonance-media-uploads`.
2. Generate an AWS IAM User with `PutObject` permissions.
3. In your backend API / Serverless function, generate a pre-signed upload URL.
4. The client uploads directly to S3:
```typescript
export const uploadImageToS3 = async (file: File): Promise<string> => {
    // 1. Ask backend for presigned URL
    const { uploadUrl, fileUrl } = await fetch('/api/get-presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, fileType: file.type })
    }).then(r => r.json());

    // 2. Upload file directly to S3
    await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
    });

    // 3. Return the public CDN URL to save in the album
    return fileUrl;
};
```

---

## 5. Pre-Launch Checklist

Before announcing the live domain to customers, clients, and partners:

- [ ] **DNS & SSL**: Confirm HTTPS is active and redirecting HTTP traffic automatically.
- [ ] **SPA Direct Link Test**: Open a private browsing tab and go directly to `https://yourdomain.com/about` and `https://yourdomain.com/gallery` to verify no 404 page is thrown.
- [ ] **Admin Credentials**: Log in to `/admin` using your admin credentials and immediately change the password using the new **Change Password** feature.
- [ ] **Contact Form Verification**: Submit a test inquiry on `/contact` and ensure it saves and displays confirmation.
- [ ] **Mobile Responsiveness**: Test on mobile browsers to ensure the sticky navigation, ERP placeholder button, and album modals scale smoothly.
- [ ] **Favicon & Meta Tags**: Verify the title tag and logo display properly in browser tabs and social share previews.

---

*Document compiled for Resonance Solutions production deployment.*
