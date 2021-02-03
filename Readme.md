## App Server

### Installation

1. git clone https://github.com/gravvityapp/server
2. cd server
3. npm install

### Setup

1.  Make a .env file in the root of directory.
2.  Add the following inside that:

        PORT=8080
        MONGO_URI=mongodb://localhost:27017/gravvity
        JWT_SECRET=hfsdajklfhljhflj

3.  npm run dev
