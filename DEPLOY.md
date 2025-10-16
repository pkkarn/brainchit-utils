# Deployment Setup

This project uses GitHub Actions to automatically deploy to your server when you push to the `main` branch.

## Required GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

### 1. SSH_HOST
Your server IP address or domain
```
Example: 192.168.1.100
Example: myserver.com
```

### 2. SSH_USERNAME
Username for SSH login
```
Example: ubuntu
Example: root
```

### 3. SSH_PRIVATE_KEY
Your private SSH key for authentication

To get your SSH key:
```bash
cat ~/.ssh/id_rsa
```

Copy the entire key including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### 4. DEPLOY_PATH
Full path to your project directory on the server
```
Example: /home/ubuntu/brainchit-utils
Example: /var/www/brainchit-utils
```

### 5. SSH_PORT (Optional)
SSH port (default: 22)
```
Example: 22
Example: 2222
```

## Server Setup

On your deployment server, make sure:

1. **Git is installed and repository is cloned:**
   ```bash
   cd /path/to/projects
   git clone git@github.com:pkkarn/brainchit-utils.git
   cd brainchit-utils
   ```

2. **Node.js and npm are installed:**
   ```bash
   node --version
   npm --version
   ```

3. **PM2 is installed globally:**
   ```bash
   npm install -g pm2
   ```

4. **MongoDB is running:**
   ```bash
   docker ps | grep mongodb
   # Or if using local MongoDB
   sudo systemctl status mongodb
   ```

5. **Environment variables are set:**
   ```bash
   # Create .env file on server
   nano .env
   ```

   Add:
   ```env
   PORT=7000
   MASTER_KEY=Asudye3hu332
   MONGODB_URI=mongodb://localhost:27017/brainchit_utils
   ```

6. **Initial PM2 setup (first time only):**
   ```bash
   npm install
   pm2 start server.js --name brainchit-utils
   pm2 save
   pm2 startup
   ```

## How It Works

1. You push code to `main` branch on GitHub
2. GitHub Actions triggers the deploy workflow
3. Workflow SSHs into your server
4. Pulls latest code from `main` branch
5. Installs npm dependencies
6. Restarts the PM2 process `brainchit-utils`
7. Shows PM2 status

## Manual Deployment

If you need to deploy manually:

```bash
# SSH into your server
ssh user@your-server

# Go to project directory
cd /path/to/brainchit-utils

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Restart PM2
pm2 restart brainchit-utils

# Check status
pm2 status
```

## Troubleshooting

### Deployment fails with "Permission denied"
Make sure your SSH key is added to the server:
```bash
ssh-copy-id user@your-server
```

### PM2 process not found
Start it manually first:
```bash
pm2 start server.js --name brainchit-utils
pm2 save
```

### Git pull fails
Check if repository is properly configured:
```bash
cd /path/to/brainchit-utils
git remote -v
git status
```

### Port already in use
Check what's using the port:
```bash
lsof -ti:7000
pm2 list
```

## View Deployment Logs

Check GitHub Actions logs:
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Click on the latest workflow run
4. View the deployment logs

Check PM2 logs on server:
```bash
pm2 logs brainchit-utils
pm2 logs brainchit-utils --lines 100
```
