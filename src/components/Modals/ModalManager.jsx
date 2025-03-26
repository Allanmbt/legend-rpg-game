import React from 'react';
import { useGame } from '../../contexts/GameContext';
import CharacterInfoModal from './CharacterInfoModal';
import EquipmentModal from './EquipmentModal';
import InventoryModal from './InventoryModal';

// 模态窗口管理器组件
const ModalManager = () => {
    const { state } = useGame();
    // 添加默认值，确保即使modal为undefined也不会报错
    const modal = state.modal || { isOpen: false, type: null };

    // 如果模态窗口未打开，不渲染任何内容
    if (!modal.isOpen) {
        return null;
    }

    // 根据模态窗口类型渲染相应的组件
    switch (modal.type) {
        case 'character':
            return <CharacterInfoModal />;
        case 'equipment':
            return <EquipmentModal />;
        case 'inventory':
            return <InventoryModal />;
        default:
            return null;
    }
};

export default ModalManager;