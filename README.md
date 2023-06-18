# Imperial Archives

## [See the App!](https://imperial-archives.adaptable.app/)

<img src="https://github.com/pedromndias/imperial-archives/blob/main/public/images/logo-02.png?raw=true" width="500" height="100">

## Description

Social network where users can comment on different Star Wars characters, add as favorite, see info on all movies and series. Users can filter characters by their species or homeworld.
Moderators can add new characters and edit them. Administrator can delete user if not moderator.
 
## User Stories

- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **register** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **main** - As a user I want to see all the features available so that I can choose which ones I want to interact
- **characters** - As a user I want to see the list of characters, its detailed info, comment on the character and delete the comment (if moderator, I can create and edit a character)
- **categories** - As a user I want to filter characters by a specific category
- **films** - As a user I want to be able to see all the Star Wars movies details
- **series** - As a user I want to be able to see all the Star Wars series details
- **profile** - As a user I want to be able to see my profile details and which character I added as favorite
- **all-user** - As an administrator I want to be able to see a list of all users, its public profile and delete the user.

## Backlog Functionalities

- Add like feature to comments
- Update profile picture
- Add photo carousel to categories
- Keep movies and series updated

## Technologies used

HTML, CSS, Javascript, Node, Express, Handlebars, Sessions & Cookies, Cloudinary and Multer, Bcryptjs, MongooseDB


## Routes
Check the code for all the Routes.

## Models

User model
 
```
username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: String,
    role: {
        type: String,
        enum: ["user", "admin", "moderator"],
        default: "user"
    },
    favoriteCharacter: {
        type: Schema.Types.ObjectId,
        ref: "Character"
    }
```

Character model

```
name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    species: {
        type: String,
        required: true,
        enum: speciesArray
    },
    homeworld: {
        type: String,
        required: true,
        enum: homeworldArray
    },
    age: Number,
    image: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
``` 

Comment model

```
creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    character: {
        type: Schema.Types.ObjectId,
        ref: "Character"
    }
``` 

## Usage

If you want to run these files locally, you can download them, `cd into your project directory`, then run `npm install` to install the dependencies and finally `npm start`.

## Links

## Collaborators

[Pedro Dias](https://github.com/pedromndias)

[Santiago Massa](https://github.com/SJMscript)

### Project

[Repository Link](https://github.com/pedromndias/imperial-archives)

[Deploy Link](https://imperial-archives.adaptable.app/)

### Trello

[Link to trello board](https://trello.com/b/HOmHpT3o/imperial-archives)

### Slides

[Slides Link](www.your-slides-url-here.com)
