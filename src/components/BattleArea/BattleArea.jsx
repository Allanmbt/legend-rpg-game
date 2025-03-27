import React from 'react';
import './BattleArea.css';
import { useGame } from '../../contexts/GameContext';

// 角色组件
const Character = ({ character, emoji, isPlayer, isAttacking, isDamaged }) => {
    const healthPercent = (character.currentHealth / character.maxHealth) * 100;

    return (
        <div className={`character-container ${isPlayer ? 'player' : 'monster'}`}>
            <div className="character-info">
                <div className="character-name">{character.name}</div>
                {character.level && <div className="character-level">Lv.{character.level}</div>}
            </div>

            <div className="health-bar">
                <div
                    className="health-bar-fill"
                    style={{
                        width: `${healthPercent}%`,
                        backgroundColor: healthPercent < 30 ? '#ff4d4d' : '#4CAF50'
                    }}
                ></div>
                <div className="health-text">{character.currentHealth} / {character.maxHealth}</div>
            </div>

            <div
                className={`character ${isAttacking ? 'attacking' : ''} ${isDamaged ? 'damaged' : ''}`}
            >
                {emoji || (isPlayer ? '😎' : '👹')}
            </div>

            {/* Boss标记 */}
            {character.isBoss && (
                <div className="boss-indicator">BOSS</div>
            )}
        </div>
    );
};

// 战斗区域主组件
const BattleArea = () => {
    const { state, dispatch } = useGame();
    const {
        player,
        monster,
        playerAttacking,
        monsterAttacking,
        playerDamaged,
        monsterDamaged,
        selectedBattlefield,
        gameRunning
    } = state;

    // 返回选择页面
    const handleReturnToSelect = () => {
        dispatch({ type: 'RETURN_TO_SELECT' });
    };

    // 暂停/继续游戏
    const toggleGameRunning = () => {
        dispatch({ type: 'TOGGLE_GAME' });
    };

    // 挑战Boss
    const handleChallengeBoss = () => {
        if (window.confirm(`确定要挑战${selectedBattlefield.name}的Boss吗？准备好了再挑战！`)) {
            dispatch({ type: 'CHALLENGE_BOSS' });
        }
    };

    // 设置背景色
    const battlefieldStyle = {
        backgroundColor: selectedBattlefield?.background || '#e6f7ff'
    };

    return (
        <div className="battle-area" style={battlefieldStyle}>
            {/* 战场信息 */}
            <div className="battlefield-info">
                <button className="return-button" onClick={handleReturnToSelect}>
                    ← 返回
                </button>
                <div className="battlefield-name">{selectedBattlefield?.name || '战场'}</div>
                <button className="toggle-button" onClick={toggleGameRunning}>
                    {gameRunning ? '⏸️ 暂停' : '▶️ 继续'}
                </button>
            </div>

            {/* 经验条 */}
            <div className="experience-display">
                <div className="exp-bar">
                    <div
                        className="exp-fill"
                        style={{ width: `${(player.experience / player.expToNextLevel) * 100}%` }}
                    ></div>
                    <div className="exp-text">
                        Lv.{player.level} - 经验: {player.experience}/{player.expToNextLevel}
                    </div>
                </div>
            </div>

            {/* Boss挑战按钮 */}
            <div className="boss-challenge-container">
                <button
                    className="boss-challenge-button"
                    onClick={handleChallengeBoss}
                    // 当前怪物是Boss时禁用按钮
                    disabled={monster && monster.isBoss}
                >
                    ⚔️ 挑战Boss
                </button>
                {monster && monster.isBoss && (
                    <div className="boss-battle-indicator">
                        Boss战斗中
                    </div>
                )}
            </div>

            {/* 战斗区域 */}
            <div className="battle-characters">
                <Character
                    character={player}
                    isPlayer={true}
                    isAttacking={playerAttacking}
                    isDamaged={playerDamaged}
                />

                <div className="battle-vs">VS</div>

                {monster && (
                    <Character
                        character={monster}
                        emoji={monster.emoji}
                        isPlayer={false}
                        isAttacking={monsterAttacking}
                        isDamaged={monsterDamaged}
                    />
                )}
            </div>
        </div>
    );
};

export default BattleArea;