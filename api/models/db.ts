import { Sequelize, ModelCtor, Model } from 'sequelize';
// import { User, Transaction, Payment, USER_has_PAYMENT } from './schema';
import schema from './schema';

interface ModelType {
  User: ModelCtor<Model<any, any>>;
  Transaction: ModelCtor<Model<any, any>>;
  Payment: ModelCtor<Model<any, any>>;
  USER_has_PAYMENT: ModelCtor<Model<any, any>>;
}

const DB_NAME = process.env.DB_NAME || '';
const DB_HOST = process.env.DB_HOST || '';
const DB_USER = process.env.DB_USER || '';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
});

export const db: ModelType = {
  User: schema(sequelize).User,
  Transaction: schema(sequelize).Transaction,
  Payment: schema(sequelize).Payment,
  USER_has_PAYMENT: schema(sequelize).USER_has_PAYMENT,
};

export default sequelize;
