module.exports = (sequelize, DataTypes) => {
  const Pflanze = sequelize.define('pflanze', {
    pflanzenID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:       { type: DataTypes.STRING(100), allowNull: false },
    wissenschaftlicherName: DataTypes.STRING(150),
    eigenschaftID: DataTypes.INTEGER,
  }, {
    tableName: 'pflanze',
    timestamps: false
  });
  return Pflanze;
};

  