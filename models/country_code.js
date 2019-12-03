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
      },
      itu: {
        type: DataTypes.STRING(5),
        unique: true
      },
      iso: {
        type: DataTypes.STRING(5),
        unique: true
      },
      ioc: {
        type: DataTypes.STRING(5),
        unique: true
      },
      it: {
        type: DataTypes.STRING(5),
        unique: true
      },
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