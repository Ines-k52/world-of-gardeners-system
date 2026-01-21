module.exports = (sequelize, DataTypes) => {

  const Datenquelle = sequelize.define('Datenquelle', {
    datenquelleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quellenname: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    zugriffstyp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    datenformat: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'externeDatenQuelle',
    timestamps: false                
  });

  return Datenquelle;
};
