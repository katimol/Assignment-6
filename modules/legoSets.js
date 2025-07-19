/********************************************************************************
* WEB700 – Assignment 4
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Kulsum Timol Student ID: 112867247 Date: 2025/07/06

*URL : https://assignment-5-sage-seven.vercel.app/

*
********************************************************************************/

/// Import the JSON data files
const setData = require('../Data/setData.json');
const themeData = require('../Data/themeData.json');

// Define the LegoData class
class LegoData {
    constructor() {
        // Initializes the sets array to store LEGO set objects
        this.sets = [];
        this.themes = []; // Added this line to store themes
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

                this.themes = [...themeData]; // Added this line to load themes
                resolve(); // Data loaded successfully   
            } catch (err) {
                reject("Unable to initialize data: " + err); // Handle any errors
            }
        });
    }

    // Returns all LEGO sets
    getAllSets() {
        return new Promise((resolve, reject) => {
            if (this.sets.length > 0) {
                resolve(this.sets); // Return all sets
            } else {
                reject("No sets available"); // Handle empty case
            }
        });
    }

    // Returns a set matching the set_num
    getSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            const found = this.sets.find(set => set.set_num === setNum);
            if (found) {
                resolve(found); // Return the matching set
            } else {
                reject(`Unable to find set with set_num: ${setNum}`); // If not found
            }
        });
    }

    // Returns sets that match a partial theme name (case-insensitive)
    getSetsByTheme(theme) {
        return new Promise((resolve, reject) => {
            const themeLower = theme.toLowerCase(); // Convert search term to lowercase
            const foundSets = this.sets.filter(set => set.theme.toLowerCase().includes(themeLower));
            if (foundSets.length > 0) {
                resolve(foundSets); // Return matching sets
            } else {
                reject(`Unable to find sets with theme: ${theme}`); // If none found
            }
        });
    }

    // Adds a new set if it doesn't already exist
    addSet(newSet) {
        return new Promise((resolve, reject) => {
            // Check for duplicate set_num
            const exists = this.sets.find(set => set.set_num === newSet.set_num);
        
            if (exists) {
                reject("Set already exists"); // Duplicate found
            } else {
                this.sets.push(newSet); // Add new set to the array
                resolve(); // Resolve with no value
            }
        });
    }

    // Get all themes
    getAllThemes() {
        return new Promise((resolve, reject) => {
            if (this.themes.length > 0) {
                resolve(this.themes); // Return all themes
            } else {
                reject("No themes available"); // Handle empty case
            }
        });
    }

    // Get theme by ID
    getThemeById(id) {
        return new Promise((resolve, reject) => {
            const theme = this.themes.find(t => t.id == id);
            if (theme) {
                resolve(theme); // Return the matching theme
            } else {
                reject("Unable to find requested theme"); // If not found
            }
        });
    }

    // Deletes a set by its set_num
    deleteSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            const index = this.sets.findIndex(set => set.set_num === setNum);
            if (index >= 0) {
                this.sets.splice(index, 1); // Remove set from array
                resolve(); // Resolve successfully
            } else {
                reject("Set not found"); // Handle case where set isn't found
            }
        });
    }
}

module.exports = LegoData;
