module.exports = (sequelize, DataTypes) => {
    const Pflanzenbestand = sequelize.define('Pflanzenbestand', {
      bestandID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      pflanzenID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'pflanze', key: 'pflanzenID' }
      },
      benutzerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'mitglied', key: 'benutzerID' }
      },
      standortID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'standort', key: 'standortID' }
      },
      jahr: {
        type: DataTypes.INTEGER,     
        allowNull: false,
        validate: { min: 1900, max: 3000 }
      },
      pflegehinweis: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      pflanzdatum: {
             type        : DataTypes.DATE,
      allowNull   : true,
      defaultValue: DataTypes.NOW 
      },
      erntedatum: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    }, {
      tableName: 'pflanzenbestand',
      timestamps: true
    });
  
    return Pflanzenbestand;
  };
  