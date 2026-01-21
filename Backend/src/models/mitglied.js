module.exports = (sequelize, DataTypes) => {
  const Mitglied = sequelize.define('Mitglied', {
    benutzerID:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vorname:      { type: DataTypes.STRING(100), allowNull: false },
    nachname:     { type: DataTypes.STRING(100), allowNull: false },
    email:        { type: DataTypes.STRING(100), unique: true, allowNull: false },
    passwortHash: { type: DataTypes.STRING, allowNull: false },   
    isAdmin:      { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'mitglied',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return Mitglied;
};
