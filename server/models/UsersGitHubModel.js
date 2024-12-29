import { DataTypes, Sequelize } from "sequelize";

import sequelize from "../db/db.js";

const UsersGitHub = sequelize.define(
  "UsersGitHub",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    display_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    access_token: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },

    refresh_token: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "users_github",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default UsersGitHub;