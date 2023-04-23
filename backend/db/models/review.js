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
        onDelete: "CASCADE"
      });

      Review.belongsTo(models.User,{
         foreignKey: 'userId',
         onDelete: "CASCADE"
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
    }
  }, {
    sequelize,
    modelName: 'Review',
    defaultScope: {
      attributes: {
        exclude: ["userId", "createdAt", "updatedAt"]
      }
    }
  });
  return Review;
}; 