const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Explorer', {
    idexplorer: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    badge: DataTypes.STRING,
    numOfPosts: DataTypes.STRING,
    numOfVisits: DataTypes.STRING,
    coins: DataTypes.STRING,
    mobileNum: DataTypes.STRING,
    numOfReviews: DataTypes.STRING,
    long: DataTypes.DECIMAL,
    latt: DataTypes.DECIMAL
  });
};
