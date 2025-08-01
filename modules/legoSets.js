/********************************************************************************
*  WEB700 – Assignment 06
* *  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* *  Name: Kulsum Timol Student ID: 112867247 Date: 2025/07/31
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/

require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

class LegoData {
  constructor() {
    this.sequelize = new Sequelize(
      process.env.PGDATABASE,
      process.env.PGUSER,
      process.env.PGPASSWORD,
      {
        host: process.env.PGHOST,
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      }
    );

    this.Theme = this.sequelize.define('Theme', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING
    }, { timestamps: false });

    this.Set = this.sequelize.define('Set', {
      set_num: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      name: Sequelize.STRING,
      year: Sequelize.INTEGER,
      num_parts: Sequelize.INTEGER,
      theme_id: Sequelize.INTEGER,
      img_url: Sequelize.STRING
    }, { timestamps: false });

    this.Set.belongsTo(this.Theme, { foreignKey: 'theme_id' });
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.sequelize.sync()
        .then(() => {
          this.Theme.count().then(themeCount => {
            if (themeCount === 0) {
              const setData = require('../Data/setData.json');
              const themeData = require('../Data/themeData.json');

              this.sequelize.sync({ force: true }).then(async () => {
                await this.Theme.bulkCreate(themeData);
                await this.Set.bulkCreate(setData);
                console.log("Data inserted successfully");
                resolve();
              }).catch(err => {
                reject("Unable to sync the database.");
              });
            } else {
              resolve();
            }
          }).catch(err => {
            reject("Unable to sync the database.");
          });
        })
        .catch(err => reject(err));
    });
  }

  getAllSets() {
    return this.Set.findAll({ include: [this.Theme], raw: true, nest: true });
  }

  getSetByNum(setNum) {
    return this.Set.findAll({
      include: [this.Theme],
      where: { set_num: setNum },
      raw: true,
      nest: true
    }).then(data => {
      if (data.length > 0) return data[0];
      else throw new Error("Unable to find requested set");
    });
  }

  getSetsByTheme(theme) {
    const Op = Sequelize.Op;
    return this.Set.findAll({
      include: [this.Theme],
      where: {
        '$Theme.name$': {
          [Op.iLike]: `%${theme}%`
        }
      },
      raw: true,
      nest: true
    }).then(data => {
      if (data.length > 0) return data;
      else throw new Error("Unable to find requested sets");
    });
  }

  addSet(newSet) {
    return this.Set.create(newSet)
      .then(() => {})
      .catch(err => {
        // Corrected error handling: check if err.errors exists before trying to access it
        const errorMessage = err.errors && err.errors.length > 0
          ? err.errors[0].message
          : err.message || "An unknown error occurred during set creation.";
        throw new Error(errorMessage);
      });
  }

  getAllThemes() {
    return this.Theme.findAll({ raw: true });
  }

  deleteSetByNum(setNum) {
    return this.Set.destroy({
      where: { set_num: setNum }
    }).then(numDeleted => {
      if (numDeleted > 0) {
        return Promise.resolve();
      } else {
        return Promise.reject("Set not found or could not be deleted.");
      }
    }).catch(err => {
      throw new Error(err.message || "An unknown database error occurred.");
    });
  }
}

module.exports = LegoData;
