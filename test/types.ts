/**
 * Test Adapter Type Definitions
 */

export interface TestAdapter {
  execute(input: any): Promise<any>;
}

export interface TestConfig {
  projectType?: string;
  targetAudience?: string;
  industry?: string;
  [key: string]: any;
}
