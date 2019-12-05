/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Country_Code', {
    name_eng: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    name_kor: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      unique: true
    }
  }, {
    tableName: 'Country_Code'
  });
};

/*
    User Id,
    Password
    e-mail
    name

    */