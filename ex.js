/********************************************************************************
* WEB700 – Assignment 2
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Kulsum Timol Student ID: 112867247 Date: 2025/05/29
*
********************************************************************************/

// Import the JSON data files
const setData = require('./data/setData.json');
const themeData = require('./data/themeData.json');

// Define the LegoData class
class LegoData {
    constructor() {
        // Initializes the sets array to store LEGO set objects
        this.sets = [];
    }

    // Loads and merges data from setData and themeData
    initialize() {
        return new Promise((resolve, reject) => {
            try {
                // Create a new array by mapping over each set in setData
                this.sets = setData.map((set) => {
                    // Find the matching theme name using theme_id
                    const theme = themeData.find(t => t.id === set.theme_id);
                    // Return a new object with the theme name added
                    return {
                        ...set,// Spread existing properties
                        theme: theme ? theme.name : "Unknown"// Add theme name
                    };
                });
                resolve();// Data loaded successfully   
            } catch (err) {
                reject("Unable to initialize data: " + err);// Handle any errors
            }
        });
    }

    // Returns all LEGO sets
    getAllSets() {
        return new Promise((resolve, reject) => {
            if (this.sets.length > 0) {
                resolve(this.sets);// Return all sets
            } else {
                reject("No sets available");// Handle empty case

            }
        });
    }

    // Returns a set matching the set_num
    getSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            const found = this.sets.find(set => set.set_num === setNum);
            if (found) {
                resolve(found);// Return the matching set
            } else {
                reject(`Unable to find set with set_num: ${setNum}`);// If not found
            }
        });
    }

    // Returns sets that match a partial theme name (case-insensitive)
    getSetsByTheme(theme) {
        return new Promise((resolve, reject) => {
            const themeLower = theme.toLowerCase();// Convert search term to lowercase
            const foundSets = this.sets.filter(set => set.theme.toLowerCase().includes(themeLower));
            if (foundSets.length > 0) {
                resolve(foundSets);// Return matching sets
            } else {
                reject(`Unable to find sets with theme: ${theme}`);// If none found
            }
        });
    }
}

// Test Code

// Creates an instance of the LegoData class
let data = new LegoData();

// Step-by-step promise chain to test all methods
data.initialize()
    .then(() => data.getAllSets())
    .then((allSets) => {
        console.log(`Number of Sets: ${allSets.length}`);
        // Print details of a specific set by set_num
        return data.getSetByNum("0012-1");
    })
    .then((set) => {
        console.log(set);
        // Print number of sets that match theme "tech"
        return data.getSetsByTheme("tech");
    })
    .then((sets) => {
        console.log(`Number of 'tech' sets: ${sets.length}`);
    })
    .catch((err) => {
        // Handles any error in the promise chain
        console.log(err);
    });
