# 测试框架配置参考指南

本文档提供各种测试框架的配置模板和最佳实践。

## 🧪 单元测试框架

### 1. Jest配置

*`jest.config.js`*：

```javascript
module.exports = {
  // 测试环境
  testEnvironment: "node",

  // 测试文件匹配模式
  testMatch: ["**/__tests__/*`/`.test.js", "*`/?(`.)+(spec|test).js"],

  // 覆盖率收集配置
  collectCoverage: true,
  collectCoverageFrom: [
    "src/*`/`.js",
    "!src/*`/`.d.ts",
    "!src/*`/`.test.js",
    "!src/*`/`.spec.js",
    "!src/index.js",
    "!src/server.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // 模块路径映射
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "<rootDir>/tests/__mocks__/styleMock.js",
  },

  // 转换配置
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  // Setup文件
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

  // 测试超时时间
  testTimeout: 10000,

  // 并行执行
  maxWorkers: "50%",

  // 详细输出
  verbose: true,

  // 清除mock
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

```

*`setup.js`*：

```javascript
// Jest setup file
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

// 配置Enzyme
configure({ adapter: new Adapter() });

// 全局mock
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// 设置环境变量
process.env.NODE_ENV = "test";

// 测试数据库连接（如果需要）
// beforeAll(async () => {
//   await setupTestDatabase();
// });

// afterAll(async () => {
//   await cleanupTestDatabase();
// });

```

### 2. Mocha配置

*`.mocharc.js`*：

```javascript
module.exports = {
  // 测试文件
  spec: "test/*`/`.test.js",

  // 超时时间
  timeout: 10000,

  // 并行执行
  parallel: true,

  // 覆盖率
  require: "@babel/register",

  // Reporter
  reporter: ["spec", "html", "json"],

  reporterOptions: {
    output: "test-results.html",
  },

  // 递归
  recursive: true,

  // 排除
  exclude: ["node_modules/", "dist/", "build/"],
};

```

*`.nycrc`*：

```javascript
module.exports = {
  // 包含文件
  include: ["src/*`/`.js"],

  // 排除文件
  exclude: [
    "src/*`/`.test.js",
    "src/*`/`.spec.js",
    "src/index.js",
    "node_modules/",
    "dist/",
    "build/",
  ],

  // 输出目录
  reporter: ["text", "lcov", "html"],

  // 报告目录
  reportDir: "coverage",

  // 覆盖率阈值
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80,

  // 检查覆盖率
  checkCoverage: true,

  // 所有文件检查
  all: true,

  // 源地图
  sourceMap: true,

  // 完整
  produceSourceMap: true,
};

```

## 🔗 集成测试框架

### 1. Supertest + Express配置

```javascript
// tests/integration/app.js
const express = require("express");
const { createServer } = require("http");

const app = express();

// 导入你的Express应用
const mainApp = require("../../src/app");

// 使用中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置路由
app.use("/api", mainApp);

// 错误处理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const server = createServer(app);

module.exports = { app, server };

```

```javascript
// tests/integration/setup.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app, server } = require("./app");

let mongoServer;

beforeAll(async () => {
  // 启动内存MongoDB
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Connected to test database");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  console.log("Disconnected from test database");
});

beforeEach(async () => {
  // 清空数据库
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

```

```javascript
// tests/integration/users.test.js
const request = require("supertest");
const { app } = require("./setup");
const User = require("../../src/models/User");

describe("User API Integration Tests", () => {
  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "Password123!",
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.username).toBe(userData.username);
      expect(response.body.data).not.toHaveProperty("password");

      // 验证数据库中的数据
      const user = await User.findById(response.body.data.id);
      expect(user).toBeTruthy();
      expect(user.username).toBe(userData.username);
    });

    it("should return 400 for invalid data", async () => {
      const invalidData = {
        username: "testuser",
        // 缺少email和password
      };

      const response = await request(app)
        .post("/api/users")
        .send(invalidData)
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return user by id", async () => {
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
      });

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data.`id).toBe(user.`id.toString());
    });

    it("should return 404 for non-existent user", async () => {
      const response = await request(app)
        .get("/api/users/507f1f77bcf86cd799439011")
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });
  });
});

```

### 2. TestContainers配置

```javascript
// tests/integration/testcontainers.js
const { GenericContainer } = require("testcontainers");
const mongoose = require("mongoose");

class TestDatabase {
  constructor() {
    this.container = null;
    this.uri = null;
  }

  async start() {
    // 启动MongoDB容器
    this.container = await new GenericContainer("mongo:6.0")
      .withExposedPorts(27017)
      .withEnv("MONGO_INITDB_ROOT_USERNAME", "test")
      .withEnv("MONGO_INITDB_ROOT_PASSWORD", "test")
      .start();

    const port = this.container.getMappedPort(27017);
    this.uri = `mongodb://test:test@localhost:${port}/testdb?authSource=admin`;

    // 连接到数据库
    await mongoose.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to test database:", this.uri);
  }

  async stop() {
    await mongoose.disconnect();
    if (this.container) {
      await this.container.stop();
    }
    console.log("Stopped test database");
  }

  async cleanup() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}

module.exports = new TestDatabase();

```

## 🎭 端到端测试框架

### 1. Cypress配置

*`cypress.config.js`*：

```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/*`/`.cy.{js,jsx,ts,tsx}",

    // 视频录制
    video: true,
    videosFolder: "cypress/videos",

    // 截图
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",

    // 浏览器
    viewportWidth: 1280,
    viewportHeight: 720,
    chromeWebSecurity: false,

    // 环境变量
    env: {
      apiUrl: "http://localhost:3000/api",
      username: "testuser",
      password: "Test123!",
    },

    // 默认命令超时
    defaultCommandTimeout: 10000,

    // 页面加载超时
    pageLoadTimeout: 60000,

    // 重试
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // 实验性功能
    experimentalStudio: true,
    experimentalWebKitSupport: true,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
    specPattern: "src/*`/`.cy.{js,jsx,ts,tsx}",
  },
});

```

*`support/commands.js`*：

```javascript
// Cypress自定义命令

// 登录命令
Cypress.Commands.add("login", (username, password) => {
  cy.session([username, password], () => {
    cy.visit("/login");
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should("not.include", "/login");
  });
});

// API请求命令
Cypress.Commands.add("api", (method, url, body = null) => {
  const options = {
    method,
    url: `${Cypress.env("apiUrl")}${url}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return cy.request(options);
});

// 等待API完成
Cypress.Commands.add("waitForApi", () => {
  cy.get('[data-cy="loading"]').should("not.exist");
});

```

*`e2e/auth.cy.js`*：

```javascript
describe("Authentication", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display login page", () => {
    cy.url().should("include", "/login");
    cy.get("h1").should("contain", "Login");
  });

  it("should login with valid credentials", () => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.url().should("not.include", "/login");
    cy.get('[data-cy="user-menu"]').should("contain", "testuser");
  });

  it("should show error with invalid credentials", () => {
    cy.get('input[name="username"]').type("invalid");
    cy.get('input[name="password"]').type("invalid");
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="error-message"]')
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });

  it("should logout", () => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.get('[data-cy="user-menu"]').click();
    cy.get('[data-cy="logout-button"]').click();

    cy.url().should("include", "/login");
  });
});

```

### 2. Playwright配置

*`playwright.config.js`*：

```javascript
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["junit", { outputFile: "test-results/junit.xml" }]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: true,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});

```

*`tests/e2e/auth.spec.js`*：

```javascript
const { test, expect } = require("@playwright/test");

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display login page", async ({ page }) => {
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator("h1")).toContainText("Login");
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.locator('input[name="username"]').fill("testuser");
    await page.locator('input[name="password"]').fill("Test123!");
    await page.locator('button[type="submit"]').click();

    await expect(page).not.toHaveURL(/.*login/);
    await expect(page.locator('[data-cy="user-menu"]')).toContainText(
      "testuser",
    );
  });

  test("should show error with invalid credentials", async ({ page }) => {
    await page.locator('input[name="username"]').fill("invalid");
    await page.locator('input[name="password"]').fill("invalid");
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('[data-cy="error-message"]'))
      .toBeVisible()
      .and.toContainText("Invalid credentials");
  });
});

```

## ⚡ 性能测试框架

### 1. JMeter测试计划

*`test-plan.jmx`*：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0">
  <hashTree>
    <TestPlan>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments">
        <collectionProp name="Arguments.arguments">
          <elementProp name="BASE_URL" elementType="Argument">
            <stringProp name="Argument.value">http://localhost:3000</stringProp>
          </elementProp>
          <elementProp name="THREADS" elementType="Argument">
            <stringProp name="Argument.value">100</stringProp>
          </elementProp>
          <elementProp name="RAMP_UP" elementType="Argument">
            <stringProp name="Argument.value">10</stringProp>
          </elementProp>
          <elementProp name="DURATION" elementType="Argument">
            <stringProp name="Argument.value">300</stringProp>
          </elementProp>
        </collectionProp>
      </elementProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup>
        <stringProp name="ThreadGroup.num_threads">${THREADS}</stringProp>
        <stringProp name="ThreadGroup.ramp`time">${RAMP`UP}</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController">
          <boolProp name="LoopController.continue_forever">false</boolProp>
          <stringProp name="LoopController.loops">-1</stringProp>
        </elementProp>
        <stringProp name="ThreadGroup.duration">${DURATION}</stringProp>
      </ThreadGroup>
      <hashTree>
        <!-- HTTP请求 -->
        <HTTPSamplerProxy>
          <stringProp name="HTTPSampler.domain">${BASE_URL}</stringProp>
          <stringProp name="HTTPSampler.path">/api/products</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
        </HTTPSamplerProxy>
      </hashTree>

      <!-- 监听器 -->
      <ResultCollector>
        <stringProp name="filename">results.jtl</stringProp>
      </ResultCollector>
      <hashTree/>
    </hashTree>
  </hashTree>
</jmeterTestPlan>

```

### 2. k6配置

*`load-test.js`*：

```javascript
import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

// 配置
export const options = {
  stages: [
    { duration: "2m", target: 100 }, // 2分钟内增加到100用户
    { duration: "5m", target: 100 }, // 保持100用户5分钟
    { duration: "2m", target: 200 }, // 2分钟内增加到200用户
    { duration: "5m", target: 200 }, // 保持200用户5分钟
    { duration: "2m", target: 0 }, // 2分钟内减少到0用户
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95%的请求在500ms内完成
    http_req_failed: ["rate<0.01"], // 错误率小于1%
  },
};

const BASE`URL = ``ENV.BASE`URL || "http://localhost:3000";

// 测试数据
const products = new SharedArray("products", function () {
  return JSON.parse(open("./data/products.json"));
});

export default function () {
  // 首页
  let res = http.get(`${BASE_URL}/`);
  check(res, {
    "Homepage status 200": (r) => r.status === 200,
  });
  sleep(1);

  // 商品列表
  res = http.get(`${BASE_URL}/api/products`);
  check(res, {
    "Products list status 200": (r) => r.status === 200,
    "Products list has data": (r) => r.json("data").length > 0,
  });
  sleep(1);

  // 商品详情
  const product = products[Math.floor(Math.random() * products.length)];
  res = http.get(`${BASE_URL}/api/products/${product.id}`);
  check(res, {
    "Product detail status 200": (r) => r.status === 200,
    "Product detail has correct id": (r) => r.json("data.id") == product.id,
  });
  sleep(1);
}

```

## 📊 测试报告生成

### 1. Allure配置

*`allure.config.js`*：

```javascript
const { allure } = require("allure-playwright");

module.exports = {
  reporter: [
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        detail: true,
        suiteTitle: true,
        category: [
          {
            name: "Ignored tests",
            matchedStatuses: ["skipped"],
          },
          {
            name: "Infrastructure problems",
            matchedStatuses: ["broken", "failed"],
            messageRegex: /.`ECONNREFUSED.`/,
          },
        ],
      },
    ],
  ],
};

```

### 2. Mochawesome配置

*`.mocharc.js`*：

```javascript
module.exports = {
  reporter: [
    "spec",
    [
      "mochawesome",
      {
        reportDir: "test-results",
        reportFilename: "mochawesome-report",
        reportTitle: "Test Report",
        reportPageTitle: "Test Report",
        charts: true,
        code: true,
        autoOpen: true,
        overwrite: false,
        inline: true,
        inlineAssets: true,
        assetsDir: "assets",
        json: true,
        html: true,
      },
    ],
  ],
};

```

## 📚 参考资料

- Jest官方文档
- Mocha官方文档
- Cypress官方文档
- Playwright官方文档
- JMeter官方文档
- k6官方文档
