import React from 'react';
import './App.css';
import BattleArea from './components/BattleArea/BattleArea';
import BattleLog from './components/BattleLog/BattleLog';
import GameMenu from './components/GameMenu/GameMenu';
import BattlefieldSelect from './components/BattlefieldSelect/BattlefieldSelect';
import ModalManager from './components/Modals/ModalManager';
import { GameProvider, useGame } from './contexts/GameContext';

// 游戏内容组件
const GameContent = () => {
    const { state } = useGame();
    const { gameScene } = state;

    // 根据当前场景渲染不同内容
    return (
        <>
            {gameScene === 'select' ? (
                // 战场选择页面
                <BattlefieldSelect />
            ) : (
                // 战斗页面
                <>
                    <BattleArea />
                    <BattleLog />
                    <GameMenu />
                </>
            )}

            {/* 模态窗口管理器 */}
            <ModalManager />
        </>
    );
};

function App() {
    return (
        <div className="game-container">
            <GameProvider>
                <GameContent />
            </GameProvider>
        </div>
    );
}

export default App;