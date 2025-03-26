import React from 'react';
import './GameMenu.css';
import { useGame } from '../../contexts/GameContext';

const GameMenu = () => {
    const { state, dispatch } = useGame();
    const { player } = state;
    // 确保inventory不为undefined
    const inventory = state.inventory || { items: [] };

    // 打开角色信息窗口
    const openCharacterInfo = () => {
        dispatch({
            type: 'OPEN_MODAL',
            payload: {
                type: 'character'
            }
        });
    };

    // 打开装备窗口
    const openEquipment = () => {
        dispatch({
            type: 'OPEN_MODAL',
            payload: {
                type: 'equipment'
            }
        });
    };

    // 打开物品栏窗口
    const openInventory = () => {
        dispatch({
            type: 'OPEN_MODAL',
            payload: {
                type: 'inventory'
            }
        });
    };

    // 处理技能菜单点击 (暂未实现)
    const handleSkillsClick = () => {
        dispatch({
            type: 'ADD_LOG',
            payload: {
                text: '技能功能尚未实现',
                isCritical: false
            }
        });
    };

    // 处理设置菜单点击 (暂未实现)
    const handleSettingsClick = () => {
        dispatch({
            type: 'ADD_LOG',
            payload: {
                text: '设置功能尚未实现',
                isCritical: false
            }
        });
    };

    // 返回主页面
    const handleReturnToSelect = () => {
        dispatch({ type: 'RETURN_TO_SELECT' });
    };

    return (
        <div className="game-menu">
            <div className="player-stats">
                <div className="stat-item">
                    <span className="stat-label">等级:</span>
                    <span className="stat-value">{player.level}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">攻击:</span>
                    <span className="stat-value">{player.attack}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">防御:</span>
                    <span className="stat-value">{player.defense}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">暴击率:</span>
                    <span className="stat-value">{(player.critChance * 100).toFixed(1)}%</span>
                </div>
            </div>

            <div className="menu-buttons">
                <div className="menu-item" onClick={openCharacterInfo}>
                    <div className="menu-icon">👤</div>
                    <div className="menu-text">角色信息</div>
                    <div className="menu-badge">i</div>
                </div>

                <div className="menu-item" onClick={openEquipment}>
                    <div className="menu-icon">🛡️</div>
                    <div className="menu-text">装备</div>
                </div>

                <div className="menu-item" onClick={openInventory}>
                    <div className="menu-icon">🎒</div>
                    <div className="menu-text">物品栏</div>
                    <div className="menu-badge">{inventory.items.length}</div>
                </div>

                <div className="menu-item" onClick={handleSkillsClick}>
                    <div className="menu-icon">✨</div>
                    <div className="menu-text">技能</div>
                </div>

                <div className="menu-item" onClick={handleSettingsClick}>
                    <div className="menu-icon">⚙️</div>
                    <div className="menu-text">设置</div>
                </div>

                <div className="menu-item" onClick={handleReturnToSelect}>
                    <div className="menu-icon">🏠</div>
                    <div className="menu-text">返回主页</div>
                </div>
            </div>
        </div>
    );
};

export default GameMenu;