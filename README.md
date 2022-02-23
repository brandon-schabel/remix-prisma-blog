## Info
This is a simple Blog with a rich text editor. 

Current Features
- Basic Rich Text Editor using [Slate](https://github.com/ianstormtaylor/slate)
- Simple auth on posting
- Basic rich text parsing
- Rich text is stored in DB as JSON so it's fully customizable using Slate
- Images
- Sign In/Sign Up and Logout using Supabase
- Basic profiles and admin profiles
- Post publishing, when a post is made it is unpublished so they can review the post first.
- Post edit(if author or admin)
- Only accounts marked with "authorizedPoster" can create a post
- Error feedback and info messages
- Cloudinary Integration

I plan on adding
- Commenting
- Photo Gallery
## Setup
Install Packages
```
npm install
```

initialize your database 
```
npm run init-db-local
```

### .env file
DATABASE_URL="postgres_url"
ADMIN_USER=your_profile_name
ADMIN_PASS=your_password
CLOUD_NAME="cloudinary_cloud_name"
API_KEY="cloudinary_api_key"
API_SECRET="cloudinary_api_secret"
PUBLIC_SUPABASE_URL="https://appname.supabase.co"
PUBLIC_SUPABASE_SECRET_KEY="public_supabase_secret_key"


## Development
start your database
```
npm run start-db-local
```

run the server
note: The first time you run the app you may need to start it twice, the first time will be used to generate the tailwind style files, the restart is required for the server to pick it up. After that it will hot reload.

```
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

## Deployment

After having run the `create-remix` command and selected "Vercel" as a deployment target, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).


