# 领域建模模式（Domain Modeling Patterns）

## 概述

领域建模是将现实世界的业务概念、规则和流程抽象为软件模型的过程。良好的领域建模有助于提升系统的可维护性、可扩展性和业务一致性。

## 核心概念

- 实体（Entity）
- 值对象（Value Object）
- 聚合（Aggregate）
- 聚合根（Aggregate Root）
- 工厂（Factory）
- 仓储（Repository）
- 领域服务（Domain Service）

## 常见模式

- 贫血模型 vs. 充血模型
- DDD（领域驱动设计）核心模式
- 事件溯源（Event Sourcing）
- CQRS（命令查询职责分离）

## 最佳实践

- 领域模型应贴合业务语言（Ubiquitous Language）
- 聚合边界要清晰
- 只通过聚合根操作聚合内数据
- 领域服务只包含纯业务逻辑

## 参考资源

- Eric Evans《领域驱动设计》
- <https://martinfowler.com/bliki/DomainModel.html>
- <https://dddcommunity.org/>
