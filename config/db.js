// config/db.js
    module.exports = {
		//If app is on heroku then use the production database, else use the development one
        url : process.env.MONGOHQ_URL || 'mongodb://Zinbo:pvg@proximus.modulusmongo.net:27017/jo3jahEh'
    }