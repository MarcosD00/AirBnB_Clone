'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {

      Review.hasMany(
        models.ReviewImage,{ 
        foreignKey: 'reviewId',
        onDelete:'CASCADE'
      });

      Review.belongsTo(models.Spot,{ 
        foreignKey: 'spotId',
      });

      Review.belongsTo(models.User,{
         foreignKey: 'userId',
        });

    }
  }
  Review.init({
    spotId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    stars:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validator: {
        len: [1,5]
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Review;
}; 