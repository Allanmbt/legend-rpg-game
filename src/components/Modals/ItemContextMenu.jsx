import React, { useEffect, useRef } from 'react';
import './Modal.css';

const ItemContextMenu = ({ position, item, onClose, onEquip, onDiscard }) => {
    const menuRef = useRef(null);

    // 添加点击外部关闭菜单的效果
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // 调整菜单位置，防止超出窗口
    const adjustPosition = () => {
        if (!menuRef.current) return position;

        const { x, y } = position;
        const menuWidth = menuRef.current.offsetWidth;
        const menuHeight = menuRef.current.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let adjustedX = x;
        let adjustedY = y;

        if (x + menuWidth > windowWidth) {
            adjustedX = x - menuWidth;
        }

        if (y + menuHeight > windowHeight) {
            adjustedY = y - menuHeight;
        }

        return { x: adjustedX, y: adjustedY };
    };

    const menuPosition = adjustPosition();

    // 检查物品是否可装备
    const isEquippable = item && item.slot !== undefined;

    return (
        <div
            className="context-menu"
            ref={menuRef}
            style={{
                left: `${menuPosition.x}px`,
                top: `${menuPosition.y}px`
            }}
        >
            <div className="context-menu-header">
                <span className="context-menu-item-name">{item.name}</span>
            </div>

            {isEquippable && (
                <div className="context-menu-item" onClick={() => onEquip(item)}>
                    <span className="context-menu-icon">👆</span>
                    <span className="context-menu-text">装备</span>
                </div>
            )}

            <div className="context-menu-item" onClick={() => onDiscard(item)}>
                <span className="context-menu-icon">🗑️</span>
                <span className="context-menu-text">丢弃</span>
            </div>
        </div>
    );
};

export default ItemContextMenu;