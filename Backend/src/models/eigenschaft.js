module.exports = (sequelize, DataTypes) => {
    const Eigenschaft = sequelize.define('Eigenschaft', {
      eigenschaftID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      bezeichnung: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      beschreibung: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'eigenschaft',   
      timestamps: false           
    });
  
    return Eigenschaft;
  };
  