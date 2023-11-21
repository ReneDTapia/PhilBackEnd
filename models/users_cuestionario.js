module.exports = (sequelize, DataTypes) => {
    const UsersCuestionario = sequelize.define('Users_Cuestionario', {
      Users_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      Cuestionario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'Users_Cuestionario',
      timestamps: false,
    });
  
    return UsersCuestionario;
  };