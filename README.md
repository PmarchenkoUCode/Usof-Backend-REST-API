<div id="header" align="center">
  <img src="https://media.giphy.com/media/M9gbBd9nbDrOTu1Mqx/giphy.gif" width="100"/>
</div>

<div id="badges" align="center">
  <a href="https://www.linkedin.com/in/%D0%BF%D0%B0%D0%B2%D0%B5%D0%BB-%D0%BC%D0%B0%D1%80%D1%87%D0%B5%D0%BD%D0%BA%D0%BE-74b98a224/">
    <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
  </a>
  <a href="https://www.instagram.com/muilco/">
    <img src="https://img.shields.io/badge/Instagram-yellow?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram Badge"/>
  </a>
</div>

![](https://visitor-badge.glitch.me/badge?page_id=pmarchenkoucode.usof-backend-rest-api)


# Usof-Backend-REST-API
StackOverflow REST API Clone

---

### :hammer_and_wrench: Languages and Tools :

<div>
  <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" alt="JS" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original-wordmark.svg" alt="NodeJS" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/mysql/mysql-original-wordmark.svg" alt="MySQL" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/mocha/mocha-plain.svg" alt="Mocha" width="40" height="40"/>&nbsp;
</div>

### ROUTERS :
  #### Authentication module:
    - POST - /api/auth/register - registration of a new user, required parameters are[login, password, password confirmation, email]
    - POST - /api/auth/login- log in user, required parameters are [login, email,password]. Only users with a confirmed email can sign in
    - POST - /api/auth/logout- log out authorized user
    - POST - /api/auth/password-reset- send a reset link to user email, requiredparameter is [email]
    - POST - /api/auth/password-reset/<confirm_token>- confirm new password with atoken from email, required parameter is a [new password]
    
   #### User module:
    - GET - /api/users- get all users
    - GET - /api/users/<user_id>- get specified user data
    - POST - /api/users- create a new user, required parameters are [login, password,password confirmation, email, role]. This feature must be accessible only foradmins
    - PATCH - /api/users/avatar- upload user avatar
    - PATCH - /api/users/<user_id>- update user data
    - DELETE - /api/users/<user_id>- delete user
    
   #### Post module:
    - `GET - /api/posts` - get all posts.This endpoint doesn't require any role, it ispublic. 
    If there are too many posts, you must implement pagination. Page size isup to you
    
