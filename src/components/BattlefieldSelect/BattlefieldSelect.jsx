import React from 'react';
import './BattlefieldSelect.css';
import { useGame } from '../../contexts/GameContext';

const BattlefieldSelect = () => {
    const { state, dispatch } = useGame();
    const { player, battlefields } = state;
    // 使用可选链和默认值，确保即使inventory为undefined也不会报错
    const inventory = state.inventory || { items: [] };

    // 选择战场处理函数
    const handleSelectBattlefield = (battlefield) => {
        // 检查玩家等级是否符合战场要求
        if (player.level < battlefield.levelRange[0]) {
            alert(`您的等级太低，无法进入${battlefield.name}！需要至少${battlefield.levelRange[0]}级。`);
            return;
        }

        dispatch({
            type: 'SELECT_BATTLEFIELD',
            payload: battlefield
        });
    };

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

    return (
        <div className="battlefield-select">
            <div className="player-info-banner">
                <div className="player-level">等级: {player.level}</div>
                <div className="player-name">{player.name}</div>
                <div className="player-health">HP: {player.currentHealth}/{player.maxHealth}</div>

                <div className="banner-actions">
                    <button className="banner-action" onClick={openCharacterInfo}>
                        👤 角色
                    </button>
                    <button className="banner-action" onClick={openEquipment}>
                        🛡️ 装备
                    </button>
                    <button className="banner-action" onClick={openInventory}>
                        🎒 物品 <span className="banner-badge">{inventory.items.length}</span>
                    </button>
                </div>
            </div>

            <h2 className="select-title">选择战场</h2>

            <div className="experience-bar">
                <div
                    className="experience-fill"
                    style={{ width: `${(player.experience / player.expToNextLevel) * 100}%` }}
                ></div>
                <div className="experience-text">
                    经验: {player.experience} / {player.expToNextLevel}
                </div>
            </div>

            <div className="battlefields-container">
                {battlefields.map((battlefield) => (
                    <div
                        key={battlefield.id}
                        className={`battlefield-card ${player.level < battlefield.levelRange[0] ? 'locked' : ''}`}
                        onClick={() => handleSelectBattlefield(battlefield)}
                        style={{
                            background: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.6)), ${battlefield.background}`
                        }}
                    >
                        <h3 className="battlefield-name">{battlefield.name}</h3>
                        <div className="battlefield-level">
                            适合等级: {battlefield.levelRange[0]}-{battlefield.levelRange[1]}
                        </div>
                        <p className="battlefield-description">{battlefield.description}</p>

                        {player.level < battlefield.levelRange[0] && (
                            <div className="battlefield-locked">
                                <span className="lock-icon">🔒</span>
                                <span className="lock-text">等级不足</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="game-stats">
                <h3>游戏统计</h3>
                <div className="stat-item">
                    <span className="stat-label">角色等级:</span>
                    <span className="stat-value">{player.level}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">生命值:</span>
                    <span className="stat-value">{player.maxHealth}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">攻击力:</span>
                    <span className="stat-value">{player.attack}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">防御力:</span>
                    <span className="stat-value">{player.defense}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">敏捷度:</span>
                    <span className="stat-value">{player.agility}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">暴击率:</span>
                    <span className="stat-value">{(player.critChance * 100).toFixed(1)}%</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">装备数量:</span>
                    <span className="stat-value">{inventory.items.length}/{inventory.maxSlots}</span>
                </div>
            </div>

            {/* 重置游戏按钮 */}
            <button
                className="reset-game-button"
                onClick={() => {
                    if (window.confirm('确定要重置游戏吗？所有进度将丢失！')) {
                        localStorage.removeItem('rpgGameState');
                        window.location.reload();
                    }
                }}
            >
                重置游戏
            </button>
        </div>
    );
};

export default BattlefieldSelect;