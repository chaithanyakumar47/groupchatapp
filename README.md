# Group Chat Application

A real-time group chat application with user authentication and image sharing capabilities.

## Features

- User account creation and authentication
- Join existing groups or create new groups
- Real-time messaging within groups using WebSockets
- Group admin functionality with ability to appoint other admins
- Image sharing support within group chats
- Archiving functionality implemented using a Cron Service

## Tech Stack

- Backend: Node.js with Express.js
- Database: NoSQL (specific database system to be specified)
- Real-time Communication: WebSockets
- Cloud Services: Amazon S3 for image storage
- Cron Service for archiving functionality

## Run Locally

Clone the project

```bash
  git clone https://github.com/chaithanyakumar47/groupchatapp.git
```

Go to the project directory

```bash
  cd groupchatapp
```

Install dependencies

```bash
  npm install
```

Set up environment variables:
- Create a `.env` file in the root directory

```
DB_CONNECTION_STRING=your_database_connection_string
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
JWT_SECRET=your_jwt_secret_key
WEBSOCKET_PORT=your_websocket_port
```

Start the server

```bash
  npm start
```

## Usage

After starting the server:

1. Create an account or log in
2. Join an existing group or create a new one
3. Start chatting in real-time with group members
4. Share images within the chat
5. Admins can manage the group and appoint other admins

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.



