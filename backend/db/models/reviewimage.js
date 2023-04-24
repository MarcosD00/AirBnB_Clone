'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  
  class ReviewImage extends Model {

    static associate(models) {

      ReviewImage.belongsTo(models.Review,{
        foreignKey: 'reviewId',
      });
    }
  }
  ReviewImage.init({
    reviewId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};