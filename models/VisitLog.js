/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('VisitLog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    refugee_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Refugee',
        key: 'id'
      }
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
    support: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'VisitLog'
  });
};
