# Contributing to Papyrus CLI

感谢您对 Papyrus CLI 的贡献！

## 开发流程

### 1. 环境准备

```bash
# 克隆仓库
git clone https://github.com/Papyrus/Papyrus-cli.git
cd Papyrus-cli

# 安装依赖
npm install
```

### 2. 代码质量

```bash
# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 格式化
npm run format

# 运行测试
npm run test

# 运行所有质量检查
npm run quality
```

### 3. 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具

示例：
```
feat: add import from JSON command
fix: handle API connection errors
docs: update README with examples
```

### 4. Pull Request 流程

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 代码规范

### TypeScript

- 启用严格模式
- 显式函数返回类型
- 避免使用 `any`

### 测试

- 新功能必须包含测试
- 保持测试覆盖率 > 80%

## 发布流程

```bash
# 更新版本
npm version patch|minor|major

# 自动发布
# CI/CD 会在 tag push 后自动发布到 NPM
git push origin main --tags
```
