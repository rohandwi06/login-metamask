'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  
  User.init({
    address: {type : DataTypes.STRING, allowNull : false, unique: true},
    nonce: {type : DataTypes.INTEGER, allowNull : false},
    role: {type : DataTypes.ENUM('user', 'admin')},
    createdAt: { allowNull: false, type: DataTypes.DATE },
    updatedAt: { allowNull: false, type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};