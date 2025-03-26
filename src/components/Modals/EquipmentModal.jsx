import React from 'react';
import './Modal.css';
import { useGame } from '../../contexts/GameContext';

const EquipmentModal = () => {
    const { state, dispatch, equipmentTypes } = useGame();
    const { equipment } = state;

    // 关闭模态窗口
    const handleClose = () => {
        dispatch({ type: 'CLOSE_MODAL' });
    };

    // 卸下装备
    const handleUnequip = (slot) => {
        dispatch({ type: 'UNEQUIP_ITEM', payload: slot });
    };

    // 获取装备槽位显示信息
    const getSlotInfo = (slotId) => {
        const slots = {
            head: { name: '头部', emoji: '🧢' },
            body: { name: '身体', emoji: '👕' },
            belt: { name: '腰带', emoji: '🧶' },
            shoes: { name: '鞋子', emoji: '👞' },
            weapon: { name: '武器', emoji: '🗡️' },
            necklace: { name: '项链', emoji: '📿' },
            accessory: { name: '首饰', emoji: '💍' }
        };

        return slots[slotId] || { name: slotId, emoji: '❓' };
    };

    // 属性名称映射
    const attributeNames = {
        HEALTH: '生命值',
        ATTACK: '攻击力',
        DEFENSE: '防御力',
        AGILITY: '敏捷度',
        CRIT_CHANCE: '暴击率'
    };

    // 渲染装备属性
    const renderAttributes = (attributes) => {
        if (!attributes || Object.keys(attributes).length === 0) {
            return <div className="empty-attributes">无属性</div>;
        }

        return (
            <div className="equipment-attributes">
                {Object.entries(attributes).map(([key, value]) => (
                    <div key={key} className="equipment-attribute">
                        <span className="attribute-name">{attributeNames[key] || key}:</span>
                        <span className="attribute-value">
                            {key === 'CRIT_CHANCE'
                                ? `+${(value * 100).toFixed(1)}%`
                                : `+${value}`}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content equipment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>装备</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>

                <div className="equipment-container">
                    <div className="equipment-character">
                        <div className="character-figure">😎</div>
                        <div className="equipment-stats">
                            <h3>装备加成</h3>
                            {/* 计算并显示装备总加成 */}
                            {(() => {
                                const bonus = {
                                    HEALTH: 0,
                                    ATTACK: 0,
                                    DEFENSE: 0,
                                    AGILITY: 0,
                                    CRIT_CHANCE: 0
                                };

                                // 计算所有装备的总加成
                                Object.values(equipment).forEach(equip => {
                                    if (!equip) return;
                                    Object.entries(equip.attributes).forEach(([key, value]) => {
                                        bonus[key] = (bonus[key] || 0) + value;
                                    });
                                });

                                // 检查是否有任何加成
                                const hasBonus = Object.values(bonus).some(v => v > 0);

                                if (!hasBonus) {
                                    return <div className="empty-bonus">无装备加成</div>;
                                }

                                return (
                                    <div className="total-bonus">
                                        {Object.entries(bonus).map(([key, value]) => {
                                            if (value <= 0) return null;
                                            return (
                                                <div key={key} className="bonus-item">
                                                    <span className="bonus-name">{attributeNames[key]}:</span>
                                                    <span className="bonus-value">
                                                        {key === 'CRIT_CHANCE'
                                                            ? `+${(value * 100).toFixed(1)}%`
                                                            : `+${value}`}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    <div className="equipment-slots">
                        {Object.keys(equipment).map(slot => {
                            const equip = equipment[slot];
                            const slotInfo = getSlotInfo(slot);

                            return (
                                <div key={slot} className="equipment-slot">
                                    <div className="slot-header">
                                        <span className="slot-emoji">{slotInfo.emoji}</span>
                                        <span className="slot-name">{slotInfo.name}</span>
                                    </div>

                                    {equip ? (
                                        <div
                                            className="equipment-item"
                                            style={{ borderColor: equip.rarityColor || '#a0a0a0' }}
                                        >
                                            <div className="item-header">
                                                <span className="item-emoji">{equip.emoji}</span>
                                                <span
                                                    className="item-name"
                                                    style={{ color: equip.rarityColor }}
                                                >
                                                    {equip.name}
                                                </span>
                                            </div>

                                            <div className="item-details">
                                                <div className="item-level">等级 {equip.level}</div>
                                                <div
                                                    className="item-rarity"
                                                    style={{ color: equip.rarityColor }}
                                                >
                                                    {equip.rarityName}
                                                </div>
                                            </div>

                                            {renderAttributes(equip.attributes)}

                                            <button
                                                className="unequip-button"
                                                onClick={() => handleUnequip(slot)}
                                            >
                                                卸下
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="empty-slot">
                                            <span className="empty-text">未装备</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentModal;