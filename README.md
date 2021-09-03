# Midnight
A Discord Security Bot that prevents Scam links to be posted

## Description

Discord Scams get more and more popular, but with this bot you are most likely on the best way in preventing people to send links to scammy websites.

## Getting Started

### Dependencies

* NodeJS V 16.6 or higher

### Installing

* Download or Clone this repository
* open in your prefered editor
* Install all packages using ```npm i```
* While Installing, setup a Database, (Tested with MariaDB and HeidiSQL):
- 1. Column: ```id``` (VARCHAR)
- 2. Column: ```infractions``` (INT)
* in your project go to the file called ```.env``` and insert your variables:


| Variable        | Description           |
| ------------- |:-------------:|
| TOKEN      | Your Discord Bots Token |
| DB_HOST      | The Database Host IP Adress |
| DB_PORT      | Database Port (Default 3306) |
| DB_USER      | The user you login to your Database with |
| DB_PASSWORD      | Database Password |
| DB_DATABASE      | Database name |
| DB_DATABASENAME      | The table name |



### Executing program

* be sure you are using Node.js V16.6 or higher! (Run ```node -v``` to see the version)
* Run in Terminal:
```
npm run dev
```


## Authors

Sebi

## License

This project is licensed under the Apache 2.0 License - see the LICENSE.md file for details

## Acknowledgments

* This bot uses Sebis [Discord.JS V13.x Bot Template](https://github.com/Dev-Sebi/discord-bot-template-v13)
* This bot uses **part** of [Vortex's bad Links list](https://github.com/jagrosh/Vortex/blob/master/lists/referral_domains.txt)
