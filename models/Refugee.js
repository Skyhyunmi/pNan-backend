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
    },
    reason: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    torture: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sex: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'Refugee'
  });
};
