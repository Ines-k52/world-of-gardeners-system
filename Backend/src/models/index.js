const sequelize   = require('../config/db');
const DataTypes   = require('sequelize').DataTypes;


const Mitglied         = require('./mitglied')(sequelize, DataTypes);
const Pflanze          = require('./pflanze')(sequelize, DataTypes);
const Eigenschaft      = require('./eigenschaft')(sequelize, DataTypes);
const Standort         = require('./standort')(sequelize, DataTypes);
const Pflanzenbestand  = require('./pflanzenbestand')(sequelize, DataTypes);
const Datenquelle      = require('./datenquellen')(sequelize, DataTypes);

Pflanzenbestand.belongsTo(Pflanze,   { foreignKey: 'pflanzenID', onDelete: 'CASCADE' });
Pflanzenbestand.belongsTo(Mitglied,  { foreignKey: 'benutzerID', onDelete: 'CASCADE' });
Pflanzenbestand.belongsTo(Standort,  { foreignKey: 'standortID', onDelete: 'CASCADE' });
Pflanze.hasMany(Pflanzenbestand,     { foreignKey: 'pflanzenID' });
Mitglied.hasMany(Pflanzenbestand,    { foreignKey: 'benutzerID' });
Standort.hasMany(Pflanzenbestand,    { foreignKey: 'standortID' });

Pflanze.belongsTo(Eigenschaft, { foreignKey: 'eigenschaftID', onDelete: 'SET NULL' });
Pflanze.belongsTo(Datenquelle, { foreignKey: 'datenquelleID', onDelete: 'SET NULL' });
Eigenschaft.hasMany(Pflanze,   { foreignKey: 'eigenschaftID' });
Datenquelle.hasMany(Pflanze,   { foreignKey: 'datenquelleID' });

Mitglied.hasMany(Standort,   { foreignKey: 'benutzerID' });
Standort.belongsTo(Mitglied, { foreignKey: 'benutzerID' });

module.exports = {
  sequelize,
  Mitglied,
  Pflanze,
  Eigenschaft,
  Standort,
  Pflanzenbestand,
  Datenquelle
};
