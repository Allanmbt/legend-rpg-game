import React, { useEffect, useRef } from 'react';
import './BattleLog.css';
import { useGame } from '../../contexts/GameContext';

const BattleLog = () => {
    const { state } = useGame();
    const { battleLogs } = state;
    const logContentRef = useRef(null);

    // 自动滚动到最新日志
    useEffect(() => {
        if (logContentRef.current) {
            logContentRef.current.scrollTop = 0;
        }
    }, [battleLogs]);

    return (
        <div className="battle-log">
            <div className="log-title">战斗日志</div>
            <div className="log-content" ref={logContentRef}>
                {battleLogs.map((log) => (
                    <div
                        key={log.id}
                        className={`log-entry ${log.isCritical ? 'critical' : ''}`}
                    >
                        {log.text}
                    </div>
                ))}
                {battleLogs.length === 0 && (
                    <div className="log-empty">战斗尚未开始...</div>
                )}
            </div>
        </div>
    );
};

export default BattleLog;