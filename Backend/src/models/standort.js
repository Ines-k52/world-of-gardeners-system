module.exports = (sequelize, DataTypes) => {
  const Standort = sequelize.define('Standort', {
    standortID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bezeichnung: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    beschreibung: {
      type: DataTypes.TEXT
    },
    benutzerID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'standort',
    timestamps: false
  });

  return Standort;
};
