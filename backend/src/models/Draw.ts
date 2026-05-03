import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import { sequelize } from '../config/database.js';

export type EvenOddBadge = 'chan' | 'le' | 'hoacl';
export type BigSmallBadge = 'lon' | 'be' | 'hoalb';

export class Draw extends Model<InferAttributes<Draw>, InferCreationAttributes<Draw>> {
  declare id: CreationOptional<number>;
  declare drawNumber: number;
  declare drawnAt: Date;
  declare numbers: number[];
  declare evenCount: number;
  declare oddCount: number;
  declare bigCount: number;
  declare smallCount: number;
  declare evenOddBadge: EvenOddBadge;
  declare bigSmallBadge: BigSmallBadge;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Draw.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    drawNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'draw_number',
    },
    drawnAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'drawn_at',
    },
    numbers: {
      type: DataTypes.ARRAY(DataTypes.SMALLINT),
      allowNull: false,
      validate: {
        len: [20, 20],
      },
    },
    evenCount: { type: DataTypes.SMALLINT, allowNull: false, field: 'even_count' },
    oddCount: { type: DataTypes.SMALLINT, allowNull: false, field: 'odd_count' },
    bigCount: { type: DataTypes.SMALLINT, allowNull: false, field: 'big_count' },
    smallCount: { type: DataTypes.SMALLINT, allowNull: false, field: 'small_count' },
    evenOddBadge: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: 'even_odd_badge',
    },
    bigSmallBadge: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: 'big_small_badge',
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  },
  {
    sequelize,
    tableName: 'keno_draws',
    modelName: 'Draw',
    indexes: [
      { fields: [{ name: 'drawn_at', order: 'DESC' }] },
      { fields: [{ name: 'draw_number', order: 'DESC' }] },
    ],
  }
);
