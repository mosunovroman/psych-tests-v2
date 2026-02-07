#!/usr/bin/env node
/**
 * FTP Deploy Script for Mind Pro
 * Uploads dist/ to mind-pro.online on reg.ru
 */

import * as ftp from 'basic-ftp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FTP_CONFIG = {
    host: "37.140.192.207",
    user: "u3391221",
    password: "Qaz123123123!!!",
    secure: false
}

const DOMAIN = "mind-pro.online"
const REMOTE_DIR = `/www/${DOMAIN}`
const LOCAL_DIST = path.join(__dirname, '..', 'dist')

async function uploadDirectory(client, localDir, remoteDir) {
    const items = fs.readdirSync(localDir)

    for (const item of items) {
        const localPath = path.join(localDir, item)
        const remotePath = `${remoteDir}/${item}`
        const stat = fs.statSync(localPath)

        if (stat.isDirectory()) {
            // Create remote directory if needed
            try {
                await client.ensureDir(remotePath)
            } catch (e) {
                // Directory might already exist
            }
            // Recursively upload directory contents
            await uploadDirectory(client, localPath, remotePath)
        } else {
            // Upload file
            await client.uploadFrom(localPath, remotePath)
            console.log(`  ✓ ${remotePath.replace(REMOTE_DIR, '')}`)
        }
    }
}

async function deploy() {
    console.log(`\n🚀 Deploying to ${DOMAIN}...\n`)

    if (!fs.existsSync(LOCAL_DIST)) {
        console.error(`❌ Error: ${LOCAL_DIST} does not exist`)
        console.error('Run "npm run build" first')
        process.exit(1)
    }

    const client = new ftp.Client()
    client.ftp.verbose = false

    try {
        console.log('📡 Connecting to FTP...')
        await client.access(FTP_CONFIG)
        console.log('✓ Connected\n')

        console.log('📤 Uploading files...')
        await uploadDirectory(client, LOCAL_DIST, REMOTE_DIR)

        // Upload .htaccess for SPA routing
        const htaccessContent = `
# Force HTTPS
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# SPA Routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
`
        const htaccessPath = path.join(__dirname, '..', '.htaccess.tmp')
        fs.writeFileSync(htaccessPath, htaccessContent.trim())
        await client.uploadFrom(htaccessPath, `${REMOTE_DIR}/.htaccess`)
        fs.unlinkSync(htaccessPath)
        console.log('  ✓ /.htaccess')

        console.log(`\n✅ Deployed successfully!`)
        console.log(`🌐 https://${DOMAIN}`)

    } catch (err) {
        console.error('\n❌ FTP Error:', err.message)
        process.exit(1)
    }

    client.close()
}

deploy()
