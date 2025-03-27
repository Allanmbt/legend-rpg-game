import React, { useState } from 'react';
import './Modal.css';
import { useGame } from '../../contexts/GameContext';
import ItemContextMenu from './ItemContextMenu';

const InventoryModal = () => {
    const { state, dispatch } = useGame();
    const { inventory } = state;

    // 右键菜单状态
    const [contextMenu, setContextMenu] = useState({
        isOpen: false,
        position: { x: 0, y: 0 },
        item: null
    });

    // 关闭模态窗口
    const handleClose = () => {
        dispatch({ type: 'CLOSE_MODAL' });
    };

    // 处理点击物品 - 替代右键菜单
    const handleItemClick = (e, item) => {
        // 计算菜单位置 - 显示在物品下方
        const rect = e.currentTarget.getBoundingClientRect();

        setContextMenu({
            isOpen: true,
            position: {
                x: rect.left + rect.width / 2, // 居中
                y: rect.bottom + 10 // 位于物品下方
            },
            item
        });

        // 防止事件冒泡
        e.stopPropagation();
    };

    // 关闭右键菜单
    const closeContextMenu = () => {
        setContextMenu({
            ...contextMenu,
            isOpen: false
        });
    };

    // 装备物品
    const handleEquip = (item) => {
        dispatch({ type: 'EQUIP_ITEM', payload: item });
        closeContextMenu();
    };

    // 丢弃物品
    const handleDiscard = (item) => {
        if (window.confirm(`确定要丢弃 ${item.name} x${item.count} 吗？`)) {
            dispatch({ type: 'DISCARD_ITEM', payload: item });
        }
        closeContextMenu();
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
            <div className="item-attributes">
                {Object.entries(attributes).map(([key, value]) => (
                    <div key={key} className="item-attribute">
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

    // 点击遮罩层时关闭菜单
    const handleOverlayClick = () => {
        closeContextMenu();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content inventory-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>物品栏</h2>
                    <div className="inventory-capacity">
                        {inventory.items.length} / {inventory.maxSlots}
                    </div>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>

                <div className="inventory-container">
                    <div className="inventory-help">
                        点击物品可以进行装备或丢弃操作
                    </div>

                    <div className="inventory-grid">
                        {inventory.items.length > 0 ? (
                            inventory.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="inventory-item"
                                    style={{ borderColor: item.rarityColor || '#a0a0a0' }}
                                    onClick={(e) => handleItemClick(e, item)}
                                >
                                    <div className="item-header">
                                        <span className="item-emoji">{item.emoji}</span>
                                        <span
                                            className="item-name"
                                            style={{ color: item.rarityColor }}
                                        >
                                            {item.name}
                                        </span>
                                    </div>

                                    <div className="item-details">
                                        <div className="item-level">等级 {item.level}</div>
                                        {item.rarityName && (
                                            <div
                                                className="item-rarity"
                                                style={{ color: item.rarityColor }}
                                            >
                                                {item.rarityName}
                                            </div>
                                        )}
                                    </div>

                                    {renderAttributes(item.attributes)}

                                    {item.count > 1 && (
                                        <div className="item-count">x{item.count}</div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-inventory">
                                物品栏为空
                            </div>
                        )}

                        {/* 显示空格子 */}
                        {Array.from({ length: inventory.maxSlots - inventory.items.length }).map((_, index) => (
                            <div key={`empty-${index}`} className="inventory-slot-empty"></div>
                        ))}
                    </div>
                </div>

                {/* 操作菜单 */}
                {contextMenu.isOpen && (
                    <ItemContextMenu
                        position={contextMenu.position}
                        item={contextMenu.item}
                        onClose={closeContextMenu}
                        onEquip={handleEquip}
                        onDiscard={handleDiscard}
                    />
                )}
            </div>
        </div>
    );
};

export default InventoryModal;