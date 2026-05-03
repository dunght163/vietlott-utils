'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('keno_draws', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      draw_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      drawn_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      numbers: {
        type: Sequelize.ARRAY(Sequelize.SMALLINT),
        allowNull: false,
      },
      even_count: { type: Sequelize.SMALLINT, allowNull: false },
      odd_count: { type: Sequelize.SMALLINT, allowNull: false },
      big_count: { type: Sequelize.SMALLINT, allowNull: false },
      small_count: { type: Sequelize.SMALLINT, allowNull: false },
      even_odd_badge: { type: Sequelize.STRING(8), allowNull: false },
      big_small_badge: { type: Sequelize.STRING(8), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
    });

    await queryInterface.addIndex('keno_draws', {
      fields: [{ name: 'drawn_at', order: 'DESC' }],
      name: 'keno_draws_drawn_at_desc_idx',
    });
    await queryInterface.addIndex('keno_draws', {
      fields: [{ name: 'draw_number', order: 'DESC' }],
      name: 'keno_draws_draw_number_desc_idx',
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE keno_draws
        ADD CONSTRAINT keno_draws_numbers_len_chk CHECK (array_length(numbers, 1) = 20),
        ADD CONSTRAINT keno_draws_even_count_chk CHECK (even_count BETWEEN 0 AND 20),
        ADD CONSTRAINT keno_draws_odd_count_chk CHECK (odd_count BETWEEN 0 AND 20),
        ADD CONSTRAINT keno_draws_big_count_chk CHECK (big_count BETWEEN 0 AND 20),
        ADD CONSTRAINT keno_draws_small_count_chk CHECK (small_count BETWEEN 0 AND 20),
        ADD CONSTRAINT keno_draws_even_odd_badge_chk CHECK (even_odd_badge IN ('chan','le','hoacl')),
        ADD CONSTRAINT keno_draws_big_small_badge_chk CHECK (big_small_badge IN ('lon','be','hoalb'));
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('keno_draws');
  },
};
