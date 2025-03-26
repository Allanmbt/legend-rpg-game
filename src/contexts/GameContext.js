import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 战场配置
const battlefields = [
    {
        id: 'novice',
        name: '新手村',
        levelRange: [1, 10],
        background: '#e6f7ff',
        description: '适合1-10级玩家的新手战场'
    },
    {
        id: 'intermediate',
        name: '进阶森林',
        levelRange: [11, 20],
        background: '#e6ffe6',
        description: '适合11-20级玩家的进阶战场'
    },
    {
        id: 'hell',
        name: '地狱级难度',
        levelRange: [21, 30],
        background: '#ffe6e6',
        description: '适合21-30级玩家的高难度战场'
    }
];

// 装备类型定义
const equipmentTypes = {
    HEAD: { id: 'HEAD', name: '头部', emoji: '🧢', slot: 'head' },
    BODY: { id: 'BODY', name: '身体', emoji: '👕', slot: 'body' },
    BELT: { id: 'BELT', name: '腰带', emoji: '🧶', slot: 'belt' },
    SHOES: { id: 'SHOES', name: '鞋子', emoji: '👞', slot: 'shoes' },
    WEAPON: { id: 'WEAPON', name: '武器', emoji: '🗡️', slot: 'weapon' },
    NECKLACE: { id: 'NECKLACE', name: '项链', emoji: '📿', slot: 'necklace' },
    ACCESSORY: { id: 'ACCESSORY', name: '首饰', emoji: '💍', slot: 'accessory' }
};

// 装备稀有度定义
const rarities = {
    COMMON: { id: 'COMMON', name: '普通', color: '#a0a0a0', chance: 0.6, multiplier: 1 },
    UNCOMMON: { id: 'UNCOMMON', name: '优秀', color: '#1eff00', chance: 0.3, multiplier: 1.5 },
    RARE: { id: 'RARE', name: '精良', color: '#0070dd', chance: 0.08, multiplier: 2 },
    EPIC: { id: 'EPIC', name: '史诗', color: '#a335ee', chance: 0.02, multiplier: 2.5 },
    LEGENDARY: { id: 'LEGENDARY', name: '传说', color: '#ff8000', chance: 0.004, multiplier: 3 }
};

// 装备属性定义
const attributeTypes = {
    HEALTH: { id: 'HEALTH', name: '生命值', min: 5, max: 20, scaling: 2 },
    ATTACK: { id: 'ATTACK', name: '攻击力', min: 1, max: 5, scaling: 0.5 },
    DEFENSE: { id: 'DEFENSE', name: '防御力', min: 1, max: 3, scaling: 0.3 },
    AGILITY: { id: 'AGILITY', name: '敏捷度', min: 1, max: 3, scaling: 0.3 },
    CRIT_CHANCE: { id: 'CRIT_CHANCE', name: '暴击率', min: 0.01, max: 0.03, scaling: 0.003 }
};

// 按装备类型划分可能的属性 (某些属性只在特定装备上出现)
const equipmentAttributes = {
    HEAD: ['HEALTH', 'DEFENSE'],
    BODY: ['HEALTH', 'DEFENSE'],
    BELT: ['HEALTH', 'AGILITY'],
    SHOES: ['AGILITY', 'DEFENSE'],
    WEAPON: ['ATTACK', 'CRIT_CHANCE'],
    NECKLACE: ['HEALTH', 'CRIT_CHANCE'],
    ACCESSORY: ['ATTACK', 'AGILITY', 'CRIT_CHANCE']
};

// 随机生成装备
const generateEquipment = (playerLevel, dropRateBonus = 0) => {
    // 装备等级范围
    const equipLevel = Math.max(1, Math.floor(playerLevel * (0.8 + Math.random() * 0.4)));

    // 随机装备类型
    const equipTypeKeys = Object.keys(equipmentTypes);
    const randomType = equipmentTypes[equipTypeKeys[Math.floor(Math.random() * equipTypeKeys.length)]];

    // 随机稀有度 (使用概率权重)
    let rarityRoll = Math.random() - dropRateBonus; // 掉落率加成提高稀有度概率
    rarityRoll = Math.max(0, rarityRoll); // 确保不会是负数

    let selectedRarity;
    if (rarityRoll < rarities.LEGENDARY.chance) {
        selectedRarity = rarities.LEGENDARY;
    } else if (rarityRoll < rarities.EPIC.chance + rarities.LEGENDARY.chance) {
        selectedRarity = rarities.EPIC;
    } else if (rarityRoll < rarities.RARE.chance + rarities.EPIC.chance + rarities.LEGENDARY.chance) {
        selectedRarity = rarities.RARE;
    } else if (rarityRoll < rarities.UNCOMMON.chance + rarities.RARE.chance + rarities.EPIC.chance + rarities.LEGENDARY.chance) {
        selectedRarity = rarities.UNCOMMON;
    } else {
        selectedRarity = rarities.COMMON;
    }

    // 确定属性数量 (基于稀有度)
    const attrCount = Math.floor(Math.random() * 2) + 1; // 1-2个属性

    // 随机选择属性
    const possibleAttributes = equipmentAttributes[randomType.id];
    const shuffledAttributes = [...possibleAttributes].sort(() => 0.5 - Math.random());
    const selectedAttributes = shuffledAttributes.slice(0, attrCount);

    // 为每个属性随机生成数值
    const attributes = {};
    selectedAttributes.forEach(attrKey => {
        const attr = attributeTypes[attrKey];
        // 基础属性值 + 等级缩放 * 稀有度倍率
        const baseValue = attr.min + Math.random() * (attr.max - attr.min);
        const levelScaling = attr.scaling * equipLevel;
        let value = (baseValue + levelScaling) * selectedRarity.multiplier;

        // 对暴击率进行特殊处理，确保不超过合理范围
        if (attrKey === 'CRIT_CHANCE') {
            value = Math.min(value, 0.25); // 最高25%暴击率
            value = Math.round(value * 1000) / 1000; // 保留3位小数
        } else {
            value = Math.floor(value); // 其他属性取整
        }

        attributes[attrKey] = value;
    });

    // 生成装备名称
    const prefixes = [
        '锋利的', '坚固的', '闪亮的', '破旧的', '神秘的',
        '古老的', '强化的', '精制的', '魔法的', '传承的'
    ];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const name = `${randomPrefix} ${randomType.name}`;

    // 生成唯一ID
    const id = `equip_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return {
        id,
        name,
        type: randomType.id,
        emoji: randomType.emoji,
        slot: randomType.slot,
        level: equipLevel,
        rarity: selectedRarity.id,
        rarityName: selectedRarity.name,
        rarityColor: selectedRarity.color,
        attributes
    };
};

// 怪物配置（根据等级生成）
const generateMonster = (playerLevel, battlefieldId) => {
    // 根据战场确定怪物等级范围
    let minLevel = playerLevel - 2;
    let maxLevel = playerLevel + 2;
    const battlefield = battlefields.find(bf => bf.id === battlefieldId);

    // 确保怪物等级在战场范围内
    if (battlefield) {
        minLevel = Math.max(minLevel, battlefield.levelRange[0]);
        maxLevel = Math.min(maxLevel, battlefield.levelRange[1]);
    }

    // 随机确定怪物等级
    const monsterLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;

    // 怪物类型
    const monsterTypes = [
        { name: '史莱姆', emoji: '🟢', baseHealth: 50, baseAttack: 5, baseDefense: 2, baseAgility: 1 },
        { name: '蝙蝠', emoji: '🦇', baseHealth: 40, baseAttack: 7, baseDefense: 1, baseAgility: 5 },
        { name: '骷髅', emoji: '💀', baseHealth: 60, baseAttack: 6, baseDefense: 3, baseAgility: 2 },
        { name: '蜘蛛', emoji: '🕷️', baseHealth: 45, baseAttack: 6, baseDefense: 2, baseAgility: 4 },
        { name: '幽灵', emoji: '👻', baseHealth: 55, baseAttack: 8, baseDefense: 0, baseAgility: 6 },
        { name: '巨魔', emoji: '👹', baseHealth: 70, baseAttack: 9, baseDefense: 4, baseAgility: 1 },
        { name: '恶魔', emoji: '😈', baseHealth: 65, baseAttack: 10, baseDefense: 3, baseAgility: 3 }
    ];

    // 根据战场难度选择怪物
    let availableMonsters;
    if (battlefieldId === 'novice') {
        availableMonsters = monsterTypes.slice(0, 3); // 简单怪物
    } else if (battlefieldId === 'intermediate') {
        availableMonsters = monsterTypes.slice(2, 5); // 中等怪物
    } else {
        availableMonsters = monsterTypes.slice(4); // 困难怪物
    }

    // 随机选择一种怪物
    const monsterType = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];

    // 基于等级计算怪物属性
    const levelMultiplier = 1 + (monsterLevel - 1) * 0.1; // 每级提升10%

    return {
        name: `${monsterLevel}级${monsterType.name}`,
        emoji: monsterType.emoji,
        level: monsterLevel,
        maxHealth: Math.floor(monsterType.baseHealth * levelMultiplier),
        currentHealth: Math.floor(monsterType.baseHealth * levelMultiplier),
        attack: Math.floor(monsterType.baseAttack * levelMultiplier),
        defense: Math.floor(monsterType.baseDefense * levelMultiplier),
        agility: Math.floor(monsterType.baseAgility * levelMultiplier),
        critChance: 0.1 + monsterLevel * 0.005, // 基础10%，每级+0.5%
        critMultiplier: 1.5,
        // 怪物经验值：基础值 + 等级加成
        expReward: 10 + monsterLevel * 5,
        // 掉落装备概率 (20% + 等级加成)
        dropChance: 0.2 + monsterLevel * 0.01
    };
};

// 计算升级所需经验
const calculateExpToNextLevel = (level) => {
    // 使用指数增长公式: 100 * (level)^1.5
    return Math.floor(100 * Math.pow(level, 1.5));
};

// 计算装备提供的属性总和
const calculateEquipmentStats = (equipment) => {
    const stats = {
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
                    stats.health += value;
                    break;
                case 'ATTACK':
                    stats.attack += value;
                    break;
                case 'DEFENSE':
                    stats.defense += value;
                    break;
                case 'AGILITY':
                    stats.agility += value;
                    break;
                case 'CRIT_CHANCE':
                    stats.critChance += value;
                    break;
                default:
                    break;
            }
        });
    });

    return stats;
};

// 初始状态
// 初始状态
const createInitialState = () => {
    try {
        // 尝试从localStorage读取保存的状态
        const savedState = localStorage.getItem('rpgGameState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);

            // 检查并确保所有关键属性都存在，如果不存在则使用默认值
            // 确保inventory存在
            if (!parsedState.inventory) {
                parsedState.inventory = {
                    maxSlots: 20,
                    items: []
                };
            }

            // 确保modal存在
            if (!parsedState.modal) {
                parsedState.modal = {
                    isOpen: false,
                    type: null,
                    data: null
                };
            }

            // 确保equipment存在
            if (!parsedState.equipment) {
                parsedState.equipment = {
                    head: null,
                    body: null,
                    belt: null,
                    shoes: null,
                    weapon: null,
                    necklace: null,
                    accessory: null
                };
            }

            return parsedState;
        }
    } catch (e) {
        console.error('Failed to parse saved game state:', e);
    }

    // 默认初始状态
    return {
        // 游戏场景状态: 'select' - 战场选择页面, 'battle' - 战斗页面
        gameScene: 'select',
        selectedBattlefield: null,

        // 角色基础属性
        player: {
            name: "勇者",
            level: 1,
            experience: 0,
            expToNextLevel: calculateExpToNextLevel(1),
            maxHealth: 100,
            currentHealth: 100,
            attack: 10,
            defense: 5,
            agility: 3, // 新增敏捷度属性
            critChance: 0.1,
            critMultiplier: 1.5
        },

        // 装备系统
        equipment: {
            head: null,
            body: null,
            belt: null,
            shoes: null,
            weapon: null,
            necklace: null,
            accessory: null
        },

        // 物品栏
        inventory: {
            maxSlots: 20, // 物品栏最大格子数
            items: [] // 物品列表，每个物品包含 {id, count, ...itemData}
        },

        // 模态窗口状态
        modal: {
            isOpen: false,
            type: null, // 'character', 'equipment', 'inventory'
            data: null
        },

        // 物品右键菜单状态
        contextMenu: {
            isOpen: false,
            position: { x: 0, y: 0 },
            item: null
        },

        monster: null,

        battleLogs: [],
        playerAttacking: false,
        monsterAttacking: false,
        playerDamaged: false,
        monsterDamaged: false,
        gameSpeed: 2000, // 每回合间隔(毫秒)
        gameRunning: true,
        battlefields: battlefields
    };
};

// Reducer函数来处理状态更新
function gameReducer(state, action) {
    let newState;

    switch (action.type) {
        // 选择战场
        case 'SELECT_BATTLEFIELD':
            newState = {
                ...state,
                gameScene: 'battle',
                selectedBattlefield: action.payload,
                battleLogs: [{
                    id: Date.now(),
                    text: `进入${action.payload.name}战场！`,
                    isCritical: false
                }],
                // 生成新怪物
                monster: generateMonster(state.player.level, action.payload.id)
            };
            break;

        // 返回选择页面
        case 'RETURN_TO_SELECT':
            newState = {
                ...state,
                gameScene: 'select',
                monster: null,
                battleLogs: []
            };
            break;

        // 打开模态窗口
        case 'OPEN_MODAL':
            newState = {
                ...state,
                modal: {
                    isOpen: true,
                    type: action.payload.type,
                    data: action.payload.data || null
                }
            };
            break;

        // 关闭模态窗口
        case 'CLOSE_MODAL':
            newState = {
                ...state,
                modal: {
                    ...state.modal,
                    isOpen: false
                }
            };
            break;

        // 打开右键菜单
        case 'OPEN_CONTEXT_MENU':
            newState = {
                ...state,
                contextMenu: {
                    isOpen: true,
                    position: action.payload.position,
                    item: action.payload.item
                }
            };
            break;

        // 关闭右键菜单
        case 'CLOSE_CONTEXT_MENU':
            newState = {
                ...state,
                contextMenu: {
                    ...state.contextMenu,
                    isOpen: false
                }
            };
            break;

        // 装备物品
        case 'EQUIP_ITEM':
            {
                const item = action.payload;
                const { slot } = item;

                // 检查是否已经有装备在该槽位
                const existingEquipment = state.equipment[slot];
                let newInventory = { ...state.inventory };

                // 从物品栏移除要装备的物品
                newInventory.items = newInventory.items.filter(invItem => {
                    if (invItem.id === item.id) {
                        if (invItem.count > 1) {
                            invItem.count--;
                            return true;
                        }
                        return false;
                    }
                    return true;
                });

                // 如果槽位已有装备，将其放回物品栏
                if (existingEquipment) {
                    // 检查物品栏是否已有相同物品
                    const existingInvItem = newInventory.items.find(i =>
                        i.id === existingEquipment.id ||
                        (i.name === existingEquipment.name && i.level === existingEquipment.level)
                    );

                    if (existingInvItem) {
                        existingInvItem.count++;
                    } else {
                        // 检查物品栏是否已满
                        if (newInventory.items.length < newInventory.maxSlots) {
                            newInventory.items.push({ ...existingEquipment, count: 1 });
                        } else {
                            // 如果满了，添加提示
                            newState = {
                                ...state,
                                battleLogs: [
                                    {
                                        id: Date.now(),
                                        text: `物品栏已满，无法卸下${existingEquipment.name}！`,
                                        isCritical: true
                                    },
                                    ...state.battleLogs.slice(0, 19)
                                ]
                            };
                            break;
                        }
                    }
                }

                // 创建新的装备状态
                const newEquipment = {
                    ...state.equipment,
                    [slot]: { ...item, count: 1 }
                };

                // 获取新的装备加成
                const equipStats = calculateEquipmentStats(newEquipment);

                // 更新玩家属性（基础属性+装备加成）
                const basePlayer = { ...state.player };
                const updatedPlayer = {
                    ...basePlayer,
                    maxHealth: basePlayer.maxHealth + equipStats.health,
                    currentHealth: Math.min(basePlayer.currentHealth + equipStats.health, basePlayer.maxHealth + equipStats.health),
                    attack: basePlayer.attack + equipStats.attack,
                    defense: basePlayer.defense + equipStats.defense,
                    agility: basePlayer.agility + equipStats.agility,
                    critChance: basePlayer.critChance + equipStats.critChance
                };

                newState = {
                    ...state,
                    equipment: newEquipment,
                    inventory: newInventory,
                    player: updatedPlayer,
                    battleLogs: [
                        {
                            id: Date.now(),
                            text: `装备了${item.name}！`,
                            isCritical: false
                        },
                        ...state.battleLogs.slice(0, 19)
                    ]
                };
            }
            break;

        // 卸下装备
        case 'UNEQUIP_ITEM':
            {
                const slot = action.payload;
                const item = state.equipment[slot];

                if (!item) {
                    newState = state;
                    break;
                }

                // 检查物品栏是否已满
                if (state.inventory.items.length >= state.inventory.maxSlots) {
                    newState = {
                        ...state,
                        battleLogs: [
                            {
                                id: Date.now(),
                                text: `物品栏已满，无法卸下${item.name}！`,
                                isCritical: true
                            },
                            ...state.battleLogs.slice(0, 19)
                        ]
                    };
                    break;
                }

                // 检查物品栏是否已有相同物品
                let newInventory = { ...state.inventory };
                const existingItem = newInventory.items.find(i =>
                    i.id === item.id ||
                    (i.name === item.name && i.level === item.level)
                );

                if (existingItem) {
                    existingItem.count++;
                } else {
                    newInventory.items.push({ ...item, count: 1 });
                }

                // 创建新的装备状态
                const newEquipment = {
                    ...state.equipment,
                    [slot]: null
                };

                // 获取新的装备加成
                const equipStats = calculateEquipmentStats(newEquipment);

                // 更新玩家属性（基础属性+装备加成）
                const basePlayer = { ...state.player };
                const updatedPlayer = {
                    ...basePlayer,
                    maxHealth: basePlayer.maxHealth - equipStats.health,
                    currentHealth: Math.min(basePlayer.currentHealth, basePlayer.maxHealth - equipStats.health),
                    attack: basePlayer.attack - equipStats.attack,
                    defense: basePlayer.defense - equipStats.defense,
                    agility: basePlayer.agility - equipStats.agility,
                    critChance: basePlayer.critChance - equipStats.critChance
                };

                newState = {
                    ...state,
                    equipment: newEquipment,
                    inventory: newInventory,
                    player: updatedPlayer,
                    battleLogs: [
                        {
                            id: Date.now(),
                            text: `卸下了${item.name}！`,
                            isCritical: false
                        },
                        ...state.battleLogs.slice(0, 19)
                    ]
                };
            }
            break;

        // 丢弃物品
        case 'DISCARD_ITEM':
            {
                const item = action.payload;

                // 从物品栏移除物品
                const newInventory = { ...state.inventory };
                newInventory.items = newInventory.items.filter(invItem => invItem.id !== item.id);

                newState = {
                    ...state,
                    inventory: newInventory,
                    battleLogs: [
                        {
                            id: Date.now(),
                            text: `丢弃了${item.name} x${item.count}！`,
                            isCritical: false
                        },
                        ...state.battleLogs.slice(0, 19)
                    ]
                };
            }
            break;

        // 获得物品
        case 'GAIN_ITEM':
            {
                const item = action.payload;

                // 检查物品栏是否已满
                if (state.inventory.items.length >= state.inventory.maxSlots) {
                    // 物品栏已满，无法获得物品
                    newState = {
                        ...state,
                        battleLogs: [
                            {
                                id: Date.now(),
                                text: `物品栏已满，无法获得${item.name}！`,
                                isCritical: true
                            },
                            ...state.battleLogs.slice(0, 19)
                        ]
                    };
                    break;
                }

                // 检查物品栏是否已有相同物品
                const newInventory = { ...state.inventory };
                const existingItem = newInventory.items.find(i =>
                    i.id === item.id ||
                    (i.name === item.name && i.level === item.level && i.rarity === item.rarity)
                );

                if (existingItem) {
                    // 如果已有相同物品，增加数量
                    existingItem.count++;
                } else {
                    // 否则添加新物品
                    newInventory.items.push({ ...item, count: 1 });
                }

                newState = {
                    ...state,
                    inventory: newInventory,
                    battleLogs: [
                        {
                            id: Date.now(),
                            text: `获得了${item.name}！`,
                            isCritical: false
                        },
                        ...state.battleLogs.slice(0, 19)
                    ]
                };
            }
            break;

        // 玩家攻击
        case 'PLAYER_ATTACK':
            newState = {
                ...state,
                playerAttacking: true
            };
            break;

        // 玩家攻击结束
        case 'PLAYER_ATTACK_END':
            newState = {
                ...state,
                playerAttacking: false
            };
            break;

        // 怪物受伤
        case 'MONSTER_DAMAGE':
            newState = {
                ...state,
                monsterDamaged: true,
                monster: {
                    ...state.monster,
                    currentHealth: Math.max(0, state.monster.currentHealth - action.payload.damage)
                },
                battleLogs: [
                    {
                        id: Date.now(),
                        text: action.payload.isCritical
                            ? `暴击！${state.player.name}对${state.monster.name}造成了${action.payload.damage}点伤害！`
                            : `${state.player.name}对${state.monster.name}造成了${action.payload.damage}点伤害。`,
                        isCritical: action.payload.isCritical
                    },
                    ...state.battleLogs.slice(0, 19)
                ]
            };
            break;

        // 怪物受伤结束
        case 'MONSTER_DAMAGE_END':
            newState = {
                ...state,
                monsterDamaged: false
            };
            break;

        // 怪物攻击
        case 'MONSTER_ATTACK':
            newState = {
                ...state,
                monsterAttacking: true
            };
            break;

        // 怪物攻击结束
        case 'MONSTER_ATTACK_END':
            newState = {
                ...state,
                monsterAttacking: false
            };
            break;

        // 玩家受伤
        case 'PLAYER_DAMAGE':
            newState = {
                ...state,
                playerDamaged: true,
                player: {
                    ...state.player,
                    currentHealth: Math.max(0, state.player.currentHealth - action.payload.damage)
                },
                battleLogs: [
                    {
                        id: Date.now(),
                        text: action.payload.isCritical
                            ? `暴击！${state.monster.name}对${state.player.name}造成了${action.payload.damage}点伤害！`
                            : `${state.monster.name}对${state.player.name}造成了${action.payload.damage}点伤害。`,
                        isCritical: action.payload.isCritical
                    },
                    ...state.battleLogs.slice(0, 19)
                ]
            };
            break;

        // 玩家受伤结束
        case 'PLAYER_DAMAGE_END':
            newState = {
                ...state,
                playerDamaged: false
            };
            break;

        // 添加日志
        case 'ADD_LOG':
            newState = {
                ...state,
                battleLogs: [
                    { id: Date.now(), text: action.payload.text, isCritical: action.payload.isCritical },
                    ...state.battleLogs.slice(0, 19)
                ]
            };
            break;

        // 玩家获得经验
        case 'PLAYER_GAIN_EXPERIENCE':
            {
                const expGained = action.payload.experience;
                let updatedPlayer = { ...state.player };
                updatedPlayer.experience += expGained;

                // 检查是否升级
                let leveledUp = false;
                while (updatedPlayer.experience >= updatedPlayer.expToNextLevel) {
                    // 升级
                    updatedPlayer.level += 1;
                    updatedPlayer.experience -= updatedPlayer.expToNextLevel;
                    updatedPlayer.expToNextLevel = calculateExpToNextLevel(updatedPlayer.level);

                    // 属性提升
                    const healthIncrease = Math.floor(20 + updatedPlayer.level * 5);
                    updatedPlayer.maxHealth += healthIncrease;
                    updatedPlayer.currentHealth += healthIncrease;
                    updatedPlayer.attack += 2;
                    updatedPlayer.defense += 1;
                    updatedPlayer.agility += 1;

                    // 每10级增加暴击率
                    if (updatedPlayer.level % 10 === 0) {
                        updatedPlayer.critChance += 0.05;
                    }

                    leveledUp = true;
                }

                const newLogs = leveledUp
                    ? [
                        {
                            id: Date.now(),
                            text: `获得${expGained}点经验！升级到${updatedPlayer.level}级！`,
                            isCritical: true
                        },
                        ...state.battleLogs
                    ]
                    : [
                        {
                            id: Date.now(),
                            text: `获得${expGained}点经验！`,
                            isCritical: false
                        },
                        ...state.battleLogs
                    ];

                newState = {
                    ...state,
                    player: updatedPlayer,
                    battleLogs: newLogs.slice(0, 20)
                };
            }
            break;

        // 掉落装备
        case 'DROP_EQUIPMENT':
            {
                // 检查是否掉落装备
                const monster = state.monster;
                const randomRoll = Math.random();

                if (randomRoll <= monster.dropChance) {
                    // 生成装备
                    const equipment = generateEquipment(monster.level);

                    // 检查物品栏是否已满
                    if (state.inventory.items.length >= state.inventory.maxSlots) {
                        // 物品栏已满，无法获得装备
                        newState = {
                            ...state,
                            battleLogs: [
                                {
                                    id: Date.now(),
                                    text: `怪物掉落了${equipment.rarityName}品质的${equipment.name}，但物品栏已满，无法拾取！`,
                                    isCritical: true
                                },
                                ...state.battleLogs.slice(0, 19)
                            ]
                        };
                        break;
                    }

                    // 添加装备到物品栏
                    const newInventory = { ...state.inventory };
                    newInventory.items.push({ ...equipment, count: 1 });

                    newState = {
                        ...state,
                        inventory: newInventory,
                        battleLogs: [
                            {
                                id: Date.now(),
                                text: `怪物掉落了${equipment.rarityName}品质的${equipment.name}！`,
                                isCritical: true
                            },
                            ...state.battleLogs.slice(0, 19)
                        ]
                    };
                } else {
                    // 没有掉落装备
                    newState = state;
                }
            }
            break;

        // 重置怪物
        case 'RESET_MONSTER':
            newState = {
                ...state,
                monster: generateMonster(state.player.level, state.selectedBattlefield.id),
                battleLogs: [
                    { id: Date.now(), text: "新的怪物出现了！", isCritical: false },
                    ...state.battleLogs.slice(0, 19)
                ]
            };
            break;

        // 恢复玩家生命值
        case 'RESET_PLAYER_HEALTH':
            newState = {
                ...state,
                player: {
                    ...state.player,
                    currentHealth: state.player.maxHealth
                },
                battleLogs: [
                    { id: Date.now(), text: `${state.player.name}恢复了健康！`, isCritical: false },
                    ...state.battleLogs.slice(0, 19)
                ]
            };
            break;

        // 切换游戏运行状态
        case 'TOGGLE_GAME':
            newState = {
                ...state,
                gameRunning: !state.gameRunning
            };
            break;

        default:
            return state;
    }

    // 保存状态到localStorage
    localStorage.setItem('rpgGameState', JSON.stringify(newState));
    return newState;
}

// 创建Context
const GameContext = createContext();

// 自定义钩子，方便组件使用Context
export function useGame() {
    return useContext(GameContext);
}

// Provider组件
export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

    // 战斗伤害计算
    const calculateDamage = (attacker, defender) => {
        // 基础伤害 = 攻击力 - 防御力/2
        let baseDamage = Math.max(1, attacker.attack - defender.defense / 2);

        // 敏捷影响命中和闪避
        const agilityDiff = attacker.agility - defender.agility;

        // 命中率调整 (加成或减少最多20%)
        const hitRateAdjustment = Math.min(0.2, Math.max(-0.2, agilityDiff * 0.02));
        const baseHitRate = 0.9; // 基础90%命中率
        const hitRate = Math.min(0.99, Math.max(0.7, baseHitRate + hitRateAdjustment));

        // 检查是否命中
        if (Math.random() > hitRate) {
            // 闪避
            return 0;
        }

        // 随机波动 (±20%)
        const randomFactor = 0.8 + Math.random() * 0.4;
        return Math.floor(baseDamage * randomFactor);
    };

    // 游戏主循环
    useEffect(() => {
        // 只在战斗场景且游戏正在运行时执行战斗循环
        if (state.gameScene !== 'battle' || !state.gameRunning || !state.monster) return;

        const gameLoop = setInterval(() => {
            // 检查玩家是否死亡
            if (state.player.currentHealth <= 0) {
                dispatch({
                    type: 'ADD_LOG',
                    payload: {
                        text: `战斗失败！${state.player.name}被${state.monster.name}击败了！`,
                        isCritical: true
                    }
                });

                // 延迟后返回选择页面
                setTimeout(() => {
                    dispatch({ type: 'RETURN_TO_SELECT' });
                }, 2000);

                return;
            }

            // 检查怪物是否死亡
            if (state.monster.currentHealth <= 0) {
                dispatch({
                    type: 'ADD_LOG',
                    payload: {
                        text: `战斗胜利！${state.player.name}击败了${state.monster.name}！`,
                        isCritical: true
                    }
                });

                // 获得经验值
                dispatch({
                    type: 'PLAYER_GAIN_EXPERIENCE',
                    payload: { experience: state.monster.expReward }
                });

                // 检查是否掉落装备
                dispatch({ type: 'DROP_EQUIPMENT' });

                // 恢复玩家血量
                setTimeout(() => {
                    dispatch({ type: 'RESET_PLAYER_HEALTH' });
                }, 1000);

                // 生成新怪物
                setTimeout(() => {
                    dispatch({ type: 'RESET_MONSTER' });
                }, 2000);

                return;
            }

            // 玩家攻击
            dispatch({ type: 'PLAYER_ATTACK' });

            setTimeout(() => {
                dispatch({ type: 'PLAYER_ATTACK_END' });

                const isCritical = Math.random() < state.player.critChance;
                let damage = calculateDamage(state.player, state.monster);

                if (damage === 0) {
                    dispatch({
                        type: 'ADD_LOG',
                        payload: {
                            text: `${state.monster.name}闪避了${state.player.name}的攻击！`,
                            isCritical: false
                        }
                    });
                } else {
                    if (isCritical) {
                        damage = Math.floor(damage * state.player.critMultiplier);
                    }

                    dispatch({
                        type: 'MONSTER_DAMAGE',
                        payload: { damage, isCritical }
                    });
                }

                setTimeout(() => {
                    dispatch({ type: 'MONSTER_DAMAGE_END' });

                    // 怪物攻击 (如果还活着)
                    if (state.monster.currentHealth > 0) {
                        setTimeout(() => {
                            dispatch({ type: 'MONSTER_ATTACK' });

                            setTimeout(() => {
                                dispatch({ type: 'MONSTER_ATTACK_END' });

                                const monsterCritical = Math.random() < state.monster.critChance;
                                let monsterDamage = calculateDamage(state.monster, state.player);

                                if (monsterDamage === 0) {
                                    dispatch({
                                        type: 'ADD_LOG',
                                        payload: {
                                            text: `${state.player.name}闪避了${state.monster.name}的攻击！`,
                                            isCritical: false
                                        }
                                    });
                                } else {
                                    if (monsterCritical) {
                                        monsterDamage = Math.floor(monsterDamage * state.monster.critMultiplier);
                                    }

                                    dispatch({
                                        type: 'PLAYER_DAMAGE',
                                        payload: { damage: monsterDamage, isCritical: monsterCritical }
                                    });
                                }

                                setTimeout(() => {
                                    dispatch({ type: 'PLAYER_DAMAGE_END' });
                                }, 500);
                            }, 500);
                        }, 500);
                    }
                }, 500);
            }, 500);

        }, state.gameSpeed);

        return () => clearInterval(gameLoop);
    }, [state.gameScene, state.gameRunning, state.player, state.monster, state.selectedBattlefield]);

    const value = {
        state,
        dispatch,
        calculateExpToNextLevel,
        equipmentTypes,
        rarities
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}