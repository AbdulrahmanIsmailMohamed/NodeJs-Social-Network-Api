# 🚀 Nodejs Social Network API (Facebook clone)

<h3 align="center">Social Network built using NodeJS & Typescript & Express & MongoDB</h3>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
     <li>
      <a href="#file-structure">File Structure</a>
    </li>
    <li>
      <a href="#key-features">Key Features</a>
    </li>
    <li>
      <a href="#build-with">Build With</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
    <li>
      <a href="#known-bugs">Known Bugs</a>
    </li>
    <li>
      <a href="#contact">Contact</a>
    </li>
  </ol>
</details>

## file structure

![GitHub Logo](/readme_img/file_structure.jpg)

# Environment Variables

&nbsp;

```ENV
# App Setting
PORT = 3000
API = /api/v1
NODE_ENV = development

# db
MONGO_URL = mongodb+srv://abdulrahmanismailmohammed:HV8APWg4Gcoy91ND@social-netwok.hez2c0m.mongodb.net/?retryWrites=true&w=majority

# JWT
JWT_SEC = I LOVE JWT THIS IS MY BESTY 12332313
JWT_EXPIRE = 30d

# cloudinary
CLOUDINARY_CLOUD_NAME = dqm9gatsb
CLOUDINARY_API_KEY = 135727298987233
CLOUDINARY_API_SECRET = bxRy88UuqEtMl-prS5dS4pGGGlc

# nodemailer
MAILRE_HOST = smtp.gmail.com
MAILRE_PORT = 465
MAILRE_USER = programabdulrahman@gmail.com
MAILRE_PASS = zibkozvfjaahgsqy

```

&nbsp;

## Key Features

- Authentication
  - Login [Public]
  - SignUp [Public]
  - Tokens [User]
- Password Management
  - Forgot Password [Public]
  - Reset Password [Public]
- Email Management
  - Send the verification code to change the password [Public]
- User
  - Get All Users [Admin]
  - Get User Profile Using It's ID [User]
  - Get Logged User Profile [User]
  - Update logged User Profile (name, address, number, profile image and other) [User]
  - Inactive my account [user]
- Friends
  - Send Friend Request [User]
  - Get Friend Request List [User]
  - Get My Friends Request [User]
  - Accept Friend Request [User]
  - Cancel Friend Request [User]
  - Delete Friend From Friends List [User]
  - Get Friends [User]
- Followers
  - Follow User [User]
  - Un Follow User [User]
  - Get Followers [User]
  - Get the people they i follow [User]
- Posts
  - Create Post [User]
  - Update Post [User]
  - Delete Post [User]
  - Get Logged User Posts [User]
  - hide User Posts (for 30day) [User]
  - Render Time Line (get posts friends and those I follow ) [User]
  - Share Post [User]
  - Get Memories (posts Created On The Same Day) [User]
- Comments
  - Create Comment [User]
  - Update Comment [User]
  - Delete Comment [User]
  - Get Post Comments [User]
  - Get Comment [User]
- Replys
  - Create Reply [User]
  - Get Comment Replys [User]
  - Delete Reply [User]
- Likes
  - Add Like on post [User]
  - Delete Like on post [User]
  - Get Fans [User]
- Favourites
  - Add Post To favourite list [User]
  - Get All Posts from favourite list [User]
  - Delete Post From favourite [User]
- Marketplace
  - create Item for sale [User]
  - Update Item [User]
  - Delete Image (from cloudinary and delete link from db) [User]
  - Un Available [User]
  - Delete Item [User]
  - Get Items For Sale [User]
  - Get Logged User Items For Sale [User]
- Unite Test 
  - I did unit testing on all endpoints by Jest, chai and supertest
  
## Built With

List of any major frameworks used to build the project.

* [NodeJS](https://nodejs.org/) - JS runtime environment
* [ExpressJS](https://expressjs.com/) - The NodeJS framework used
* [MongoDB](https://www.mongodb.com/) - NoSQL Database uses JSON-like documents with optional schemas
* [Mongoose](https://mongoosejs.com/) - Object Data Modeling (ODM) library for MongoDB and NodeJS
* [Bcrypt](https://www.npmjs.com/package/bcrypt) - Encryption & Decryption Algorithm
* [Compression](https://www.npmjs.com/package/compression) - NodeJS compression middleware
* [Dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from a . env file into process. env
* [Rate Limiter](https://www.npmjs.com/package/express-rate-limit) - Basic IP rate-limiting middleware for Express
* [JWT](https://jwt.io/) - Compact URL-safe means of representing claims to be transferred between two parties
* [Morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for NodeJS
* [Multer](https://www.npmjs.com/package/multer) - NodeJS middleware for handling multipart/form-data
* [Nodemailer](https://www.npmjs.com/package/nodemailer) - Easy as cake e-mail sending from your Node.js applications
* [Express-Validator](https://www.npmjs.com/package/express-validator) - A library of string validators and sanitizers.
* [Winston](https://www.npmjs.com/package/winston) - A logger for just about everything.
* [node-geocoder](https://www.npmjs.com/package/node-geocoder) -  translating a human-readable address into a location on a map
* [cloudinary](https://www.npmjs.com/package/cloudinary) - Allow us to store image in cloud

## Installation

You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the
dependencies by running
```
$ npm install
set your env variables
$ npm run start:dev
``` 

## Known Bugs
Feel free to email me at abdulrahman.ismail.mohammed@gmail.com if you run into any issues or have questions, ideas or concerns.n into any issues or have questions, ideas or concerns.
Please enjoy and feel free to share your opinion, constructive criticism, or comments about my work. Thank you! 🙂

<!-- CONTACT -->
## Contact

Email - [abdulrahman.ismail.mohammed@gmail.com](abdulrahman.ismail.mohammed@gmail.com)

LinkedIN - [Abdulrahman Ismail](https://www.linkedin.com/in/abdulrahman-ismail-ab6a84209)

Project: [https://github.com/AbdulrahmanIsmailMohamed/NodeJs-Social-Network-Api](https://github.com/AbdulrahmanIsmailMohamed/NodeJs-Social-Network-Api)
