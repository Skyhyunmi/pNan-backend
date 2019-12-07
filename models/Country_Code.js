/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Country_Code', {
    name_eng: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    name_kor: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'Country_Code'
  });
};
