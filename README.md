# ADP

## Requirements
* nodejs environment and npm
* active internet connection for mongodb
* please ensure you are not using institute proxy as mongodb atlas will not connect

## Start the server locally
* In terminal, go to "ADP" folder and type the following commands in order
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





