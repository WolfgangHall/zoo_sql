var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zoo_db'
});

connection.connect();


var prompt = require('prompt');

prompt.start();

prompt.message = ("");

var zoo = {
    welcome: function () {
        console.log("Welcome to the Zoo and Friends App~!");
    },
    menu: function () {
        console.log("Enter (A): ------> to Add a new animal to the Zoo!");
        console.log("Enter (U): ------> to Update info on an animal in the Zoo!");
        console.log("Enter (V): ------> to Visit the animals in the Zoo!");
        console.log("Enter (D): ------> to Adopt an animal from the Zoo!");
        console.log("Enter (Q): ------> to Quit and exit the Zoo!");
    },
    add: function (input_scope) {
        var currentScope = input_scope;
        console.log("To add an animal to the zoo please fill out the following form for us!");
        prompt.get(['name', 'type', 'age'], function (err, result) {
            connection.query ('INSERT INTO animals (name, type, age) VALUES (?,?,?)', [result.name, result.type, result.age]), function (err, result){
                if (err) throw err;
                console.log("animal added");
                currentScope.menu();
                currentScope.promptUser();
            }
        });
    },
    visit: function () {
        console.log("Enter (I): ------> do you know the animal by it's id? We will visit that animal!");
        console.log("Enter (N): ------> do you know the animal by it's name? We will visit that animal!");
        console.log("Enter (A): ------> here's the count for all animals in all locations!");
        console.log("Enter (C): ------> here's the count for all animals in this one city!");
        console.log("Enter (O): ------> here's the count for all the animals in all locations by the type you specified!");
        console.log("Enter (Q): ------> Quits to the main menu!");

        currentScope.menu();
        currentScope.promptUser();
    },
    type: function (input_scope) {
        var currentScope = input_scope;
        console.log("Enter animal type to find how many animals we have of those type.");
        prompt.get(['animal_type'], function (err, result) {
            connection.query("SELECT COUNT (*) FROM animals WHERE type LIKE '%result.animal_type'");
            currentScope.menu();
            currentScope.promptUser();
        });
    },
    care: function (input_scope) {
        var currentScope = input_scope;
        console.log("Enter city name NY/SF");
        prompt.get(['city_name'], function (err, result){
            connection.query("SELECT COUNT (*) FROM caretakers WHERE city LIKE '%result.city_name'");
            currentScope.visit();
            currentScope.view(currentScope);
        });
    },
    animId: function (input_scope) {
        var currentScope = input_scope;
        console.log("Enter ID of the animal you want to visit");
        prompt.get(['animal_id'], function (err, result){
            connection.query("SELECT name, type, age FROM animals where id = result.animal_id;");
            currentScope.visit();
            currentScope.view(currentScope);
        });
    },
    animName: function (input_scope) {
        var currentScope = input_scope;
        console.log("Enter Name of the animal you want to visit");
        prompt.get(['animal_name'], function (err, result){
            connection.query("SELECT type, age, id FROM animals where name = result.animal_name;");
            currentScope.visit();
            currentScope.view(currentScope);
        });
    },
    all: function (input_scope) {
        var currentScope = input_scope;
        console.log("Enter all to find how many animals we have.");
        prompt.get(['animal_all'], function (err, result) {
            connection.query("SELECT COUNT (*) from animals;");
            currentScope.menu();
            currentScope.promptUser();
        });
    },
    update: function (input_scope) {
        var currentScope = input_scope;
        prompt.get(['id', 'new_name', 'new_age', 'new_type', 'new_caretaker_id']), function (err, result) {
            connection.query("INSERT INTO animals (id, name, age, type, caretaker_id) VALUES (?,?,?,?,?)", [result.id, result.new_name, result.new_age, result.type, result.new_caretaker_id], function (err, result) {
                if (err) throw err;

                console.log("new animal added");
                currentScope.menu();
                currentScope.promptUser();
            });
        }

    },
    adopt: function () {
        var currentScope = input_scope;
        prompt.get(['animal_id']), function (err, result) {
            connection.query("DELETE from animals WHERE id = result.animal_id;"), function (err, result) {
                if (err) throw err;

                console.log("Animal removed from zoo and adopted");
            }
        }
    },
    promptUser: function () {
        var self = this;
        prompt.get(['input']), function (err, result) {
            if (result.input == "Q") {
                self.exit();
            } else if (result.input == "A") {
                self.add(self);
            } else if (result.input == "V") {
                self.view(self);
            } else if (result.input == "D") {
                self.adopt(self);
            } else {
                console.log("Sorry, didn\'t get that come again?");
            }
        }
    },
    exit: function () {
        console.log("Thank you for visiting us, good bye!~");
        process.exit();
    },
    open: function () {
        this.welcome();
        this.menu();
        this.promptUser();
    }
}
connection.end();
zoo.open();

