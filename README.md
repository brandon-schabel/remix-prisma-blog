## Info
This is a simple Blog with a rich text editor. 

Current Featues
- Basic Rich Text Editor using [Slate](https://github.com/ianstormtaylor/slate)
- Simple auth on posting
- Basic rich text parsing
- Rich text is stored in DB as JSON so it's fully customizable using Slate

I plan on adding
- Basic profiles and admin profiles
- Commenting
- Images


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
#DATABASE_URL=#postgres db link/credentials

ADMIN_USER=your_profile_name
ADMIN_PASS=your_password


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


