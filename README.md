# 闲置RPG游戏功能总结与使用说明

## 新增功能总结

### 1. 角色信息系统
- 新增角色详细属性界面
- 显示基础属性和装备加成
- 美观的属性展示界面
- 支持查看属性说明

### 2. 装备系统
- 七种装备位置：头部、身体、腰带、鞋子、武器、项链、首饰
- 装备提供属性加成（生命值、攻击力、防御力、敏捷度、暴击率）
- 装备有不同稀有度和品质（普通、优秀、精良、史诗、传说）
- 可随时穿戴和卸下装备

### 3. 物品栏系统
- 可存放最多20件物品
- 相同物品可堆叠
- 右键菜单支持装备和丢弃操作
- 物品数量显示和容量管理

### 4. 装备掉落系统
- 击败怪物有几率掉落装备
- 装备属性和稀有度随机生成
- 高级属性和稀有度掉落概率较低
- 物品栏满时会提示无法获得装备

## 使用说明

### 角色信息查看
1. 在战斗界面点击"角色信息"按钮
2. 或在主界面点击顶部栏的"角色"按钮
3. 在弹出窗口中查看详细属性和加成

### 装备管理
1. 在战斗界面点击"装备"按钮
2. 或在主界面点击顶部栏的"装备"按钮
3. 在装备界面可以查看已装备物品
4. 点击"卸下"按钮可将装备放回物品栏

### 物品栏操作
1. 在战斗界面点击"物品栏"按钮
2. 或在主界面点击顶部栏的"物品"按钮
3. 右键点击物品会出现操作菜单
4. 选择"装备"可将物品穿戴在对应位置
5. 选择"丢弃"可永久删除物品

### 战斗与装备掉落
1. 战斗胜利后有几率掉落装备
2. 装备会自动添加到物品栏
3. 如果物品栏已满，会提示无法获得装备
4. 怪物等级越高，掉落装备的几率和质量也越高

## 属性说明

- **生命值**：决定角色可以承受的伤害量
- **攻击力**：影响角色造成的伤害
- **防御力**：减少受到的伤害
- **敏捷度**：影响闪避和命中率
- **暴击率**：攻击造成暴击的几率
- **暴击伤害**：暴击时伤害的倍率

## 装备稀有度

- **普通(60%)**: 基础属性加成
- **优秀(30%)**: 属性加成x1.5
- **精良(8%)**: 属性加成x2
- **史诗(2%)**: 属性加成x2.5
- **传说(0.4%)**: 属性加成x3

## 数据存储

所有游戏进度（包括角色等级、属性、装备和物品栏）都会自动保存到浏览器的localStorage中，关闭页面后重新打开仍可继续游戏。

如需重置游戏，可在主界面点击"重置游戏"按钮。