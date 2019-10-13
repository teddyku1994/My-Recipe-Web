# My Recipe

My Recipe aims to be more than an regular receipe searching website, but a website with tools to provide more insight on the ingredients used for cooking a dish.
<br>
Website URL: https://bookncode.com

## Table of Contents

- [Technologies](#Technologies)
- [Architecture](#Architecture)
- [Database Schema](#Database-Schema)
- [Main Features](#Main-Features)
- [Features Demo](#Features-Demo)
  - [Home Page](#Home-Page)
  - [Recipe Search](#Recipe-Search)
  - [Nutrient Level Search](#Nutrient-Level-Search)
  - [Vegetable and Fruit Price Search](#Vegetable-and-Fruit-Price-Search)
  - [User Recipes Management](#User-Recipes-Management)
  - [User Basic Functions](#User-Basic-Functions)
- [Contact](#Contact)

## Technologies

#### Backend
- Node.js / Express.js
- Web Crawler (cheerio)
- JWT Auth.
- CI / CD (Jenkins)
- SSL Certificate (Let's Encrypt)
- Error Handling: Identify type of error and return error message to frontend with corresponding status

#### Front-End
- HTML
- CSS
- JavaScript
- AJAX

#### Database
 - MySQL
 - Redis (Cache)

#### Cloud Service (AWS)
- EC2
- S3
- CloudFront

#### Networking
- HTTP & HTTPS
- Domain Name System(DNS)
- NGINX

#### Test
- Unit Test: Jest
- Load Test: Artillery

#### Additional
- Facebook Login API
- MVC design pattern
- Git / GitHub

## Architecture 

<p align="center">
 <img src="https://i.imgur.com/v1YoD8u.png" width="800">
</p>

- NGINX redirects 443 port requests from clients to corresponding ports
- Result searching process:
    - Search Redis (cache) for matching result and return the result if found
    - **If no** matching result search MySQL DB for result and return result if found
    - **If no** matching result in MySQL DB, the app will trigger web crawling and return the found result after storing it into the database.

## Database Schema

<p align="center">
 <img src="https://i.imgur.com/Homs37X.png" width="800">
</p>

## Main Features
- Recipe Search
    - Search using dish names
    - Search by inputing ingredients you have
- Nutrient Level Search
    - Renders up to 10 most relevant food and provide nutrient level for each upon search
- Vegetable & Fruit Price Search
    - Return weekly wholesale & retail price from crawler
    - Users can trace food price will be updated automatically weekly
- Member System
    - Supports Facebook Login
    - Upload / Update / Delete Recipes

## Features Demo

### Home Page

<p align="center">
 <img src="https://media.giphy.com/media/WO5X5r76TLs1iyRbxO/giphy.gif" width="800">
</p>

- Popular recipes are stored in cache (TTL 6hrs) and updated periodically through fetching most liked recipes from databse
- Quick search function using dish name

---

### Recipe Search 

<p align="center">
 <img src="https://media.giphy.com/media/QAVQIyXGRBZN4noIFY/giphy.gif" width="800">
</p>

- Refer to [Architecture](#Architecture) for Dish Name Search & Ingredients Search process
- Database will grow as more users search for different dishes
- Hot Keywords are rendered by selecting the top 6 most searched keywords recorded in database

---

### Nutrient Level Search

<p align="center">
 <img src="https://media.giphy.com/media/KgEetveyiHnFbquKMo/giphy.gif" width="800">
</p>

- Select 10 most relevant result from 2000+ data and renders nutrient detail on click

---

### Vegetable and Fruit Price Search

<p align="center">
 <img src="https://media.giphy.com/media/XEDaZIAA61zZzEOrZC/giphy.gif" width="800">
</p>

- Member only function
- Upon search the application will crawl for wholesale, retail price and relevent result of the searched item and store in Redis
- Users can choose to add items into trace list and the application will update and compare the prices weekly
- Update schedules are achieved thorugh utilizing node-schedule module
- This function uses Redis as database, because information are regularly updated (optimize efficiency)

---

### User Recipes Management

<p align="center">
 <img src="https://media.giphy.com/media/S598OCviyC38Ppi3W7/giphy.gif" width="800">
</p>

- Users can upload / update and delete recipes through profile
- Images of recipes are uploaded to AWS S3 and read through AWS CloudFront to optimise load speed

---

### User Basic Functions

- Users can add recipe to their favorite and manage favorites in their profile
- Users can also like recipes which is then used to render popular recipes
- Profile page also allow users to change basic information and password

## Contact

#### Email:  teddyku1994@gmail.com
