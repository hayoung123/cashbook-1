import { Sequelize, DataTypes, ModelCtor, Model } from 'sequelize';
import { categories } from 'configs/constants';

interface ModelType {
  User: ModelCtor<Model<any, any>>;
  Transaction: ModelCtor<Model<any, any>>;
  Payment: ModelCtor<Model<any, any>>;
  USER_has_PAYMENT: ModelCtor<Model<any, any>>;
}

const schema = (sequelize: Sequelize): ModelType => {
  const User = sequelize.define('USER', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING(90),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.TEXT,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    is_OAuth: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });

  const Transaction = sequelize.define('TRANSACTION', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        isIn: [categories],
      },
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    payment: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  });

  const Payment = sequelize.define('PAYMENT', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
  });

  const USER_has_PAYMENT = sequelize.define('USER_has_PAYMENT', {}, { timestamps: false });

  // Associations
  User.hasMany(Transaction, { onDelete: 'CASCADE' });
  Payment.belongsToMany(User, { through: USER_has_PAYMENT });
  User.belongsToMany(Payment, { through: USER_has_PAYMENT });

  return {
    User,
    Transaction,
    Payment,
    USER_has_PAYMENT,
  };
};

export default schema;
