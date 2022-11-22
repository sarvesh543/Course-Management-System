# Course Management System

## Requirements
* nodejs environment and npm
* active internet connection for mongodb atlas
* please ensure you are not using institute proxy as mongodb atlas will not connect
### To use local mongodb
* replace "MONGO_URL" in "/Group20_ADP_Project/.env" file 

## Start the server locally
* In terminal, go to "/Group20_ADP_Project" folder and type the following commands in order
```
npm run build
npm start
```
* The website should now be running on http://localhost

## Note
* To start course registration, admin has to use the following link
```http://localhost/api/admin/startAddDrop?password=password```
* To close course registration, admin has to use the following link
```http://localhost/api/admin/closeAddDrop?password=password```
* The course registration will automatically close in 15 min if not closed manually.

## Created By
* B21193 - Sarvesh Jadhav
* B21163 - Samvaidan Salgotra
* B21183 - Ayush Gaurav
* B21201 - Mannat Mahajan
* B21204 - Mayank Mehta
* B21200 - Manik Aggarwal


