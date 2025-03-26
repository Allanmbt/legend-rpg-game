import React from 'react';
import './Modal.css';
import { useGame } from '../../contexts/GameContext';

const CharacterInfoModal = () => {
    const { state, dispatch } = useGame();
    const { player } = state;

    // 关闭模态窗口
    const handleClose = () => {
        dispatch({ type: 'CLOSE_MODAL' });
    };

    // 计算基础属性和装备加成
    const calculateAttributeDetails = () => {
        // 初始总和等于玩家当前属性
        const total = {
            health: player.maxHealth,
            attack: player.attack,
            defense: player.defense,
            agility: player.agility,
            critChance: player.critChance
        };

        // 计算装备提供的加成
        const equipment = state.equipment;
        const bonus = {
            health: 0,
            attack: 0,
            defense: 0,
            agility: 0,
            critChance: 0
        };

        // 遍历所有装备槽位
        Object.values(equipment).forEach(equip => {
            if (!equip) return; // 如果槽位没有装备

            // 累加装备属性
            Object.entries(equip.attributes).forEach(([key, value]) => {
                switch (key) {
                    case 'HEALTH':
                        bonus.health += value;
                        break;
                    case 'ATTACK':
                        bonus.attack += value;
                        break;
                    case 'DEFENSE':
                        bonus.defense += value;
                        break;
                    case 'AGILITY':
                        bonus.agility += value;
                        break;
                    case 'CRIT_CHANCE':
                        bonus.critChance += value;
                        break;
                    default:
                        break;
                }
            });
        });

        // 计算基础属性（总属性 - 装备加成）
        const base = {
            health: total.health - bonus.health,
            attack: total.attack - bonus.attack,
            defense: total.defense - bonus.defense,
            agility: total.agility - bonus.agility,
            critChance: total.critChance - bonus.critChance
        };

        return { base, bonus, total };
    };

    const attributes = calculateAttributeDetails();

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content character-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>角色信息</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>

                <div className="character-info-container">
                    {/* 角色基本信息 */}
                    <div className="character-basic-info">
                        <div className="character-avatar">😎</div>
                        <div className="character-details">
                            <h3>{player.name}</h3>
                            <div className="character-level">等级: {player.level}</div>
                            <div className="character-exp">
                                经验: {player.experience} / {player.expToNextLevel}
                            </div>
                            <div className="exp-progress-bar">
                                <div
                                    className="exp-progress-fill"
                                    style={{ width: `${(player.experience / player.expToNextLevel) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* 属性详情 */}
                    <div className="character-attributes">
                        <h3>属性详情</h3>

                        <div className="attribute-row">
                            <div className="attribute-label">生命值:</div>
                            <div className="attribute-values">
                                <span className="base-value">{attributes.base.health}</span>
                                {attributes.bonus.health > 0 && (
                                    <span className="bonus-value">+{attributes.bonus.health}</span>
                                )}
                                <span className="total-value">{attributes.total.health}</span>
                            </div>
                        </div>

                        <div className="attribute-row">
                            <div className="attribute-label">攻击力:</div>
                            <div className="attribute-values">
                                <span className="base-value">{attributes.base.attack}</span>
                                {attributes.bonus.attack > 0 && (
                                    <span className="bonus-value">+{attributes.bonus.attack}</span>
                                )}
                                <span className="total-value">{attributes.total.attack}</span>
                            </div>
                        </div>

                        <div className="attribute-row">
                            <div className="attribute-label">防御力:</div>
                            <div className="attribute-values">
                                <span className="base-value">{attributes.base.defense}</span>
                                {attributes.bonus.defense > 0 && (
                                    <span className="bonus-value">+{attributes.bonus.defense}</span>
                                )}
                                <span className="total-value">{attributes.total.defense}</span>
                            </div>
                        </div>

                        <div className="attribute-row">
                            <div className="attribute-label">敏捷度:</div>
                            <div className="attribute-values">
                                <span className="base-value">{attributes.base.agility}</span>
                                {attributes.bonus.agility > 0 && (
                                    <span className="bonus-value">+{attributes.bonus.agility}</span>
                                )}
                                <span className="total-value">{attributes.total.agility}</span>
                            </div>
                        </div>

                        <div className="attribute-row">
                            <div className="attribute-label">暴击率:</div>
                            <div className="attribute-values">
                                <span className="base-value">{(attributes.base.critChance * 100).toFixed(1)}%</span>
                                {attributes.bonus.critChance > 0 && (
                                    <span className="bonus-value">+{(attributes.bonus.critChance * 100).toFixed(1)}%</span>
                                )}
                                <span className="total-value">{(attributes.total.critChance * 100).toFixed(1)}%</span>
                            </div>
                        </div>

                        <div className="attribute-row">
                            <div className="attribute-label">暴击伤害:</div>
                            <div className="attribute-values">
                                <span className="total-value">{(player.critMultiplier * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* 属性说明 */}
                    <div className="attributes-description">
                        <h3>属性说明</h3>
                        <ul>
                            <li><strong>生命值</strong>: 决定角色可以承受的伤害量</li>
                            <li><strong>攻击力</strong>: 影响角色造成的伤害</li>
                            <li><strong>防御力</strong>: 减少受到的伤害</li>
                            <li><strong>敏捷度</strong>: 影响闪避和命中率</li>
                            <li><strong>暴击率</strong>: 攻击造成暴击的几率</li>
                            <li><strong>暴击伤害</strong>: 暴击时伤害的倍率</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterInfoModal;