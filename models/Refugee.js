/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Refugee', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    birth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sex: {
      type: DataTypes.STRING(45)
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    nationality: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'Refugee'
  });
};
