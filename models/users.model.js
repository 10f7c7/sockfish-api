const { Sequelize, DataTypes } = require('sequelize');

const User = Sequelize.define('User', {
    // Model attributes are defined here
    id: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
  });
  
  // `sequelize.define` also returns the model
  console.log(User === Sequelize.models.User); // true